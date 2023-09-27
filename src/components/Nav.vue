<template>
  <header
    id="site-header"
  >
    <div class="nav-container responsive-container">
      <router-link to="/">
        <img
          class="logo"
          :src="logoSrc"
          :alt="helpText.logoAlt"
        >
      </router-link>
      <nav class="flex items-center links">
        <router-link
          data-testid="catalog-link"
          :to="{ name: 'catalog' }"
          class="catalog-link"
        >
          <div class="background-color-wrapper" />
          {{ helpText.catalog }}
        </router-link>

        <UserDropdown
          v-if="developer && !isPublic"
          :email="developer.email"
          @logout="logout"
        />
      </nav>
    </div>
  </header>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { mapState, storeToRefs } from 'pinia'
import { useI18nStore, useAppStore } from '@/stores'
import UserDropdown from './UserDropdown.vue'
import usePortalApi from '@/hooks/usePortalApi'

export default defineComponent({
  name: 'Nav',
  components: { UserDropdown },
  setup () {
    const appStore = useAppStore()
    const { globalLoading } = storeToRefs(appStore)
    const helpText = useI18nStore().state.helpText.nav

    const logout = async () => {
      globalLoading.value = true

      const logoutUrl = await appStore.logout()

      window.location.href = logoutUrl
    }
    const { portalApiV2 } = usePortalApi()
    const logoSrc = portalApiV2.value.getApiLink('/api/v2/portal/logo')

    return {
      logout,
      logoSrc,
      helpText
    }
  },

  computed: {
    ...mapState(useAppStore, {
      developer: store => store.developerSession.data?.developer,
      isPublic: 'isPublic'
    })
  }

})
</script>

<style lang="scss" scoped>
.logo {
  max-height: 41px;
}

.nav-container {
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 $kui-space-80;

  .catalog-link {
    padding: $kui-space-40;
    margin-right: $kui-space-40;
  }
}

#site-header {
  height: var(--portal-ui-header-height);
  background-color: var(--section_colors-header);
  border-bottom: 1px solid var(--section_colors-stroke);
  display: flex;
  align-items: center;
  position: fixed;
  width: 100%;
  top: 0px;
  z-index: 10;

  .links a {
    color: var(--text_colors-header);
    &:hover{
      backdrop-filter: brightness(1.35);
    }
  }
}
</style>
