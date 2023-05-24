<template>
  <AuthCard>
    <!-- Kong Auth Element requires the wrapper with corresponding id attribute -->
    <div id="kong-auth-reset-password-wrapper">
      <kong-auth-reset-password
        wrapper-id="kong-auth-reset-password-wrapper"
        @reset-password-success="onResetPasswordSuccess"
      />
    </div>
  </AuthCard>
</template>

<script lang="ts">
import AuthCard from '@/components/AuthCard.vue'

import { defineComponent } from 'vue'
import { LocationQueryValueRaw, useRouter } from 'vue-router'

export default defineComponent({
  name: 'ResetPassword',
  components: {
    AuthCard
  },
  setup () {
    const $router = useRouter()

    function onResetPasswordSuccess (event: {email?: string} = {}) {
      const { email } = event

      $router.push({ path: '/login', query: { passwordReset: true as unknown as LocationQueryValueRaw, email } })
    }

    return {
      onResetPasswordSuccess
    }
  }

})
</script>
<style lang="scss" scoped>
input.k-input::placeholder {
  color: var(--KInputPlaceholderColor);
  opacity: 0.57;
}
</style>
