import { Filter } from 'druid.d.ts'

interface DruidQuery {
  dimensions: string[]
  metrics: string[]
  filter?: Filter[]
  granularity?: number
}

export const chartQueryTrafficRequests: DruidQuery = {
  dimensions: ['TIME', 'API_PRODUCT_VERSION'],
  metrics: ['REQUEST_COUNT'],
  filter: []
}

export const chartQueryTrafficLatency: DruidQuery = {
  dimensions: ['TIME', 'API_PRODUCT_VERSION'],
  metrics: ['RESPONSE_LATENCY_P99'],
  filter: []
}

export const chartQueryProductVersions4xx: DruidQuery = {
  dimensions: ['TIME', 'API_PRODUCT_VERSION'],
  metrics: ['REQUEST_COUNT'],
  filter: [{
    type: 'IN',
    dimension: 'STATUS_CODE_GROUPED',
    values: ['4XX']
  }]
}

export const chartQueryProductVersions5xx: DruidQuery = {
  dimensions: ['TIME', 'API_PRODUCT_VERSION'],
  metrics: ['REQUEST_COUNT'],
  filter: [{
    type: 'IN',
    dimension: 'STATUS_CODE_GROUPED',
    values: ['5XX']
  }]
}

export const chartQueryStatusCode4xx: DruidQuery = {
  dimensions: ['STATUS_CODE'],
  metrics: ['REQUEST_COUNT'],
  filter: [{
    type: 'IN',
    dimension: 'STATUS_CODE_GROUPED',
    values: ['4XX']
  }]
}

export const chartQueryStatusCode5xx: DruidQuery = {
  dimensions: ['STATUS_CODE'],
  metrics: ['REQUEST_COUNT'],
  filter: [{
    type: 'IN',
    dimension: 'STATUS_CODE_GROUPED',
    values: ['5XX']
  }]
}
