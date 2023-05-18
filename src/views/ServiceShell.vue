<template>
  <div class="container flex pb-0 service fixed-position">
    <EmptyState
      v-if="serviceError"
      is-error
      class="mt-6"
      :message="serviceError"
    />
    <template v-else>
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
          v-if="activeServiceVersionDeprecated"
          appearance="warning"
          :alert-message="helpText.serviceVersion.deprecatedWarning"
          class="deprecated-warning"
        />
        <!-- pass service to child routes as a prop -->
        <router-view :service="product" />
      </div>
    </template>
  </div>
</template>

<script lang="ts" setup>
import { computed, onMounted, ref, watch, watchEffect } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import getMessageFromError from '@/helpers/getMessageFromError'
import usePortalApi from '@/hooks/usePortalApi'
import { useI18nStore, useProductStore } from '@/stores'
import type { ProductWithVersions } from '@/stores/product'
import Sidebar from '@/components/service/Sidebar.vue'
import useToaster from '@/composables/useToaster'
import { DocumentContentTypeEnum, ListDocumentsTree } from '@kong/sdk-portal-js'
import { fetchAll } from '@/helpers/fetchAll'
import { Operation } from '@kong-ui-public/spec-renderer'
import { AxiosResponse } from 'axios'

const { notify } = useToaster()
const helpText = useI18nStore().state.helpText
const route = useRoute()
const router = useRouter()
const { portalApiV2 } = usePortalApi()
const serviceError = ref(null)
const activeServiceVersionDeprecated = ref(false)
const deselectOperation = ref<boolean>(false)

// @ts-ignore
const productStore = useProductStore()
const { product, documentTree, activeDocumentSlug, activeProductVersionId } = storeToRefs(productStore)

const servicePackageIdParam = computed(() => route.params.service_package as string)
const serviceVersionParam = computed(() => route.params.service_version as string)

function setActiveDocumentSlug () {
  const slugs = route.params.slug

  // The last slug is the active document to be rendered
  const slug = Array.isArray(slugs) ? slugs[slugs.length - 1] : slugs

  if (slug !== activeDocumentSlug.value) {
    productStore.setActiveDocumentSlug(slug)
  }
}

const { productsApi, versionsApi, documentationApi } = portalApiV2.value.service

async function fetchServicePackage () {
  const id = servicePackageIdParam.value

  try {
    const { data: product } = await productsApi.getProduct({ productId: id })

    const productWithVersion: ProductWithVersions = {
      ...product,
      versions: await fetchAll(meta => versionsApi.listProductVersions({ ...meta, productId: id }))
    }

    productStore.setProduct(productWithVersion)
  } catch (err) {
    console.error(err)
    serviceError.value = getMessageFromError(err)
  }
}

async function fetchDocumentTree () {
  const id = servicePackageIdParam.value

  try {
    const requestOptions = {
      productId: id,
      accept: DocumentContentTypeEnum.KonnectDocumentTreejson
    }

    // overriding the axios response because we're specifying what we're accepting above
    const res = await documentationApi.listProductDocuments(requestOptions) as AxiosResponse<ListDocumentsTree, any>

    productStore.setDocumentTree((res.data).data)
  } catch (err) {
    if (err.response.status === 404) {
      productStore.setDocumentTree([])
    } else {
      console.error(err)
      notify({
        appearance: 'danger',
        message: helpText.serviceVersion.unableToRetrieveDoc
      })
    }
  }
}

function initactiveProductVersionId () {
  if (!product.value) {
    return
  }

  const versions = product.value.versions
    .slice()
    // @ts-ignore
    .sort((a, b) => new Date(a) - new Date(b))

  if (!versions) {
    return
  }

  // @ts-ignore
  const val = serviceVersionParam.value?.toLowerCase()
  if (val) {
    const newServiceVersion = versions.find(
      (serviceVersion) => serviceVersion.id === val || serviceVersion.version?.toLowerCase() === val
    )

    if (newServiceVersion) {
      productStore.setActiveProductVersionId(newServiceVersion.id)
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
        service_package: route.params.service_package,
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
        service_package: servicePackageIdParam.value,
        service_version: activeProductVersionId.value
      }
    })
  }
}

function onOperationSelectedSidebar (operation: Operation) {
  const routeLocation = {
    name: 'spec',
    params: {
      service_package: servicePackageIdParam.value,
      service_version: activeProductVersionId.value
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
  await fetchServicePackage()
  await fetchDocumentTree()
  initactiveProductVersionId()
})

watch(() => serviceVersionParam.value, () => {
  if (serviceVersionParam.value && (serviceVersionParam.value !== activeProductVersionId.value)) {
    productStore.setActiveProductVersionId(serviceVersionParam.value)
  }

  initactiveProductVersionId()
})

// This ensures deselection of operations in the sidebar when the user navigates away from the spec page
watch(() => route.name, () => {
  deselectOperation.value = route.name !== 'spec'
})

watch(() => activeProductVersionId.value, (newVal, oldVal) => {
  if (oldVal && (newVal !== oldVal)) {
    onSwitchVersion()
  }

  if (!product.value?.versions) {
    return
  }

  const newServiceVersion = product.value.versions.filter((version) => version.id === activeProductVersionId.value)[0]

  activeServiceVersionDeprecated.value = newServiceVersion?.deprecated
})

watch(() => servicePackageIdParam.value, () => {
  if (servicePackageIdParam.value !== product.value?.id) {
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

.container.service.page.fixed-position {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  max-width: 100%;
}

.service {
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
