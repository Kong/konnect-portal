<template>
  <header class="title-container">
    <div>
      <slot>
        <h1 class="title color-text_colors-headings">
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
  .title-container {
    display: flex;
    justify-content: space-between;
    align-items: center;

    .title {
      flex: 1 1 0;
      margin: 0;
      font-size: $kui-font-size-60;
    }
  }
</style>
