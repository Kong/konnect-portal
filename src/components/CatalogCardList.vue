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
    <PaginationBar
      class="catalog-pagination mt-4"
      :page-size="pageSize"
      :total-count="totalCount"
      :search-triggered="searchTriggered"
      @pageChanged="onPageChanged"
    />
  </div>
</template>

<script lang="ts">
import CatalogItem from './CatalogItem.vue'
import PaginationBar from './PaginationBar.vue'
import { PropType } from 'vue'
import { CatalogItemModel } from '@/stores'

export default {
  name: 'CatalogCardList',
  components: {
    CatalogItem,
    PaginationBar
  },
  props: {
    products: {
      type: Array as PropType<CatalogItemModel[]>,
      default: () => []
    },
    pageSize: {
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
  emits: ['page-changed'],
  methods: {
    onPageChanged (page) {
      this.$emit('page-changed', page)
    }
  }
}
</script>
