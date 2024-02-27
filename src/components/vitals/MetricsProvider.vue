<template>
  <MetricsProviderInternal
    v-slot="internalSlotProps"
    v-bind="internalProps"
  >
    <slot v-bind="internalSlotProps" />
  </MetricsProviderInternal>
</template>
<script setup lang="ts">
import usePortalApi from '@/hooks/usePortalApi'
import useToaster from '@/composables/useToaster'
import { TimeframeKeys, type QueryTime, type Timeframe } from '@kong-ui-public/analytics-utilities'
import { computed } from 'vue'
import type { DataFetcher, ExploreV2Query, EXPLORE_V2_DIMENSIONS, ExploreV2Filter } from '@kong-ui-public/analytics-metric-provider'
import { MetricsProviderInternal } from '@kong-ui-public/analytics-metric-provider'
import { storeToRefs } from 'pinia'
import { useAppStore } from '@/stores'
import getMessageFromError from '@/helpers/getMessageFromError'
import { PortalTimeframeKeys } from '@/types/vitals'
import { ApplicationAnalyticsApiQueryApplicationAnalyticsRequest } from '@kong/sdk-portal-js'
import { snakeToCamelCase } from '@/helpers/snakeToCamelCase'
type ProviderProps = InstanceType<typeof MetricsProviderInternal>['$props']

const { notify } = useToaster()

const props = withDefaults(defineProps<{
  overrideTimeframe?: Timeframe,
  maxTimeframe?: TimeframeKeys,
  dimension?: EXPLORE_V2_DIMENSIONS,
  additionalFilter?: ExploreV2Filter[],
  filterValue?: string,
  queryReady?: boolean,
  longCardTitles?: boolean
}>(), {
  maxTimeframe: TimeframeKeys.THIRTY_DAY,
  overrideTimeframe: undefined,
  dimension: undefined,
  additionalFilter: undefined,
  filterValue: undefined,
  queryReady: undefined,
  longCardTitles: undefined
})

const { portalApiV2 } = usePortalApi()

const appStore = useAppStore()
const { allowedTimePeriod } = storeToRefs(appStore)

const hasTrendAccess = computed(() => allowedTimePeriod.value === PortalTimeframeKeys.NINETY_DAYS)

const handleError = (error) => {
  notify({
    appearance: 'danger',
    message: getMessageFromError(error)
  })
}

const dataFetcher: DataFetcher = (queryTime: QueryTime, query: ExploreV2Query) => {
  const appQuery = {
    queryApplicationAnalytics: {
      ...query,
      granularity_ms: query.granularityMs,
      start_ms: queryTime.startMs(),
      end_ms: queryTime.endMs()
    }
  }

  // Drop unneeded `granularityMs`
  delete appQuery.queryApplicationAnalytics?.granularityMs

  return portalApiV2.value.service.applicationAnalyticsApi.queryApplicationAnalytics(appQuery as ApplicationAnalyticsApiQueryApplicationAnalyticsRequest)
    .then(({ data }) => {
      // Transform the `meta` object contained in the response
      data.meta = snakeToCamelCase(data.meta)

      // Package the transformed data as a new promise
      return data as ApplicationAnalyticsApiQueryApplicationAnalyticsRequest
    }).catch((e) => {
      handleError(e)
    }) as Promise<any>
}

// Note: if Typescript complains about prop type mismatches, bump `analytics-metric-provider` to a version whose analytics utils sub-dependency
// matches the `analytics-utilities` version in the root package.json
const internalProps = computed<ProviderProps>(() => ({
  ...props,
  dataFetcher,
  hasTrendAccess: hasTrendAccess.value,
  refreshInterval: 0 // Don't refresh metric cards on the dev portal by default.
} as ProviderProps))

</script>
