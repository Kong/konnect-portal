import cloneDeep from 'lodash.clonedeep'
import type { ProductVersion } from '@/types/vitals'

export default function useChartQueryBuilder (baseQuery, appId: string, productVersions: Array<ProductVersion>) {
  const query = cloneDeep(baseQuery)

  // Append as single Application ID to filter
  if (appId) {
    query.filter = [...query.filter, {
      type: 'IN',
      dimension: 'APPLICATION',
      values: [appId]
    }]
  }

  // Filter further by Product Versions, if any have been selected in dropdown
  if (productVersions.length) {
    query.filter = [...query.filter, {
      type: 'IN',
      dimension: 'API_PRODUCT_VERSION',
      values: productVersions.map(entry => entry.value)
    }]
  }

  return query
}
