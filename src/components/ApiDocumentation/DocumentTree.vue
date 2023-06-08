<template>
  <ul>
    <li
      v-for="document in documents"
      :key="document.id"
    >
      <KCollapse
        v-if="document.children && document.children.length"
        v-model="isNodeCollapsedMap[document.id]"
        class="collapse-container"
      >
        <template #trigger>
          <!--template with any content to override the default #trigger slot-->
          <div />
        </template>
        <template #visible-content>
          <div class="expandable-node-container">
            <router-link
              :to="{ name: 'api-documentation-page', params: { product: productId, slug: [parentDocumentSlug, document.slug].filter(Boolean) } }"
              :style="{ paddingLeft: `${level - 1}rem` }"
              :class="{ title: true }"
            >
              {{ document.title }}
            </router-link>
            <button
              class="expand-button"
              :class="!isNodeCollapsedMap[document.id] ? 'expand-icon' : null"
              @click="isNodeCollapsedMap[document.id] = !isNodeCollapsedMap[document.id]"
            >
              <KIcon
                icon="chevronDown"
                size="16"
              />
            </button>
          </div>
        </template>
        <div>
          <div
            class="children"
            role="region"
            tabindex="-1"
          >
            <DocumentTree
              :documents="document.children"
              :active-document-id="activeDocumentId"
              :product-id="productId"
              :level="level + 1"
              :parent-document-slug="document.slug"
            />
          </div>
        </div>
      </KCollapse>
      <router-link
        v-else
        :to="{ name: 'api-documentation-page', params: { product: productId, slug: [parentDocumentSlug, document.slug].filter(Boolean) } }"
        :class="{ title: true }"
        :style="{ paddingLeft: `${level - 1}rem` }"
      >
        {{ document.title }}
      </router-link>
    </li>
  </ul>
</template>
<script lang="ts">
import { PropType, defineComponent, watch, ref, onMounted } from 'vue'
import { hasDocumentInTree } from '@/helpers/document'
import { DocumentTree } from '@kong/sdk-portal-js'

export default defineComponent({
  name: 'DocumentTree',
  props: {
    documents: {
      type: Array as PropType<DocumentTree[]>,
      required: true
    },
    productId: {
      type: String,
      required: true
    },
    activeDocumentId: {
      type: String,
      default: null
    },
    level: {
      type: Number,
      default: 1
    },
    parentDocumentSlug: {
      type: String,
      default: ''
    }
  },
  setup: (props) => {
    const isNodeCollapsedMap = ref({})

    function updateNodeCollapsedMap (activeDocumentId, documents) {
      const collapsedMap = documents.reduce((obj, document) => {
        obj[document.id] = true

        return obj
      }, {})

      if (activeDocumentId) {
        isNodeCollapsedMap.value = collapsedMap

        const activeAncestorDocument = documents.find(document => {
          return document.id === activeDocumentId ||
            hasDocumentInTree(document.children || [], activeDocumentId)
        })

        if (activeAncestorDocument) {
          collapsedMap[activeAncestorDocument.id] = false
        }
      }

      isNodeCollapsedMap.value = collapsedMap
    }

    watch([
      () => props.activeDocumentId,
      () => props.documents
    ], ([activeDocumentId, documents]) => {
      updateNodeCollapsedMap(activeDocumentId, documents)
    })

    onMounted(() => {
      updateNodeCollapsedMap(props.activeDocumentId, props.documents)
    })

    return {
      isNodeCollapsedMap
    }
  }
})
</script>
<style lang="scss" scoped>
  .title {
    &.router-link-active {
      font-weight: 500;
    }
    flex: 1 1 auto;
    display: block;
    font-size: 0.875rem;
    font-weight: 400;
    color: var(--text_colors-secondary);
    padding: 0.5rem 0;
    border-radius: 0.25rem;
    position: relative;
  }

  .title.router-link-active,
  .title:hover {
    color: var(--text_colors-accent);
  }

  ul li :deep(.k-collapse-visible-content) {
    margin-bottom: 0 !important;
  }

  .collapse-container :deep(.k-collapse-heading) {
    margin-bottom: 0 !important;
  }

  .expandable-node-container {
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .expand-button {
    width: 24px;
    height: 24px;
    padding: 0.25rem;

    &.expand-icon {
      transform: rotate(180deg);
    }
  }

</style>
