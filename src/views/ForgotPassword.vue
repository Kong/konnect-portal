<template>
  <AuthCard class="forgot-password">
    <h3 class="heading-text color-text_colors-primary">
      {{ helpText.heading }}
    </h3>
    <p class="subheading-text color-text_colors-secondary">
      {{ helpText.subHeading }}
    </p>
    <!-- Kong Auth Element requires the wrapper with corresponding id attribute -->
    <div id="kong-auth-forgot-password-wrapper">
      <kong-auth-forgot-password
        wrapper-id="kong-auth-forgot-password-wrapper"
        :reset-password-request-endpoint="forgotPasswordEndpoint"
        :wrap-request="wrapForgotPasswordRequest"
        :success-text="helpText.successText"
        @click-login-link="onUserClickLogin"
      />
    </div>
  </AuthCard>
</template>

<script lang="ts">
import AuthCard from '@/components/AuthCard.vue'

import { defineComponent } from 'vue'
import { useRouter } from 'vue-router'
import { useI18nStore } from '@/stores'

export default defineComponent({
  name: 'ForgotPassword',
  components: {
    AuthCard
  },

  setup () {
    const $router = useRouter()
    const helpText = useI18nStore().state.helpText.forgotPassword

    function onUserClickLogin () {
      $router.push({ path: '/login' })
    }

    function wrapForgotPasswordRequest (formData) {
      return formData
    }

    return {
      helpText,
      wrapForgotPasswordRequest,
      onUserClickLogin,
      forgotPasswordEndpoint: 'api/v2/developer/forgot-password'
    }
  }

})
</script>

<style lang="scss" scoped>
.forgot-password {

  .heading-text {
    font-size: $kui-font-size-50;
    line-height: $kui-line-height-50;
    text-align: center;
    margin-bottom: $kui-space-60;
  }
  .subheading-text {
    text-align: center;
    margin-bottom: $kui-space-70;
  }

}
</style>
