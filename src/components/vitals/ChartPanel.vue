<template>
  <div
    data-testid="analytics-charts"
    class="chart-grid"
  >
    <!-- Requests by Product Versions -->
    <KSkeleton
      v-if="!trafficRequestsChartData"
      class="chart-skeleton"
      type="table"
    />
    <AnalyticsChart
      v-else
      :chart-data="trafficRequestsChartData"
      :chart-options="trafficByProductVersionsOptions"
      :chart-title="helpText.chartTitleRequests"
      :legend-position="'bottom'"
      :tooltip-title="helpText.totalRequests"
      data-testid="chart-traffic"
      synthetics-data-key="chart-traffic"
    />
    <KSkeleton
      v-if="!trafficLatencyChartData"
      class="chart-skeleton"
      type="table"
    />
    <AnalyticsChart
      v-else
      :chart-data="trafficLatencyChartData"
      :chart-options="trafficByProductVersionsOptions"
      :chart-title="helpText.chartTitleLatency"
      :legend-position="'bottom'"
      :tooltip-title="helpText.totalRequests"
      data-testid="chart-latency"
      synthetics-data-key="chart-latency"
    />

    <!-- 4xx and 5xx by Product Versions -->
    <KSkeleton
      v-if="!productVersion4xxChartData"
      class="chart-skeleton"
      type="table"
    />
    <AnalyticsChart
      v-else
      :chart-data="productVersion4xxChartData"
      :chart-options="errorsByProductVersionsOptions"
      :chart-title="helpText.chartTitle4xxProductVersion"
      :legend-position="'bottom'"
      :tooltip-title="helpText.totalRequests"
      data-testid="chart-productversion-4xx"
      synthetics-data-key="chart-productversion-4xx"
    />
    <KSkeleton
      v-if="!productVersion5xxChartData"
      class="chart-skeleton"
      type="table"
    />
    <AnalyticsChart
      v-else
      :chart-data="productVersion5xxChartData"
      :chart-options="errorsByProductVersionsOptions"
      :chart-title="helpText.chartTitle5xxProductVersion"
      :legend-position="'bottom'"
      :tooltip-title="helpText.totalRequests"
      data-testid="chart-productversion-5xx"
      synthetics-data-key="chart-productversion-5xx"
    />

    <!-- 4xx and 5xx by Status Code -->
    <KSkeleton
      v-if="!statusCode4xxChartData"
      class="chart-skeleton"
      type="table"
    />
    <AnalyticsChart
      v-else
      :chart-data="statusCode4xxChartData"
      :chart-options="errors4xxStatusCodeOptions as AnalyticsChartOptions"
      :chart-title="helpText.chartTitle4xxStatusCode"
      :legend-position="'bottom'"
      :tooltip-title="helpText.totalRequests"
      data-testid="chart-statuscode-4xx"
      synthetics-data-key="chart-statuscode-4xx"
    />
    <KSkeleton
      v-if="!statusCode5xxChartData"
      class="chart-skeleton"
      type="table"
    />
    <AnalyticsChart
      v-else
      :chart-data="statusCode5xxChartData"
      :chart-options="errors5xxStatusCodeOptions as AnalyticsChartOptions"
      :chart-title="helpText.chartTitle5xxStatusCode"
      :legend-position="'bottom'"
      :tooltip-title="helpText.totalRequests"
      data-testid="chart-statuscode-5xx"
      synthetics-data-key="chart-statuscode-5xx"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { useI18nStore } from '@/stores'
import { AnalyticsChart, AnalyticsChartColors, ChartTypes, lookupStatusCodeColor, AnalyticsChartOptions } from '@kong-ui-public/analytics-chart'
import { TimeseriesQueryTime } from '@kong-ui-public/analytics-utilities'
import '@kong-ui-public/analytics-chart/dist/style.css'
import type { ChartFilters } from '@/types/vitals'
import useChartRequest from '@/composables/useChartRequest'
import useChartQueryBuilder from '@/composables/useChartQueryBuilder'

// Queries
import {
  chartQueryTrafficRequests,
  chartQueryTrafficLatency,
  chartQueryProductVersions4xx,
  chartQueryProductVersions5xx,
  chartQueryStatusCode4xx,
  chartQueryStatusCode5xx
} from '@/constants/chartQueries'

const helpText = useI18nStore().state.helpText.analytics

const props = defineProps<{
  modelValue: ChartFilters,
  appId: string
}>()

const selectedTimeframe = computed(() => props.modelValue.timeframe?.value)
const selectedProductVersions = computed(() => props.modelValue.apiVersions?.value)
const timeseriesQueryTime = computed(() => new TimeseriesQueryTime(selectedTimeframe.value))
const productVersionsCacheKey = computed(() => selectedProductVersions.value.map(entry => entry.value).join('-') || '')
const appCacheKey = computed(() => `${productVersionsCacheKey.value}-${timeseriesQueryTime.value.startMs()}-${timeseriesQueryTime.value.endMs()}`)

const lineChartCommon = {
  stacked: false,
  fill: false,
  granularity: selectedTimeframe.value.defaultResponseGranularity
}

const barChartCommon = {
  stacked: true,
  fill: false,
  granularity: selectedTimeframe.value.defaultResponseGranularity
}

// Set up a custom Status Code color palette
const getStatusCodePalette = (chartData) => {
  if (chartData?.records) {
    const uniqueCodes = [...new Set(chartData?.records.map(r => r.event.STATUS_CODE as string))]

    return uniqueCodes.reduce((obj: AnalyticsChartColors[], dimension: string) => ({ ...obj, [dimension]: lookupStatusCodeColor(dimension) }), {})
  }

  return []
}

const trafficByProductVersionsOptions = { ...lineChartCommon, type: ChartTypes.TIMESERIES_LINE }
const errorsByProductVersionsOptions = { ...barChartCommon, type: ChartTypes.TIMESERIES_BAR }
const errors4xxStatusCodeOptions = computed(() => {
  const chartColors = getStatusCodePalette(statusCode4xxChartData.value)

  return {
    ...barChartCommon,
    type: ChartTypes.DOUGHNUT,
    ...(chartColors ? { chartDatasetColors: chartColors } : null)
  }
})

const errors5xxStatusCodeOptions = computed(() => {
  const chartColors = getStatusCodePalette(statusCode5xxChartData.value)

  return {
    ...barChartCommon,
    type: ChartTypes.DOUGHNUT,
    ...(chartColors ? { chartDatasetColors: chartColors } : null)
  }
})

const trafficRequestsQuery = computed(() => useChartQueryBuilder(chartQueryTrafficRequests, props.appId, selectedProductVersions.value))
const trafficLatencyQuery = computed(() => useChartQueryBuilder(chartQueryTrafficLatency, props.appId, selectedProductVersions.value))
const productVersions4xxQuery = computed(() => useChartQueryBuilder(chartQueryProductVersions4xx, props.appId, selectedProductVersions.value))
const productVersions5xxQuery = computed(() => useChartQueryBuilder(chartQueryProductVersions5xx, props.appId, selectedProductVersions.value))
const statusCode4xxQuery = computed(() => useChartQueryBuilder(chartQueryStatusCode4xx, props.appId, selectedProductVersions.value))
const statusCode5xxQuery = computed(() => useChartQueryBuilder(chartQueryStatusCode5xx, props.appId, selectedProductVersions.value))

const trafficRequestsChartData = ref(null)
const trafficLatencyChartData = ref(null)
const productVersion4xxChartData = ref(null)
const productVersion5xxChartData = ref(null)
const statusCode4xxChartData = ref(null)
const statusCode5xxChartData = ref(null)

async function getAllChartData () {
  // Batch all chart requests
  [
    trafficRequestsChartData.value,
    trafficLatencyChartData.value,
    productVersion4xxChartData.value,
    productVersion5xxChartData.value,
    statusCode4xxChartData.value,
    statusCode5xxChartData.value

  ] = await Promise.all([
    useChartRequest(trafficRequestsQuery.value, timeseriesQueryTime.value),
    useChartRequest(trafficLatencyQuery.value, timeseriesQueryTime.value),
    useChartRequest(productVersions4xxQuery.value, timeseriesQueryTime.value),
    useChartRequest(productVersions5xxQuery.value, timeseriesQueryTime.value),
    useChartRequest(statusCode4xxQuery.value, timeseriesQueryTime.value),
    useChartRequest(statusCode5xxQuery.value, timeseriesQueryTime.value)
  ])
}

watch(appCacheKey, () => {
  getAllChartData()
})

onMounted(() => {
  getAllChartData()
})
</script>

<style lang="scss" scoped>
@import '../../assets/mixins.scss';
@import '../../assets/variables.scss';

.chart-grid {
  @include grid-columns(1);

  @media (min-width: $viewport-md) {
    @include grid-columns(2);
  }

  .chart-skeleton {
    justify-content: center;
    margin: var(--spacing-xl, 24px) auto;
    max-width: 400px;
  }

  // Tooltip overrides
  .analytics-chart-parent {
    // More padding on the right, to balance out space taken up by Y-Axis label
    padding: var(--spacing-md) var(--spacing-lg) var(--spacing-md) var(--spacing-md);
    background-color: var(--white, #fff);
    margin: 0;
    min-width: 400px !important;
    position: relative;

    &:deep(.legend-container) {
      color: #0b172d; // override --text_colors-primary until full portal customization
      margin-top: 0;
    }

    &:deep(.chart-title) {
      color: #3c4557; // override --text_colors-primary until full portal customization
      padding-top: 0;
      padding-bottom: var(--spacing-md);
    }

    &:deep(ul.tooltip) {
      max-width: 320px;
      @media (min-width: $viewport-md) {
        max-width: 440px;
      }
      .display-value, .display-label  {
        color: #3c4557; // override --text_colors-primary until full portal customization
        font-size: 14px;
      }

      .tooltip-title {
        color: #3c4557; // override --text_colors-primary until full portal customization
      }
    }
  }
}
</style>
