import { DocumentTree, Product, ProductVersion } from '@kong/sdk-portal-js'
import { Operation } from '@kong-ui-public/spec-renderer'
import { defineStore } from 'pinia'
import { ref } from 'vue'

export interface ProductWithVersions extends Product {
  versions: ProductVersion[]
}
export interface CatalogItemModel {
  id: string;
  title: string;
  showSpecLink: boolean;
  latestVersion: null|{ name: string; id: string}
  description: string;
  documentCount: number;
  versionCount: number;
}

export type CustomOperation = Operation & {tag?: string}

export const useProductStore = defineStore('product', () => {
  const product = ref<ProductWithVersions>(null)
  const documentTree = ref<DocumentTree[]>([])
  const activeDocumentSlug = ref<string>(null)
  const activeDocumentId = ref<string>(null)
  const activeProductVersionId = ref<string>(null)
  const sidebarActiveOperation = ref<CustomOperation>(null)
  const sidebarOperations = ref<CustomOperation[]>([])

  const setProduct = (data: ProductWithVersions) => {
    product.value = data
    documentTree.value = []
    activeProductVersionId.value = null
  }

  const setDocumentTree = (data: DocumentTree[]) => {
    documentTree.value = data
  }

  const setActiveDocumentSlug = (data: string) => {
    activeDocumentSlug.value = data
  }

  const setActiveDocumentId = (data: string) => {
    activeDocumentId.value = data
  }

  const setActiveProductVersionId = (data: string) => {
    activeProductVersionId.value = data
  }

  const setSidebarActiveOperation = (data: CustomOperation) => {
    sidebarActiveOperation.value = data
  }

  const setSidebarOperations = (data: CustomOperation[]) => {
    sidebarOperations.value = data
  }

  return {
    product,
    documentTree,
    activeDocumentSlug,
    activeDocumentId,
    activeProductVersionId,
    sidebarActiveOperation,
    sidebarOperations,

    setProduct,
    setDocumentTree,
    setActiveDocumentSlug,
    setActiveDocumentId,
    setActiveProductVersionId,
    setSidebarActiveOperation,
    setSidebarOperations
  }
})
