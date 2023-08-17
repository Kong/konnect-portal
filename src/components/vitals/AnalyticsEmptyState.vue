<template>
  <KEmptyState
    data-testid="analytics-empty-state"
    cta-is-hidden
    icon="stateNoData"
    icon-size="96"
  >
    <template #title>
      <h5>{{ title }}</h5>
    </template>
    <template #message>
      <slot name="message">
        {{ message }}
      </slot>
    </template>
  </KEmptyState>
</template>

<script setup lang="ts">
withDefaults(defineProps<{
  title?: string,
  message?: string
}>(), {
  title: '',
  message: ''
})
</script>

<style lang="scss">
// !important required because kemptystate has no theming options
.empty-state-wrapper {
  color: var(--text_colors-primary) !important;
  border-color: var(--section_colors-stroke, #E7E7EC) !important;
  border-width: 1px;
  background-color: var(--section_colors-body, #fff) !important;

  .k-empty-state-message {
    color: var(--text_colors-primary) !important;
  }

  .k-empty-state-title-header {
    color: var(--text_colors-headings) !important;
  }

  .k-button {
    background-color: var(--button_colors-primary-fill, #000) !important;
    color: var(--text_colors-primary, #fff) !important;
    font-weight: 600 !important;
    border-radius: 100px;
  }

  svg {
    display: inline-block;
    margin: 0 auto;
  }
}
</style>
