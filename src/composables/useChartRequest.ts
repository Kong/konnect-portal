import { computed, ComputedRef } from 'vue'
import { TimeseriesQueryTime } from '@kong-ui-public/analytics-utilities'
import {
  ApplicationAnalyticsApiQueryApplicationAnalyticsRequest,
  QueryApplicationAnalytics200Response
} from '@kong/sdk-portal-js'
import usePortalApi from '@/hooks/usePortalApi'
import useRequest from '@/composables/useRequest'
const { portalApiV2 } = usePortalApi()

export default function useChartRequest (query, timeframe, productVersions): ComputedRef<QueryApplicationAnalytics200Response> {
  const productVersionsCacheKey = computed(() => productVersions.map(entry => entry.value).join('-') || '')
  const timeseriesQueryTime = computed(() => new TimeseriesQueryTime(timeframe))

  const startMs = computed(() => timeseriesQueryTime.value.startMs())
  const endMs = computed(() => timeseriesQueryTime.value.endMs())
  const granularity = computed(() => timeseriesQueryTime.value.granularityMs())

  const vitalsRequest: ApplicationAnalyticsApiQueryApplicationAnalyticsRequest = {
    start_ms: Number(startMs.value),
    end_ms: Number(endMs.value),
    granularity_ms: granularity.value,
    // Append `dimensions`, `metrics`, `filter`, and `meta`
    ...query
  }

  if (!query.filter || !query.filter.length) {
    return null
  }

  // console.log(' >> vitalsRequest >>', vitalsRequest)

  // const response = portalApiV2.value.service.applicationAnalyticsApi.queryApplicationAnalytics(vitalsRequest)
  const response = useRequest<QueryApplicationAnalytics200Response>(
    () => query && query.filter && `${query.meta.query_id}-${productVersionsCacheKey.value}-${startMs.value}-${endMs.value}`,
    () => portalApiV2.value.service.applicationAnalyticsApi.queryApplicationAnalytics(vitalsRequest)
      .then(e => e)
      .catch(() => ({
        data: {
          records: [],
          meta: {
            start_ms: startMs,
            end_ms: endMs
          }
        },
        status: '500'
      })),
    {
      refreshInterval: 0, // do not auto refresh
      revalidateOnFocus: false,
      shouldRetryOnError: false,
      errorRetryCount: 0 // max query retries
    }
  )

  return response?.data
}
