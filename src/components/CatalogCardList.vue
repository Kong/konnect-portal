<template>
  <div class="responsive-container catalog-card-view">
    <div class="card-grid">
      <CatalogItem
        v-for="(product, index) in products"
        :key="product.id + index"
        class="catalog-item"
        :product="product"
        :has-documentation="product.documentCount > 0"
        :loading="loading"
      />
    </div>
  </div>
</template>

<script lang="ts">
import CatalogItem from './CatalogItem.vue'
import { PropType } from 'vue'
import { CatalogItemModel } from '@/stores'

export default {
  name: 'CatalogCardList',
  components: {
    CatalogItem
  },
  props: {
    products: {
      type: Array as PropType<CatalogItemModel[]>,
      default: () => []
    },
    loading: {
      type: Boolean,
      default: false
    }
  }
}
</script>

<style scoped lang="scss">
.catalog-card-view {
  margin: 0 auto;

  .card-grid {
    width: 100%;
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: $kui-space-70;

    @media (min-width: $kui-breakpoint-phablet){
      grid-template-columns: repeat(3, minmax(0, 1fr));
    }

    @media (min-width: $kui-breakpoint-tablet){
      grid-template-columns: repeat(4, minmax(0, 1fr));
    }
  }

  .catalog-pagination {
    margin-top: $kui-space-60;
  }
}
</style>
