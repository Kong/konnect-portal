<template>
  <Section
    v-if="documentTree.length && props.service"
    title="Overview"
  >
    <DocumentTree
      :documents="documentTree"
      :service-package-id="props.service.id"
      :active-document-id="activeDocumentId"
    />
  </Section>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import Section from './Section.vue'
import DocumentTree from '@/components/ApiDocumentation/DocumentTree.vue'
import { useProductStore } from '@/stores'

const props = defineProps({
  service: {
    type: Object,
    required: true
  }
})

const productStore = useProductStore()
const { documentTree, activeDocumentId } = storeToRefs(productStore)

</script>

<style scoped>

</style>
