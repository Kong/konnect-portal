<template>
  <section>
    <header
      v-if="title"
      class="header-wrapper"
    >
      <h2>{{ title }}</h2>
    </header>
    <slot />
  </section>
</template>

<script setup lang="ts">
defineProps({
  title: {
    type: String,
    default: null
  }
})
</script>

<style scoped lang="scss">
section {
  margin: 32px 0;
}

.header-wrapper {
  margin-bottom: $kui-space-50;
}

section:first-of-type {
  margin-top: 24px;
}

h2 {
  font: 500 12px var(--font-base);
  color: var(--text_colors-primary);
}
</style>
