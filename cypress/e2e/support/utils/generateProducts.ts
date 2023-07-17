import { ProductCatalogIndexSource, ProductCatalogIndexSourceLatestVersion, SearchResultsDataInner } from '@kong/sdk-portal-js'
import { v4 as uuidV4 } from 'uuid'

export const generateProducts = (count: number, options: Partial<ProductCatalogIndexSource>[] = []): SearchResultsDataInner[] => {
  const productsList: SearchResultsDataInner[] = []

  for (let i = 0; i < count; i++) {
    productsList.push({
      index: 'product-catalog',
      source: {
        id: uuidV4(),
        created_at: '2020-08-25T16:14:52.450Z',
        updated_at: '2020-08-25T16:14:52.450Z',
        name: 'barAPI' + i,
        description: undefined,
        document_count: 0,
        latest_version: generateLatestVersion(),
        version_count: 1,
        ...options[i] || {}
      }
    })
  }

  return productsList
}

function generateLatestVersion (): ProductCatalogIndexSourceLatestVersion {
  return {
    id: uuidV4(),
    name: 'v2'
  }
}
