<template>
  <div class="products-content px-5">
    <div class="container max-w-screen-2xl mx-auto mt-6 mb-5 flex justify-between">
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
      <div class="product-catalog-no-products type-lg color-text_colors-secondary">
        <template v-if="!loading">
          <EmptyState class="mb-2 mx-auto" />
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
import useLDFeatureFlag from '@/hooks/useLDFeatureFlag'
import { FeatureFlags } from '@/constants/feature-flags'

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
    const apiProductLanguageEnabled = useLDFeatureFlag(FeatureFlags.ApiProductBuilder, false)
    const catalogTitle = apiProductLanguageEnabled ? helpText.entityTypeProduct : helpText.entityTypeService
    const noResultsMessage = apiProductLanguageEnabled ? helpText.noResultsProduct : helpText.noResultsService

    return {
      helpText,
      catalogTitle,
      noResultsMessage
    }
  },
  data () {
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
    setActiveView (val) {
      this.activeView = val
      localStorage.setItem('portal-catalog-view', val)
      this.$emit('active-view-changed', val)
    }
  }
})
</script>

<style lang="scss" scoped>
.products-content {
  --grey-500: var(--button_colors-primary-fill);

  .products-label {
    color: var(--text_colors-primary);
    font-size: var(--type-xl);
    font-weight: normal;
  }

  .view-switch-button {
    --grey-500: var(--text_colors-primary);
    --spacing-xs: 6px;
    --spacing-md: 6px;
    --KButtonOutlineBase: var(--section_colors-body);
    --KButtonOutlineBorder: var(--text_colors-primary);
    --KButtonOutlineHover: var(--section_colors-tertiary);

    border: 1px solid var(--KButtonOutlineBorder) !important;
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
  padding: 20px var(--spacing-xs);
}
</style>
