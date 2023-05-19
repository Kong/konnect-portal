import { ProductCatalogIndexSource, ProductVersion, SearchResultsDataInner } from '@kong/sdk-portal-js'

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
        has_documentation: false,
        versions: [
          generateVersion(i)
        ],
        ...options[i] || {}
      }
    })
  }

  return productsList
}

function generateVersion (i: number):ProductVersion {
  return {
    id: 'a41041e4-d324-43c8-977a-ad68f1839751' + i,
    created_at: '2020-08-25T16:14:54.564Z',
    updated_at: '2020-08-25T16:14:54.564Z',
    name: 'v2',
    deprecated: false,
    registration_configs: []
  }
}
