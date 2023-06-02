<template>
  <AuthCard v-if="isBasicAuthEnabled">
    <!-- Kong Auth Element requires the wrapper with corresponding id attribute -->
    <div id="kong-auth-register-wrapper">
      <kong-auth-register
        wrapper-id="kong-auth-register-wrapper"
        :register-request-endpoint="registerEndpoint"
        :wrap-request="wrapRegisterRequest"
        register-button-text="Create Account"
        @register-success="onRegisterSuccess"
      />
    </div>
    <template
      #below-card
    >
      <div
        id="login-encouragement-message"
        class="mt-6 text-center"
      >
        <p class="color-text_colors-primary">
          {{ helpText.registration.alreadyCreated }}
          <router-link
            :to="{ name: 'login' }"
          >
            {{ helpText.registration.login }}
            <KIcon
              color="var(--text_colors-link)"
              icon="forward"
            />
          </router-link>
        </p>
      </div>
    </template>
  </AuthCard>
</template>

<script lang="ts">
import { storeToRefs } from 'pinia'
import { defineComponent, computed, onBeforeMount } from 'vue'
import { LocationQueryValueRaw, useRouter } from 'vue-router'
import usePortalApi from '@/hooks/usePortalApi'
import AuthCard from '@/components/AuthCard.vue'
import { useI18nStore, useAppStore } from '@/stores'

export default defineComponent({
  name: 'Registration',
  components: {
    AuthCard
  },
  setup () {
    const helpText = useI18nStore().state.helpText
    const $router = useRouter()

    const appStore = useAppStore()
    const { authClientConfig } = storeToRefs(appStore)
    const isBasicAuthEnabled = computed(() => authClientConfig.value.basicAuthEnabled)
    const { portalApiV2 } = usePortalApi()

    function onRegisterSuccess () {
      // Need to cast this type as boolean isn't accepted
      $router.push({ path: '/login', query: { registered: true as unknown as LocationQueryValueRaw } })
    }

    function wrapRegisterRequest (formData) {
      // This transforms the object as the new api expects full_name
      formData.full_name = formData.fullName
      delete formData.fullName

      return formData
    }

    onBeforeMount(() => {
      if (!isBasicAuthEnabled.value) {
        $router.push({ path: '/login' })
      }
    })

    return {
      registerEndpoint: portalApiV2.value.getApiLink('/api/v2/developer'),
      onRegisterSuccess,
      isBasicAuthEnabled,
      wrapRegisterRequest,
      helpText
    }
  }
})
</script>

<style lang="scss">
#login-encouragement-message .kong-icon {
  vertical-align: middle;
}
</style>
