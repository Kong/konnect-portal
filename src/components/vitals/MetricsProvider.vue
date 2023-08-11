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
import { Ref, computed } from 'vue'
import { MetricsProviderInternal, DataFetcher, ExploreV2Query, EXPLORE_V2_DIMENSIONS, ExploreV2Filter } from '@kong-ui-public/analytics-metric-provider'
import { storeToRefs } from 'pinia'
import { useAppStore } from '@/stores'
import { PortalTimeframeKeys } from '@/types/vitals'

const props = withDefaults(defineProps<{
  overrideTimeframe?: Timeframe,
  maxTimeframe?: TimeframeKeys,
  dimension?: EXPLORE_V2_DIMENSIONS,
  additionalFilter?: Ref<ExploreV2Filter[]>,
  filterValue?: string,
}>(), {
  maxTimeframe: TimeframeKeys.THIRTY_DAY,
  overrideTimeframe: null,
  dimension: undefined,
  additionalFilter: undefined,
  filterValue: undefined
})

const { portalApiV2 } = usePortalApi()

const appStore = useAppStore()
const { allowedTimePeriod } = storeToRefs(appStore)

const hasTrendAccess = computed(() => allowedTimePeriod.value === PortalTimeframeKeys.NINETY_DAYS)

const dataFetcher: DataFetcher = (queryTime: QueryTime, query: ExploreV2Query) => {
  const appQuery = {
    queryApplicationAnalytics: {
      ...query,
      start_ms: queryTime.startMs(),
      end_ms: queryTime.endMs()
    }
  }

  return portalApiV2.value.service.applicationAnalyticsApi.queryApplicationAnalytics(appQuery)
}

// Note: if Typescript starts complaining about the prop types, make sure `analytics-utilities` is the same version in both `portal-client` and `analytics-metric-provider`.
// Otherwise, it starts thinking that the Timeframe types are incompatible.
const internalProps = computed(() => ({
  ...props,
  dataFetcher,
  hasTrendAccess,
  refreshInterval: 0 // Don't refresh metric cards on the dev portal by default.
}))

</script>
