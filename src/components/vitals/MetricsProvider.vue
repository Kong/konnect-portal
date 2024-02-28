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
import { TimeframeKeys, QueryTime, Timeframe } from '@kong-ui-public/analytics-utilities'
import { computed } from 'vue'
import { MetricsProviderInternal, ExploreV2Query, EXPLORE_V2_DIMENSIONS, ExploreV2Filter } from '@kong-ui-public/analytics-metric-provider'
import { storeToRefs } from 'pinia'
import { useAppStore } from '@/stores'
import { PortalTimeframeKeys } from '@/types/vitals'
import { ApplicationAnalyticsApiQueryApplicationAnalyticsRequest } from '@kong/sdk-portal-js'
import { snakeToCamelCase } from '@/helpers/snakeToCamelCase'

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

// TODO: type as DataFetcher
const dataFetcher: any = async (queryTime: QueryTime, query: ExploreV2Query) => {
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

  try {
    // Unpack the original promise
    const v3Result = await portalApiV2.value.service.applicationAnalyticsApi.queryApplicationAnalytics(appQuery as ApplicationAnalyticsApiQueryApplicationAnalyticsRequest)

    // Transform the `meta` object contained in the response
    v3Result.data.meta = snakeToCamelCase(v3Result.data.meta)

    // Package the transformed data as a new promise
    return Promise.resolve(v3Result as any as ApplicationAnalyticsApiQueryApplicationAnalyticsRequest)
  } catch (error) {
    return Promise.reject(error)
  }
}

// Note: if Typescript starts complaining about the prop types, make sure `analytics-utilities` is the same version in both `portal-client` and `analytics-metric-provider`.
// Otherwise, it starts thinking that the Timeframe types are incompatible.
const internalProps = computed(() => ({
  ...props,
  dataFetcher,
  hasTrendAccess: hasTrendAccess.value,
  refreshInterval: 0 // Don't refresh metric cards on the dev portal by default.
}))

</script>
