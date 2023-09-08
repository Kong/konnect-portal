<template>
  <div class="responsive-container content-container">
    <slot />
  </div>
</template>

<style lang="scss" scoped>
  .content-container {
    margin: 0 auto;
    padding-top: $kui-space-90;
    padding-left: $kui-space-80;
    padding-right: $kui-space-80;
  }
</style>
