<template>
  <Content>
    <section
      class="forbidden d-flex flex-column justify-content-center align-items-center"
      data-testid="forbidden"
    >
      <div>
        <img
          class="logo"
          :src="logoSrc"
          :alt="helpText.logoAlt"
        >
      </div>

      <div class="circle d-flex align-items-center justify-content-center">
        {{ helpText.http403 }}
      </div>

      <div class="message text-center">
        <h1 class="mb-1 type-xxl">
          {{ helpText.sorryMessage }}
        </h1>
        <h1 class="mt-0 type-xxl">
          {{ helpText.goBack }}
          <router-link
            data-testid="go-home"
            to="/"
          >
            {{ helpText.home }}
          </router-link>.
        </h1>
      </div>
    </section>
  </Content>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import usePortalApi from '@/hooks/usePortalApi'
import { useI18nStore } from '@/stores'

export default defineComponent({
  name: 'Forbidden',
  setup () {
    const { portalApiV2 } = usePortalApi()
    const logoSrc = portalApiV2.value.getApiLink('/api/v2/portal/logo')
    const helpText = useI18nStore().state.helpText.forbidden

    return {
      logoSrc,
      helpText
    }
  }
})
</script>

<style lang="scss" scoped>
.forbidden {
  --timingFunction: cubic-bezier(.785, .135, .15, .86);
  height: calc(100vh - var(--headerHeight));

  h1,
  .circle {
    opacity: 0;
    animation: .75s var(--timingFunction) forwards fadeIn;
  }

  h1 { animation-delay: 1.25s; }
  .circle { animation-delay: 1s; }

  .circle {
    padding: 3rem;
    margin: 4rem 0;
    font-size: 2.5rem;
    border-radius: 50%;
    border: 1px solid var(--section_colors-stroke);
  }

  .logo {
    max-height: 41px;
  }
}

</style>
