<template>
  <div class="container max-w-screen-2xl mx-auto catalog-card-view">
    <div class="w-full grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
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
