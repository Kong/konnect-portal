<template>
  <router-view v-slot="{ Component }">
    <component :is="Component" />
  </router-view>
</template>

<style lang="scss">
.page, .sidebar-menu {
  position: relative;
  top: var(--portal-ui-header-height);
  padding-bottom: $kui-space-90;
}
</style>
