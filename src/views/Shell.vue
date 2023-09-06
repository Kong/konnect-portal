<template>
  <router-view v-slot="{ Component }">
    <component :is="Component" />
  </router-view>
</template>

<style lang="scss">
.page, .sidebar-menu {
  padding-bottom: var(--spacing-xl);
  position: relative;
  top: var(--headerHeight);
}
</style>
