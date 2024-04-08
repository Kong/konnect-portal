<template>
  <div class="container flex pb-0 product fixed-position">
    <EmptyState
      v-if="productError"
      is-error
      class="mt-6"
      :message="productError"
    />
    <template v-else-if="product">
      <div
        class="sidebar-wrapper"
      >
        <Sidebar
          class="sidebar"
          :deselect-operation="deselectOperation"
          @operation-selected="onOperationSelectedSidebar"
        />
      </div>
      <div class="content">
        <KAlert
          v-if="activeProductVersionDeprecated"
          appearance="warning"
          :alert-message="deprecatedWarning"
          class="deprecated-warning"
        />
        <!-- pass product to child routes as a prop -->
        <router-view :product="product" />
      </div>
    </template>
  </div>
</template>

<script lang="ts" setup>
import { computed, onMounted, onUnmounted, ref, watch, watchEffect } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import getMessageFromError from '@/helpers/getMessageFromError'
import usePortalApi from '@/hooks/usePortalApi'
import { useI18nStore, useProductStore } from '@/stores'
import type { ProductWithVersions } from '@/stores/product'
import Sidebar from '@/components/product/Sidebar.vue'
import useToaster from '@/composables/useToaster'
import { DocumentContentTypeEnum, ListDocumentsTree } from '@kong/sdk-portal-js'
import { fetchAll } from '@/helpers/fetchAll'
import { Operation } from '@kong-ui-public/spec-renderer'
import { AxiosResponse } from 'axios'
import { sortByDate } from '@/helpers/sortBy'

const { notify } = useToaster()
const helpText = useI18nStore().state.helpText
const route = useRoute()
const router = useRouter()
const { portalApiV2 } = usePortalApi()
const productError = ref(null)
const activeProductVersionDeprecated = ref(false)
const deselectOperation = ref<boolean>(false)

const deprecatedWarning = helpText.productVersion.deprecatedWarningProduct

const productStore = useProductStore()
const { product, documentTree, activeDocumentSlug, activeProductVersionId } = storeToRefs(productStore)

const productIdParam = computed(() => route.params.product as string)
const productVersionParam = computed(() => route.params.product_version as string)

function setActiveDocumentSlug () {
  const slugs = route.params.slug

  // The last slug is the active document to be rendered
  const slug = Array.isArray(slugs) ? slugs[slugs.length - 1] : slugs

  if (slug !== activeDocumentSlug.value) {
    productStore.setActiveDocumentSlug(slug)
  }
}

const { productsApi, versionsApi, documentationApi } = portalApiV2.value.service

async function fetchProduct () {
  const id = productIdParam.value

  try {
    const { data: product } = await productsApi.getProduct({ productId: id })

    const productWithVersion: ProductWithVersions = {
      ...product,
      versions: await fetchAll(meta => versionsApi.listProductVersions({ ...meta, productId: id }))
    }

    productStore.setProduct(productWithVersion)
  } catch (err) {
    productStore.setProduct(null)

    console.error(err)

    if (err.response?.status === 404) {
      router.push({
        name: 'not-found'
      })
    }

    productError.value = getMessageFromError(err)
  }
}

async function fetchDocumentTree () {
  const id = productIdParam.value

  try {
    const requestOptions = {
      productId: id
    }
    // overriding the axios response because we're specifying what we're accepting above
    if (productStore.product) {
      const res = await documentationApi.listProductDocuments(requestOptions, {
        headers: {
          accept: DocumentContentTypeEnum.VndKonnectDocumentTreejson
        }
      }) as AxiosResponse<ListDocumentsTree, any>

      productStore.setDocumentTree((res.data).data)
    }
  } catch (err) {
    if (err.response.status === 404) {
      productStore.setDocumentTree([])
    } else {
      console.error(err)
      notify({
        appearance: 'danger',
        message: helpText.productVersion.unableToRetrieveDoc
      })
    }
  }
}

function initActiveProductVersionId () {
  if (!product.value) {
    return
  }

  const versions = product.value.versions
    .slice()
    .sort(sortByDate('created_at'))

  if (!versions) {
    return
  }

  const val = productVersionParam.value?.toLowerCase()
  if (val) {
    const newProductVersion = versions.find(
      (productVersion) => productVersion.id === val || productVersion.name?.toLowerCase() === val
    )

    if (newProductVersion) {
      productStore.setActiveProductVersionId(newProductVersion.id)
    }
  }

  if (!activeProductVersionId.value) {
    productStore.setActiveProductVersionId(versions[0]?.id)
  }
}

function routeToDocumentBySlug (slug: string) {
  if (slug) {
    router.replace({
      name: 'api-documentation-page',
      params: {
        product: route.params.product,
        slug: [slug]
      }
    })
  }
}

function onSwitchVersion () {
  if (route.name === 'spec') {
    productStore.setSidebarActiveOperation(null)

    router.push({
      name: 'spec',
      params: {
        product: productIdParam.value,
        product_version: activeProductVersionId.value
      }
    })
  }
}

function onOperationSelectedSidebar (operation: Operation) {
  const routeLocation = {
    name: 'spec',
    params: {
      product: productIdParam.value,
      product_version: activeProductVersionId.value
    }
  }

  if (route.name !== 'spec') {
    router.push(routeLocation).then(() => productStore.setSidebarActiveOperation(operation))
  } else {
    router.replace(routeLocation).then(() => productStore.setSidebarActiveOperation(operation))
  }
}

onMounted(async () => {
  setActiveDocumentSlug()
  await fetchProduct()
  await fetchDocumentTree()
  initActiveProductVersionId()
})

onUnmounted(() => {
  productStore.setProduct(null)
})

watch(() => productVersionParam.value, () => {
  if (productVersionParam.value && (productVersionParam.value !== activeProductVersionId.value)) {
    productStore.setActiveProductVersionId(productVersionParam.value)
  }

  initActiveProductVersionId()
})

// This ensures deselection of operations in the sidebar when the user navigates away from the spec page
watch(() => route.name, () => {
  deselectOperation.value = route.name !== 'spec'
})

watch(() => activeProductVersionId.value, (newVal, oldVal) => {
  if (oldVal && (newVal !== oldVal)) {
    onSwitchVersion()
  }

  if (!product.value?.version_count) {
    return
  }

  const newProductVersion = product.value.versions.filter((version) => version.id === activeProductVersionId.value)[0]

  activeProductVersionDeprecated.value = newProductVersion?.deprecated
})

watch(() => productIdParam.value, () => {
  if (productIdParam.value !== product.value?.id) {
    productStore.setProduct(null)
  }
})

watchEffect(() => {
  setActiveDocumentSlug()

  if (documentTree.value && !activeDocumentSlug.value && route.path.includes('/docs/')) {
    const firstDocumentSlug = documentTree.value[0]?.slug

    routeToDocumentBySlug(firstDocumentSlug)
  }
})
</script>

<style scoped>
.deprecated-warning.k-alert {
  border-radius: 0;
  position: sticky;
  top: 0;
  z-index: 1;
}

.container.product.page.fixed-position {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  max-width: 100%;
}

.product {
  min-height: calc(100vh - var(--headerHeight));
}

.sidebar-wrapper {
  flex: 0 0 auto;
  border-right: 1px solid var(--section_colors-stroke);
}

.sidebar {
  height: 100%;
  overflow-y: auto;
}

.content {
  flex: 1 1 auto;
  overflow: auto;
  position: relative;
}
</style>
