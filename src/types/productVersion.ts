export interface ProductVersionData {
  value: string
  label: string
}

export interface ProductVersionsResult {
  results: ProductVersionData[],
  hasMoreResults: boolean
}
