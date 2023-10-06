<template>
  <aside>
    <div class="content">
      <header>
        <span class="title">
          {{ product?.name }}
        </span>
        <KAlert
          v-if="product && !versionSelectItems.length"
          appearance="warning"
          :alert-message="helpText.noVersions"
          class="no-versions"
        />
        <KSelect
          appearance="select"
          class="version-select-dropdown"
          width="100%"
          data-testid="version-select-dropdown"
          :enable-filtering="false"
          :items="versionSelectItems"
          @change="onChangeVersion"
        >
          <template #empty>
            <div>{{ noResultsMessage }}</div>
          </template>
        </KSelect>
      </header>
      <SectionOverview :product="product" />
      <SectionReference
        :active-product-version-id="activeProductVersionId"
        :product="product"
        :deselect-operation="deselectOperation"
        @operation-selected="emit('operationSelected', $event)"
      />
    </div>
  </aside>
</template>

<script lang="ts" setup>
import { onMounted, watch, ref } from 'vue'
import SectionOverview from './sidebar/SectionOverview.vue'
import SectionReference from './sidebar/SectionReference.vue'
import { storeToRefs } from 'pinia'
import { useI18nStore, useProductStore } from '@/stores'

const productStore = useProductStore()
const { product, activeProductVersionId } = storeToRefs(productStore)
const helpText = useI18nStore().state.helpText.sidebar
const noResultsMessage = helpText.noResultsProduct

const emit = defineEmits(['operationSelected'])

defineProps({
  deselectOperation: {
    type: Boolean,
    default: false
  }
})

const versionSelectItems = ref([])

function updateVersionSelectItems () {
  versionSelectItems.value = product.value?.versions
    .slice() // clone before sorting
    .sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime())
    .map((productVersion) => ({
      value: productVersion.id,
      label: `${productVersion.name}${productVersion.deprecated ? helpText.deprecated : ''}`,
      selected: productVersion.id === activeProductVersionId.value
    })) || []
}

function onChangeVersion (event) {
  const version = product.value?.versions.find((productVersion) => productVersion.id === event.value)
  if (!version) {
    return
  }

  productStore.setActiveProductVersionId(version.id)
}

onMounted(() => {
  updateVersionSelectItems()
})

watch([
  () => product.value,
  () => activeProductVersionId.value
], () => {
  updateVersionSelectItems()
})

</script>

<style scoped lang="scss">
  aside {
    width: 100%;
    max-width: 330px;
  }

  .content {
    padding: $kui-space-90 $kui-space-80;

    header {
      margin-bottom: $kui-space-90;
    }

    .no-versions {
      margin-bottom: $kui-space-60;
    }
  }

  .title {
    color: var(--text_colors-primary);
    display: block;
    font-size: 20px;
    font-weight: 500;
    margin-bottom: $kui-space-80;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .version-select-dropdown :deep(div.k-select-input.select-input-container) {
    border-color: var(--section_colors-stroke);
  }
</style>
