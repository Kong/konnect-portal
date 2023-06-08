<template>
  <section
    class="error-wrapper container p-16 mx-auto d-flex flex-column justify-content-center align-items-center"
    data-testid="error-wrapper"
  >
    <div
      v-if="errorCode"
      class="error-wrapper__code mb-2"
    >
      {{ errorCode }}
    </div>

    <div class="text-center mt-2">
      <p
        v-if="description"
        class="mb-4 type-xxl"
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

  &__code {
    -webkit-text-stroke: 2px var(--text_colors-accent);
    color: white;
    font-size: 5rem;
  }
}
</style>
