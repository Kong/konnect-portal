import { ProductCatalogIndexSource, ProductCatalogIndexSourceLatestVersion, SearchResultsDataInner } from '@kong/sdk-portal-js'

export const generateProducts = (count: number, options: Partial<ProductCatalogIndexSource>[] = []): SearchResultsDataInner[] => {
  const productsList: SearchResultsDataInner[] = []

  for (let i = 0; i < count; i++) {
    productsList.push({
      index: 'product-catalog',
      source: {
        id: crypto.randomUUID(),
        created_at: '2020-08-25T16:14:52.450Z',
        updated_at: '2020-08-25T16:14:52.450Z',
        name: 'barAPI' + i,
        description: undefined,
        document_count: 0,
        latest_version: generateLatestVersion(i),
        version_count: 1,
        ...options[i] || {}
      }
    })
  }

  return productsList
}

function generateLatestVersion (i: number): ProductCatalogIndexSourceLatestVersion {
  return {
    id: crypto.randomUUID(),
    name: `v${i}`
  }
}
