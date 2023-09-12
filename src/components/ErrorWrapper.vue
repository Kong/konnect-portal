<template>
  <section
    class="error-wrapper responsive-container"
    data-testid="error-wrapper"
  >
    <div
      v-if="errorCode"
      class="error-wrapper__code"
    >
      {{ errorCode }}
    </div>

    <div class="description-wrapper">
      <p
        v-if="description"
        class="description"
      >
        {{ description }}
      </p>
      <router-link
        data-testid="error-wrapper-link"
        to="/"
      >
        {{ linkText }}
      </router-link>.
    </div>
  </section>
</template>

<script lang="ts">
import { useI18nStore } from '@/stores'
import { defineComponent } from 'vue'
const helpText = useI18nStore().state.helpText.errorWrapper

export default defineComponent({
  name: 'ErrorWrapper',
  props: {
    errorCode: {
      type: Number,
      default: null
    },
    description: {
      type: String,
      default: ''
    },
    linkText: {
      type: String,
      default: helpText.linkText
    },
    to: {
      type: String,
      default: '/'
    }
  }
})
</script>

<style lang="scss" scoped>

.error-wrapper  {
  border: 1px solid var(--section_colors-stroke);
  border-top: 3px solid var(--text_colors-accent);
  padding: $kui-space-130;
  margin-left: auto;
  margin-right: auto;
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;

  &__code {
    -webkit-text-stroke: 2px var(--text_colors-accent);
    color: white;
    font-size: 5rem;
    margin-bottom: $kui-space-40;
  }

  .description-wrapper {
    text-align: center;
    margin-top: $kui-space-40;

    .description {
      margin-bottom: $kui-space-60;
      font-size: $kui-font-size-70;
    }
  }
}
</style>
