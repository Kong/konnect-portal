<template>
  <Section v-if="product && product.versions.length">
    <KSkeleton v-if="isLoading" />
    <SpecOperationsList
      v-else-if="operations"
      :operations="operations"
      :deselect="deselectOperation"
      width="100%"
      class="operations-list"
      @selected="emit('operationSelected', $event)"
    />
  </Section>
</template>

<script lang="ts" setup>
import { ref, watch } from 'vue'
import Section from './Section.vue'
import { SpecOperationsList } from '@kong-ui-public/spec-renderer'
import { portalApiV2 } from '@/services'
import { CustomOperation, useProductStore } from '@/stores'
import '@kong-ui-public/spec-renderer/dist/style.css'

const operations = ref<CustomOperation[]>(null)
const isLoading = ref(true)

const props = defineProps({
  product: {
    type: Object,
    required: true
  },
  activeProductVersionId: {
    type: String,
    required: true
  },
  deselectOperation: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['operationSelected'])

const productStore = useProductStore()

async function fetchOperations () {
  const productId = props.product?.id
  const productVersionId = props.activeProductVersionId

  if (!productId || !productVersionId) {
    return
  }

  isLoading.value = true

  try {
    const res = await portalApiV2.service.versionsApi.getProductVersionSpecOperations({
      productId,
      productVersionId
    })

    operations.value = res.data.operations?.map((operation) => ({
      ...operation,
      operationId: operation.operation_id
    })) as CustomOperation[]

    productStore.setSidebarOperations(operations.value)
  } catch (err) {
    console.error(err)
  } finally {
    isLoading.value = false
  }
}

fetchOperations()

watch([() => props.product, () => props.activeProductVersionId], fetchOperations)

</script>

<style scoped lang="scss">
.operations-list {
  --kong-ui-spec-renderer-operations-list-item-summary-text-color: var(--text_colors-primary);
  --kong-ui-spec-renderer-operations-list-section-label-text-color: var(--text_colors-primary);
  --kong-ui-spec-renderer-operations-list-section-icon-color-expanded: var(--text_colors-primary);
  --kong-ui-spec-renderer-operations-list-section-icon-color-collapsed: var(--text_colors-primary);
  --kong-ui-spec-renderer-operations-list-filter-icon-color: var(--text_colors-primary);
  --kong-ui-spec-renderer-operations-list-item-selected-bar-background: var(--section_colors-accent);
  --kong-ui-spec-renderer-operations-list-section-border-color: var(--section_colors-stroke);
  --kong-ui-spec-renderer-operations-list-item-border-color: var(--section_colors-stroke);

  // Hover and selected styles
  --kong-ui-spec-renderer-operations-list-item-background-hover: var(--text_colors-primary);
  --kong-ui-spec-renderer-operations-list-item-summary-text-color-hover: var(--section_colors-body);
  --kong-ui-spec-renderer-operations-list-item-background-selected: var(--text_colors-primary);
  --kong-ui-spec-renderer-operations-list-item-summary-text-color-selected: var(--section_colors-body);

  :deep(.k-input) {
    padding-left: 32px !important;
  }
}
</style>
