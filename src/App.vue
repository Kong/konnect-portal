<template>
  <div id="app">
    <div
      v-if="globalLoading"
      class="loading-container"
    >
      <KIcon
        icon="spinner"
        size="96"
        color="var(--steel-300)"
      />
    </div>
    <template v-else>
      <Nav v-if="isFullScreen" />

      <router-view v-slot="{ Component }">
        <component
          :is="Component"
          :class="{'page': isFullScreen }"
        />
      </router-view>
    </template>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { mapState, mapActions } from 'pinia'
import { ApiServiceAuthErrorReason } from '@/services/PortalV2ApiService'
import removeElementFromDOMById from '@/helpers/removeElementFromDOMById'
import { isAuthRoute } from '@/router/route-utils'
import Nav from '@/components/Nav.vue'
import { portalApiV2 } from '@/services'
import { useAppStore } from '@/stores'
import { createRedirectHandler } from './helpers/auth'

const initialLoadingId = 'initial-fullscreen-loading-container'

export default defineComponent({
  name: 'App',
  components: {
    Nav
  },
  setup () {
    removeElementFromDOMById(initialLoadingId)
  },
  computed: {
    ...mapState(useAppStore, ['globalLoading']),
    isFullScreen () {
      return !isAuthRoute(this.$route.name) && this.$route.name !== 'not-found-redirect'
    }
  },
  beforeMount () {
    this.initializeApiClients()
  },
  methods: {
    ...mapActions(useAppStore, ['logout']),
    initializeApiClients () {
      // Konnect API Client
      portalApiV2.setAuthErrorCallback(async (err, reason) => {
        // redirect to 403 page if portal api returns HTTP 403 but the session is correct
        if (reason === ApiServiceAuthErrorReason.RESPONSE_FORBIDDEN) {
          this.$router.replace({ name: 'forbidden' })

          return
        }

        if (err) {
          await createRedirectHandler(this.$router, this.logout)()
        }
      })
    }
  }
})
</script>

<style lang="scss">
// Import Kongponent var overrides
@import './assets/kongponents-theme.scss';

#app {
  hr {
    border-color: var(--section_colors-stroke);
  }

  .product-version {
    --KBadgeBorderRadius: 12px;
    --KBadgeMinWidth: auto;
    --KBadgePaddingY: 2px;
    --KBadgePaddingX: var(--spacing-sm);

    vertical-align: text-bottom;
  }
}

</style>

<style lang="scss">
  @import './assets/kongponents-theme.scss';
  .loading-container {
    position: fixed;
    top: 0;
    bottom: 0;
    right: 0;
    left: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 10500;
    flex-direction: column;
    background: var(--white)
  }
</style>
