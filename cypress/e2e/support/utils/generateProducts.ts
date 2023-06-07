import { ProductCatalogIndexSource, ProductCatalogIndexSourceLatestVersion, SearchResultsDataInner } from '@kong/sdk-portal-js'

export const generateProducts = (count: number, options: Partial<ProductCatalogIndexSource>[] = []): SearchResultsDataInner[] => {
  const productsList: SearchResultsDataInner[] = []

  for (let i = 0; i < count; i++) {
    productsList.push({
      index: 'product-catalog',
      source: {
        id: 'a5afb115-025e-4da1-a013-bf05b326e0a5' + i,
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
    id: 'a41041e4-d324-43c8-977a-ad68f1839751' + i,
    name: 'v2'
  }
}
