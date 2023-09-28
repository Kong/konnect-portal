<template>
  <div class="products-content">
    <div class="products-container responsive-container">
      <span class="products-label">{{ catalogTitle }}</span>
      <KViewSwitcher
        data-testid="view-switcher"
        :disabled="disabled"
        :view="activeView"
        @view-changed="setActiveView"
      />
    </div>
    <div
      v-if="!catalogItems.length"
      class="product-catalog-empty-state"
    >
      <div class="product-catalog-no-products color-text_colors-secondary">
        <template v-if="!loading">
          <EmptyState class="empty-products" />
          {{ noResultsMessage }}
        </template>
        <div
          v-else
          class="product-catalog-loading-spinner"
        >
          <KSkeleton
            :delay-milliseconds="0"
          />
        </div>
      </div>
    </div>
    <div v-else>
      <CatalogCardList
        v-if="activeView == 'grid'"
        :products="catalogItems"
        :page-size="cardsPerPage"
        :total-count="totalCount"
        :search-triggered="searchTriggered"
        :loading="loading"
        @page-changed="$emit('cards-page-changed', $event)"
      />
      <CatalogTableList
        v-else
        :products="catalogItems"
        :loading="loading"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { PropType, defineComponent } from 'vue'
import EmptyState from '../assets/catalog-empty-state.svg'
import CatalogCardList from './CatalogCardList.vue'
import CatalogTableList from './CatalogTableList.vue'
import { CatalogItemModel, useI18nStore } from '@/stores'

export default defineComponent({
  name: 'Catalog',
  components: {
    CatalogCardList,
    CatalogTableList,
    EmptyState
  },
  props: {
    catalogItems: {
      type: Array as PropType<CatalogItemModel[]>,
      default: () => []
    },
    cardsPerPage: {
      type: Number,
      default: 12
    },
    totalCount: {
      type: Number,
      default: 0
    },
    searchTriggered: {
      type: Boolean,
      default: false
    },
    loading: {
      type: Boolean,
      default: false
    }
  },
  emits: ['cards-page-changed', 'active-view-changed'],
  setup () {
    const helpText = useI18nStore().state.helpText.catalog
    const catalogTitle = helpText.entityTypeProduct
    const noResultsMessage = helpText.noResultsProduct

    return {
      helpText,
      catalogTitle,
      noResultsMessage
    }
  },
  data (): { activeView: 'grid' | 'table'} {
    return {
      activeView: 'grid'
    }
  },
  computed: {
    disabled () {
      return this.catalogItems.length === 0 ? true : null
    }
  },
  mounted () {
    const activeView = localStorage.getItem('portal-catalog-view') || 'grid'

    this.setActiveView(activeView)
  },
  methods: {
    setActiveView (val: 'grid' | 'table') {
      this.activeView = val
      localStorage.setItem('portal-catalog-view', val)
      this.$emit('active-view-changed', val)
    }
  }
})
</script>

<style lang="scss" scoped>
.products-content {
  padding: 0 $kui-space-80;

  .products-label {
    color: var(--text_colors-primary);
    font-size: $kui-font-size-70;
    font-weight: normal;
  }

  .products-container {
    display: flex;
    justify-content: space-between;
    margin: $kui-space-90 auto $kui-space-80 auto;
  }

  .view-switch-button {
    padding: $kui-space-30;
    border: 1px solid var(--text_colors-primary) !important;

    :deep(.icon) {
      i {
        background-color: var(--text_colors-primary);;
      }
    }
  }
}

.product-catalog-empty-state {
  margin: auto;
  width: 20rem;
  display: block;
}

.product-catalog-loading-spinner {
  width: 100%;
  display: flex;
}

.product-catalog-no-products {
  text-align: center;
  padding: 20px $kui-space-40;
  font-size: $kui-font-size-50;

  .empty-products {
    margin: 0 auto $kui-space-40 auto;
  }
}
</style>
