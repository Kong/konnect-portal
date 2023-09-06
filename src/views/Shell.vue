<template>
  <router-view v-slot="{ Component }">
    <component :is="Component" />
  </router-view>
</template>

<style lang="scss">
.page, .sidebar-menu {
  position: relative;
  top: var(--headerHeight);
  padding-bottom: var(--spacing-xl);
}
</style>
