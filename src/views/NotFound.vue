<template>
  <Content>
    <section
      class="not-found"
      data-testid="404"
    >
      <div>
        <img
          class="logo"
          :src="logoSrc"
          :alt="helpText.logoAlt"
        >
      </div>

      <div class="circle">
        {{ helpText.http404 }}
      </div>

      <div class="message">
        <h1 class="sorry-message">
          {{ helpText.sorryMessage }}
        </h1>
        <h1 class="go-back">
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
  name: 'NotFound',
  setup () {
    const { portalApiV2 } = usePortalApi()

    const logoSrc = portalApiV2.value.getApiLink('/api/v2/portal/logo')
    const helpText = useI18nStore().state.helpText.notFound

    return {
      logoSrc,
      helpText
    }
  }
})
</script>

<style lang="scss" scoped>
.not-found {
  --timingFunction: cubic-bezier(.785, .135, .15, .86);
  height: calc(100vh - var(--headerHeight));
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  h1,
  .circle {
    opacity: 0;
    animation: .75s var(--timingFunction) forwards fadeIn;
    display: flex;
    align-items: center;
    justify-content: center;
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
  .message {
    text-align: center;
    .sorry-message {
      margin-bottom: 4px;
      font-size: 24px;
      font-weight: 32px;
    }
    .go-back {
      margin-top: 0;
      font-size: 24px;
      font-weight: 32px;
    }
  }
}

</style>
