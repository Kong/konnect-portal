<template>
  <KCard
    class="mb-3 analytics-overview"
    data-testid="analytics-metrics-overview"
  >
    <template #body>
      <MetricsProvider
        v-bind="metricProviderProps"
      >
        <MetricsConsumer />
      </MetricsProvider>
    </template>
  </KCard>
</template>

<script setup lang="ts">
import '@kong-ui-public/metric-cards/dist/style.css'

// Enums and Interfaces
import { Timeframe } from '@kong-ui-public/analytics-utilities'

// Components
import MetricsProvider from './MetricsProvider.vue'
import { EXPLORE_V2_DIMENSIONS, EXPLORE_V2_FILTER_TYPES, MetricsConsumer } from '@kong-ui-public/analytics-metric-provider'
import { computed } from 'vue'

const props = defineProps<{
  applicationId: string,
  productVersionIds?: string[],
  timeframe: Timeframe,
}>()

const metricProviderProps = computed(() => ({
  overrideTimeframe: props.timeframe,
  additionalFilter: [
    {
      dimension: EXPLORE_V2_DIMENSIONS.APPLICATION,
      type: EXPLORE_V2_FILTER_TYPES.IN,
      values: [props.applicationId]
    },
    ...(props.productVersionIds?.length > 0
      ? [{
          dimension: EXPLORE_V2_DIMENSIONS.API_PRODUCT_VERSION,
          type: EXPLORE_V2_FILTER_TYPES.IN,
          values: props.productVersionIds
        }]
      : [])
  ]
}))

</script>

<style lang="scss">
@import '../../assets/variables.scss';

.analytics-overview {
  background-color: var(--white, #fff) !important;

  .kong-ui-public-metric-card-container {
    .metricscard {
      @media (min-width: $viewport-md) {
        max-width: 220px;
        justify-content: space-around;
      }
    }
  }
}
</style>
