<template>
  <AuthCard v-if="!['success_login', 'user_fetch'].includes(currentState.value as string)">
    <template #default>
      <KAlert
        v-if="currentState.matches('error')"
        :alert-message="errorMessage"
        appearance="danger"
        class="justify-content-center my-3"
        data-testid="unauthenticated-message"
      />
      <!-- Kong Auth Element requires the wrapper with corresponding id attribute -->
      <div
        v-if="['idle','error'].includes(currentState.value as string) && redirectTo"
        id="kong-auth-login-wrapper"
      >
        <kong-auth-login
          wrapper-id="kong-auth-login-wrapper"
          show-forgot-password-link
          :register-success-text="helpText.registration.successText"
          :idp-login-return-to="redirectTo"
          :basic-auth-login-enabled="authClientConfig.basicAuthEnabled"
          :idp-login-enabled="authClientConfig.oidcAuthEnabled"
          @login-success="onLoginSuccess"
          @click-forgot-password-link="onUserClickForgotPassword"
          @verify-email-success="onVerifyEmailSuccess"
        />
      </div>
    </template>
    <template
      v-if="isBasicAuthEnabled && ['idle','error'].includes(currentState.value as string)"
      #below-card
    >
      <span
        id="sign-up-encouragement-message"
        data-testid="sign-up-encouragement-message"
        class="mt-6 text-center"
      >
        <p class="color-text_colors-primary">
          {{ helpText.login.missingAccount }}
          <router-link :to="{ name: 'registration' }">
            {{ helpText.login.signUp }}
            <KIcon
              color="var(--text_colors-link)"
              icon="forward"
            />
          </router-link>
        </p>
      </span>
    </template>
  </AuthCard>
</template>

<script lang="ts">
import { storeToRefs } from 'pinia'
import { defineComponent, computed, ref, onMounted } from 'vue'
import { useMachine } from '@xstate/vue'
import { createMachine } from 'xstate'
import AuthCard from '@/components/AuthCard.vue'
import usePortalApi from '@/hooks/usePortalApi'
import useLaunchDarkly from '@/composables/useLaunchDarkly'
import { useRouter } from 'vue-router'
import { useI18nStore, useAppStore } from '@/stores'

export default defineComponent({
  name: 'Login',
  components: {
    AuthCard
  },
  setup () {
    const errorMessage = ref('')
    const { portalApiV2 } = usePortalApi()
    const helpText = useI18nStore().state.helpText
    const appStore = useAppStore()
    const {
      developerSession: session,
      authClientConfig
    } = storeToRefs(appStore)

    const isBasicAuthEnabled = computed(() => authClientConfig.value.basicAuthEnabled)

    const { initialize: initLaunchDarkly } = useLaunchDarkly()

    const $router = useRouter()

    const redirectTo = ref('')

    const onUserClickForgotPassword = () => {
      $router.push({ path: '/forgot-password' })
    }

    const onVerifyEmailSuccess = (event: {email?: string, resetToken?: string} = {}) => {
      const { email, resetToken } = event

      $router.push({ path: '/reset-password', query: { email, token: resetToken } })
    }

    const { state: currentState, send } = useMachine(createMachine({
      id: 'loginMachine',
      predictableActionArguments: true,
      initial: 'idle',
      states: {
        idle: {
          on: {
            KAUTH_SUCCESS: 'user_fetch'
          }
        },
        success_login: { type: 'final' },
        user_fetch: { on: { USER_FETCH_SUCCESS: 'success_login', USER_FETCH_FAIL: 'error' } },
        error: { on: { KAUTH_SUCCESS: 'user_fetch' } }
      }
    }))

    const getError = (data, error) => {
      const responseError =
            (data.message && data.message[0] && data.message[0]?.constraints) ||
            data.message ||
            error.message

      return Array.isArray(responseError)
        ? responseError.join('. ')
        : responseError
    }

    const onLoginSuccess = async () => {
      send('KAUTH_SUCCESS')

      let me, context

      try {
        [me, context] = await Promise.all([
          portalApiV2.value.service.developerApi.getDeveloperMe(),
          portalApiV2.value.service.portalApi.getPortalContext()
        ])
      } catch (error) {
        send('USER_FETCH_FAIL')

        const { data } = error.response
        if (error.response.status === 401) {
          errorMessage.value = helpText.login.unauthenticated

          return
        }

        errorMessage.value = getError(data, error)
      }

      send('USER_FETCH_SUCCESS')

      const { setPortalData } = useAppStore()

      setPortalData({ featureSet: context.data.feature_set })

      session.value.saveData({
        ...session.value.data,
        developer: me.data
      })

      let fullPath = '/'

      if (session.value.data.to) {
        // If we have previous path which we tried to access but got 403
        // set is to next url
        fullPath = session.value.data.to
      }

      // update launch darkly user context after successful login
      try {
        await initLaunchDarkly()
      } catch (e) {
        console.error('Unable to update LD context')
      }

      window.location.href = fullPath
    }

    onMounted(() => {
      redirectTo.value = window.location.origin + '/login'
    })

    return {
      isBasicAuthEnabled,
      currentState,
      errorMessage,
      onUserClickForgotPassword,
      onLoginSuccess,
      onVerifyEmailSuccess,
      session,
      authClientConfig,
      redirectTo,
      helpText
    }
  }
})
</script>

<style lang="scss">
.auth-card {
  width: 528px;
}

#sign-up-encouragement-message .kong-icon {
  vertical-align: middle;
}

#kong-auth-login-wrapper {
  [data-testid="kong-auth-login-sso"] {
    color: var(--button_colors-primary-text) !important;
    background-color: var(--button_colors-primary-fill) !important;

    svg {
      path {
        fill: var(--button_colors-primary-text) !important;;
      }
    }
  }
}
</style>
