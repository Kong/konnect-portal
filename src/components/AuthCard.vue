<template>
  <div class="auth h-screen d-flex align-items-center justify-content-center flex-column">
    <KCard
      has-shadow
      data-testid="auth-form"
      class="auth-card col-10 col-md-6"
    >
      <template #body>
        <div class="d-flex flex-column justify-content-center align-items-center mb-5 card-header">
          <router-link :to="headerRouteLink">
            <img
              class="logo"
              :src="logoSrc"
              :alt="helpText.logoAlt"
            >
          </router-link>
        </div>
        <slot />
      </template>
    </KCard>
    <slot name="below-card" />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import usePortalApi from '@/hooks/usePortalApi'
import { useAppStore, useI18nStore } from '@/stores'

export default defineComponent({
  name: 'AuthCard',
  setup () {
    const { portalApiV2 } = usePortalApi()
    const { isPublic } = useAppStore()
    const helpText = useI18nStore().state.helpText.authCard
    const logoSrc: string = portalApiV2.value.getApiLink('/api/v2/portal/logo')

    return {
      helpText,
      logoSrc,
      headerRouteLink: isPublic ? '/' : '/login'
    }
  }
})

</script>

<style lang="scss" scoped>
.logo {
  max-height: 41px;
}

.auth {
  --KCardPaddingY: 2rem;
  --KCardPaddingX: 2rem;
  --KCardBorder: 1px solid var(--section_colors-stroke);
  --KButtonPaddingY: 1rem;

  background-color: var(--section_colors-body);
  .auth-card {
    width: 528px;
    @media only screen and (max-device-width: 528px) {
      width: 320px
    }

    :deep(.k-button) {
      justify-content: center;
    }

    .card-header {
      height: 6rem;
      margin: calc(var(--KCardPaddingY) * -1) calc(var(--KCardPaddingY) * -1) 0;
      padding: 2rem;
      border-radius: 3px 3px 0 0;
      background-color: var(--section_colors-hero);
    }
  }
}
</style>
