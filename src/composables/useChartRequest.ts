import { computed, ComputedRef } from 'vue'
import { TimeseriesQueryTime } from '@kong-ui-public/analytics-utilities'
import type { AnalyticsExploreV2Result } from '@kong-ui-public/analytics-utilities'
import usePortalApi from '@/hooks/usePortalApi'
import useRequest from '@/composables/useRequest'
const { portalApiV2 } = usePortalApi()

export default function useChartRequest (query, timeframe, productVersions): ComputedRef<AnalyticsExploreV2Result> {
  const productVersionsCacheKey = computed(() => productVersions.map(entry => entry.value).join('-') || '')
  const timeseriesQueryTime = computed(() => new TimeseriesQueryTime(timeframe))

  const startMs = computed(() => timeseriesQueryTime.value.startMs())
  const endMs = computed(() => timeseriesQueryTime.value.endMs())
  const granularity = computed(() => timeseriesQueryTime.value.granularityMs())

  // if (query.meta.queryId === 'portal-chart-traffic') {
  //   console.log('query.meta.queryId', query.meta.queryId)
  //   console.log(`${query.meta.queryId}-${productVersionsCacheKey.value}-${startMs.value}-${endMs.value}`)
  // }

  try {
    if (!query.filter || !query.filter.length) {
      // console.warn('Query filter cannot be empty.')

      return null
    }

    const request = useRequest<AnalyticsExploreV2Result>(
      () => query && query.filter && `${query.meta.queryId}-${productVersionsCacheKey.value}-${startMs.value}-${endMs.value}`,
      () => portalApiV2.value.service.applicationAnalyticsApi.queryApplicationAnalytics(
        { ...query, granularityMs: granularity.value }
      ),
      {
        refreshInterval: 0, // do not auto refresh
        revalidateOnFocus: false
      }
    )

    // console.log(' >> queryApplicationAnalytics >>', request?.data)

    return request?.data
  } catch (e) {
    console.error('failed to gather Chart data', e)

    return null
  }
}
