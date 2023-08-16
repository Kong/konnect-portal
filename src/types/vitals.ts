import type { Timeframe } from '@kong-ui-public/analytics-utilities'
import { Ref } from 'vue'

export interface ProductVersion {
  label: string
  key: string
  selected: boolean
  value: string
}

export enum PortalTimeframeKeys {
  NINETY_DAYS = '90d',
  ONE_DAY = '24h'
}

export interface ChartFilters {
  timeframe: Ref<Timeframe>
  apiVersions: Ref<Array<ProductVersion>>
}
