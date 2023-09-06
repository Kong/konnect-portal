<template>
  <header class="flex flex-col sm:flex-row justify-between sm:items-center">
    <div class="flex-1">
      <slot>
        <h1 class="m-0 type-xl color-text_colors-headings">
          {{ title }}
        </h1>
      </slot>
    </div>
    <div>
      <slot name="right" />
    </div>
  </header>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'PageTitle',
  props: {
    title: {
      type: String,
      default: ''
    }
  }
})
</script>

<style lang="scss" scoped>
header > div:first-child {
  @media only screen and (max-width: 480px) {
    margin-bottom: var(--spacing-sm);
  }
}
</style>
