import { Filter } from 'druid.d.ts'

interface QueryMeta {
  queryId: string
  start?: number
  end?: number
}

interface DruidQuery {
  dimensions: string[]
  metrics: string[]
  meta: QueryMeta
  filter?: Filter[]
  granularity?: number
}

export const chartQueryTrafficRequests: DruidQuery = {
  dimensions: ['TIME', 'API_PRODUCT_VERSION'],
  metrics: ['REQUEST_COUNT'],
  meta: { queryId: 'portal-chart-traffic' },
  filter: []
}

export const chartQueryTrafficLatency: DruidQuery = {
  dimensions: ['TIME', 'API_PRODUCT_VERSION'],
  metrics: ['RESPONSE_LATENCY_P99'],
  meta: { queryId: 'portal-chart-latency' },
  filter: []
}

export const chartQueryProductVersions4xx: DruidQuery = {
  dimensions: ['TIME', 'API_PRODUCT_VERSION'],
  metrics: ['REQUEST_COUNT'],
  meta: { queryId: 'portal-4xx-by-product-version' },
  filter: [{
    type: 'IN',
    dimension: 'STATUS_CODE_GROUPED',
    values: ['4XX']
  }]
}

export const chartQueryProductVersions5xx: DruidQuery = {
  dimensions: ['TIME', 'API_PRODUCT_VERSION'],
  metrics: ['REQUEST_COUNT'],
  meta: { queryId: 'portal-5xx-by-product-version' },
  filter: [{
    type: 'IN',
    dimension: 'STATUS_CODE_GROUPED',
    values: ['5XX']
  }]
}

export const chartQueryStatusCode4xx: DruidQuery = {
  dimensions: ['STATUS_CODE'],
  metrics: ['REQUEST_COUNT'],
  meta: { queryId: 'portal-4xx-by-status-code' },
  filter: [{
    type: 'IN',
    dimension: 'STATUS_CODE_GROUPED',
    values: ['4XX']
  }]
}

export const chartQueryStatusCode5xx: DruidQuery = {
  dimensions: ['STATUS_CODE'],
  metrics: ['REQUEST_COUNT'],
  meta: { queryId: 'portal-5xx-by-status-code' },
  filter: [{
    type: 'IN',
    dimension: 'STATUS_CODE_GROUPED',
    values: ['5XX']
  }]
}
