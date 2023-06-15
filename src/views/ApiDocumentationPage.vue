<!-- eslint-disable vue/no-v-for-template-key -->
<template>
  <main
    class="pl-5 md:pl-0 d-flex flex-row"
    data-testid="api-documentation-page"
  >
    <div class="col content mt-6">
      <KSkeleton v-if="isDocumentLoading" />
      <template v-else>
        <header class="content-header">
          <KBreadcrumbs
            :items="breadcrumbs"
          />
          <h1 class="content-title color-text_colors-headings">
            {{ title }}
          </h1>
        </header>

        <ErrorWrapper
          v-if="errorCode"
          :error-code="errorCode"
          :description="helpText.apiDocumentation.error.description"
          :link-text="helpText.apiDocumentation.error.linkText"
        />
        <DocumentViewer
          v-else-if="content"
          class="portal-document-viewer"
          :document="content"
        />
      </template>
    </div>
    <aside class="col sidebar sidebar-sections">
      <KSkeleton
        v-if="isDocumentLoading"
        class="skeleton"
      />
      <DocumentSections
        v-else
        :items="sections"
      />
    </aside>
  </main>
</template>

<script lang="ts">
import { defineComponent, computed, ref, watchEffect, PropType } from 'vue'
import { useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import getMessageFromError from '@/helpers/getMessageFromError'
import usePortalApi from '@/hooks/usePortalApi'
import DocumentSections from '@/components/ApiDocumentation/DocumentSections.vue'
import ErrorWrapper from '@/components/ErrorWrapper.vue'
import { findAllNodesOfType, getNodeTextContent } from '@/helpers/document'
import { ProductWithVersions, useI18nStore, useProductStore } from '@/stores'
import useToaster from '@/composables/useToaster'
import DocumentViewer, { HeadingNode, addSlug } from '@kong-ui-public/document-viewer'

import '@kong-ui-public/document-viewer/dist/style.css'
import { DocumentBlock, ProductDocument } from '@kong/sdk-portal-js'
import useLDFeatureFlag from '@/hooks/useLDFeatureFlag'
import { FeatureFlags } from '@/constants/feature-flags'

export default defineComponent({
  name: 'ApiDocumentationPage',
  components: {
    DocumentViewer,
    DocumentSections,
    ErrorWrapper
  },
  props: {
    product: {
      type: Object as PropType<ProductWithVersions>,
      required: true
    }
  },
  setup (props) {
    const helpText = useI18nStore().state.helpText
    const productStore = useProductStore()
    const { activeDocumentSlug } = storeToRefs(productStore)
    const apiBuilderFlagEnabled = useLDFeatureFlag(FeatureFlags.ApiProductBuilder, false)

    const { notify } = useToaster()
    const errorCode = ref(null)
    const router = useRouter()
    const { portalApiV2 } = usePortalApi()

    const breadcrumbs = computed(() => ([
      {
        key: 'product-catalog',
        to: { name: 'catalog' },
        text: helpText.nav.catalog
      },
      {
        key: 'product',
        to: props.product
          ? {
              name: 'spec',
              params: {
                product: props.product.id
              }
            }
          : undefined,
        text: props.product?.name || (apiBuilderFlagEnabled ? helpText.nav.breadcrumbProduct : helpText.nav.breadcrumbService)
      },
      {
        key: 'documentation',
        text: helpText.nav.breadcrumbDocumentation,
        to: props.product
          ? {
              name: 'api-documentation-page',
              params: {
                product: props.product.id
              }
            }
          : undefined
      }
    ]))

    const title = ref<string>(null)
    const isDocumentLoading = ref<boolean>(true)
    const content = ref<DocumentBlock>(null)

    const sections = computed(() => {
      if (!content.value) {
        return []
      }

      // this is to prevent duplicate slugs
      const slugMap = new Map<string, number>()

      const allHeadings = findAllNodesOfType<DocumentBlock>(content.value, 'heading') as HeadingNode[]

      return allHeadings
        .map((node) => {
          const text = getNodeTextContent(node)
          const { slug } = addSlug(node, slugMap)
          const level = getMaxHeaderLevel(2)

          return {
            level,
            slug,
            title: text
          }

          function getMaxHeaderLevel (maxHeadingLevel) {
            return Math.min(node.level, maxHeadingLevel)
          }
        })
    })

    async function fetchDocument (productId: string, slug: string) {
      errorCode.value = null
      isDocumentLoading.value = true

      await portalApiV2.value.service.documentationApi.getProductDocument({
        productId,
        documentId: slug
      }, {
        headers: {
          accept: 'application/konnect.document-nodes+json'
        }
      })
        .then((res) => {
          const data = res.data as unknown as ProductDocument // override

          title.value = data.title
          content.value = data.content
          productStore.setActiveDocumentId(data.id)
        })
        .finally(() => {
          isDocumentLoading.value = false
        })
    }

    const handleError = (error) => {
      notify({
        appearance: 'danger',
        message: getMessageFromError(error)
      })

      const statusCode = error?.response?.status || 400

      if (statusCode !== 404) {
        errorCode.value = statusCode
      } else {
        router.replace({
          name: 'not-found'
        })
      }
    }

    watchEffect(async () => {
      if (activeDocumentSlug.value && props.product) {
        try {
          await fetchDocument(props.product.id, activeDocumentSlug.value)
        } catch (e) {
          handleError(e)
        }
      }
    })

    return {
      helpText,
      title,
      content,
      isDocumentLoading,
      sections,
      breadcrumbs,
      document,
      errorCode,
      slug: activeDocumentSlug.value
    }
  }
})
</script>

<style lang="scss">
.portal-document-viewer {
  pre {
    overflow-x: auto;
  }
}
</style>

<style lang="scss" scoped>
.skeleton {
  margin-top: 2rem;
}

.col {
  flex: 0 0 auto;
  padding: 0 0.75rem;

  &:first-child {
    padding-left: 0;
  }

  &:last-child {
    padding-right: 0;
  }
}

.sidebar {
  flex-basis: 25%;
}

.content {
  flex: 1 1 60%;
  overflow-x: auto;
}

.content-title {
  font-size: 2rem;
}

.content-header {
  margin-bottom: var(--spacing-xxl);
}

.sidebar-sections {
  display: none;

  @media (min-width: 992px) {
    display: block;
  }
}

.documents {
  margin-top: 2rem;
}

.documents-title {
  display: block;
  font-size: 1.25rem;
  margin: 0 0 0.75rem;
  color: var(--text_colors-headings);
  font-family: var(--font-family-headings);
}

.portal-document-viewer {
  --document-viewer-link-color: var(--text_colors-accent);
  --document-viewer-link-hover-color: var(--text_colors-accent);
  --document-viewer-font-family-default: var(--font-family-sans);
  --document-viewer-font-family-monospace: var(--font-family-mono);
  --document-viewer-font-family-headings: var(--font-family-headings);

  // This is going to solve some contrast issues with blockquotes
  // and their text colors.

  --document-viewer-code-color: var(--steel-700, #0a2b66);
  :deep(blockquote) {
    color: var(--steel-700, #0a2b66);

    h1, h2, h3, h4, h5, h6 {
      color: var(--steel-700, #0a2b66);
    }
  }
}
</style>
