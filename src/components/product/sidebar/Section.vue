<template>
  <section>
    <header
      v-if="title"
      class="mb-3"
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

<style scoped>
section {
  margin: 32px 0;
}

section:first-of-type {
  margin-top: 24px;
}

h2 {
  font: 500 12px var(--font-base);
  color: var(--text_colors-primary);
}
</style>
