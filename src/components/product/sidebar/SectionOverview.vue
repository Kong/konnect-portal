<template>
  <Section
    v-if="documentTree.length && props.product"
    :title="helpText.title"
  >
    <DocumentTree
      :documents="documentTree"
      :product-id="props.product.id"
      :active-document-id="activeDocumentId"
    />
  </Section>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import Section from './Section.vue'
import DocumentTree from '@/components/ApiDocumentation/DocumentTree.vue'
import { useProductStore, useI18nStore } from '@/stores'

const helpText = useI18nStore().state.helpText.sectionOverview

const props = defineProps({
  product: {
    type: Object,
    required: true
  }
})

const productStore = useProductStore()
const { documentTree, activeDocumentId } = storeToRefs(productStore)

</script>
