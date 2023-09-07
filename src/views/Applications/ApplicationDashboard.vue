<template>
  <Content
    class="application-dashboard-wrapper"
  >
    <KSkeleton v-if="currentState.matches('pending')" />
    <KBreadcrumbs
      v-if="!currentState.matches('pending')"
      :items="breadcrumbs"
    />
    <EmptyState
      v-else-if="currentState.matches('error')"
      is-error
      :message="errorMessage"
    />
    <section
      v-if="currentState.matches('success')"
    >
      <PageTitle
        class="page-title"
        :title="helpText.analytics.dashboard"
      />
      <div v-if="contextualAnalytics && hasProductVersions">
        <div
          class="analytics-filters"
        >
          <KMultiselect
            v-model="versionMultiSelectModel"
            autosuggest
            class="analytics-service-filter"
            collapsed-context
            data-testid="analytics-service-filter"
            :dropdown-footer-text="multiselectFooter"
            dropdown-footer-text-position="static"
            :items="multiselectItems"
            :label="helpText.analytics.filterLabelProductVersions"
            :loading="filterMultiselectLoading"
            @change="handleChangedItem"
            @query-change="handleProductVersionSearch"
            @selected="handleProductVersionSelection"
          />
          <div>
            <KLabel for="dateTimePicker">
              {{ helpText.analytics.timeRange }}
            </KLabel>
            <KDateTimePicker
              id="analytics-timepicker"
              v-model="timeframe"
              class="analytics-timepicker"
              data-test-id="analytics-timepicker"
              :max-date="new Date()"
              :min-date="minDateCalendar"
              :mode="hideCalendar ? 'relative': 'date'"
              :placeholder="helpText.analytics.selectDateRange"
              :range="true"
              :time-periods="timePeriods"
              width="100%"
              @change="changeTimeframe"
            />
          </div>
        </div>
        <div class="analytics-summary">
          <h2 class="analytics-summary-title">
            {{ helpText.analytics.summary }}
          </h2>
          <AnalyticsMetricsCard
            v-if="!vitalsLoading"
            :application-id="(appId as string)"
            class="analytics-metrics-cards"
            data-testid="analytics-metric-cards"
            :product-version-ids="selectedProductVersionIds"
            :timeframe="(selectedTimeframe as Timeframe)"
          />
          <h2 class="chart-overview">
            {{ helpText.analytics.chartOverview }}
          </h2>
          <ChartPanel
            v-model="chartFilters"
            :app-id="(appId as string)"
          />
        </div>
      </div>
      <AnalyticsEmptyState
        v-else-if="!filterMultiselectLoading"
        icon="stateNoData"
        icon-size="96"
        :message="helpText.analytics.selectProductVersions"
        :title="helpText.analytics.selectProductVersions"
      >
        <template #message>
          <p class="no-product-versions-message">
            {{ helpText.productVersion.noProductVersionsDetail }}
          </p>
          <KButton
            appearance="primary"
            data-testid="copy-btn"
            icon="plus"
            :is-rounded="false"
            :to="{ name: 'catalog' }"
          >
            {{ helpText.productVersion.registerProductVersion }}
          </KButton>
        </template>
      </AnalyticsEmptyState>
    </section>
  </Content>
</template>

<script setup lang="ts">
import { computed, ref, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useMachine } from '@xstate/vue'
import { createMachine } from 'xstate'
import getMessageFromError from '@/helpers/getMessageFromError'
import usePortalApi from '@/hooks/usePortalApi'
import useToaster from '@/composables/useToaster'
import useAllowedTimeframes from '@/composables/useAllowedTimeframes'
import { FeatureFlags } from '@/constants/feature-flags'
import useLDFeatureFlag from '@/hooks/useLDFeatureFlag'
import {
  datePickerSelectionToTimeframe,
  Timeframe,
  TimeframeKeys,
  TimePeriods,
  timeframeToDatepickerSelection
} from '@kong-ui-public/analytics-utilities'
import type { ProductVersionData, ProductVersionsResult } from '@/types/productVersion'
import type { ChartFilters } from '@/types/vitals'
import AnalyticsMetricsCard from '@/components/vitals/AnalyticsMetricsCard.vue'
import ChartPanel from '@/components/vitals/ChartPanel.vue'
import { useRoute } from 'vue-router'
import PageTitle from '@/components/PageTitle.vue'
import { useAppStore, useI18nStore } from '@/stores'
import cloneDeep from 'lodash.clonedeep'
import { PortalTimeframeKeys } from '@/types/vitals'

// @ts-ignore
const contextualAnalytics = useLDFeatureFlag(FeatureFlags.PortalContextualAnalytics, false)

const { notify } = useToaster()
const errorMessage = ref('')
const application = ref(null)
const helpText = useI18nStore().state.helpText

const $route = useRoute()
const appId = computed(() => $route.params.application_id as string)
const appName = computed(() => application?.value?.name)

const breadcrumbs = computed(() => (
  [
    {
      key: 'my-apps',
      to: { name: 'my-apps' },
      text: 'My Apps'
    },
    {
      key: 'show-application',
      to: { name: 'show-application' },
      text: appName.value,
      params: {
        application_id: appId
      }
    }
  ]
))

const { portalApiV2 } = usePortalApi()

const appStore = useAppStore()
const { allowedTimePeriod } = storeToRefs(appStore)
const hideCalendar = allowedTimePeriod.value === PortalTimeframeKeys.ONE_DAY

const { timePeriods, minDateCalendar } = useAllowedTimeframes(allowedTimePeriod)

const { state: currentState, send } = useMachine(createMachine({
  predictableActionArguments: true,
  id: 'ApplicationDashboard',
  initial: 'idle',
  states: {
    idle: { on: { FETCH: 'pending', REJECT: 'error' } },
    pending: { on: { RESOLVE: 'success', REJECT: 'error' } },
    success: { type: 'final' },
    error: { on: { FETCH: 'pending' } }
  }
}))

const MAX_FILTER_ITEMS = 20
const FILTER_SEARCH_DEBOUNCE = 350
const FILTER_SELECTION_DEBOUNCE = 900

const selectedTimeframe = ref(TimePeriods.get(TimeframeKeys.ONE_DAY))
const timeframe = ref(timeframeToDatepickerSelection(selectedTimeframe.value as Timeframe))
const vitalsLoading = ref(true)

const allProductVersions = ref<ProductVersionData[]>([])
const searchResultFilter = ref<ProductVersionsResult>({ results: [], hasMoreResults: false })
const multiselectItems = computed(() => searchResultFilter.value?.results)

const versionMultiSelectModel = ref([])
const selectedProductVersions = ref([])
const hasProductVersions = computed(() => allProductVersions.value.length || false)
const filterMultiselectLoading = ref(true)

// Query for new chart data when any of these values are changed
const chartFilters = computed<ChartFilters>(() => {
  return {
    timeframe: selectedTimeframe,
    apiVersions: selectedProductVersions
  } as ChartFilters
})

const selectedProductVersionIds = computed<string[]>(() => selectedProductVersions.value.map(v => v.value))
let timeout

const handleProductVersionSearch = (query: string) => {
  if (!query) { return }

  if (timeout) { clearTimeout(timeout) }

  // The Dev Portal monolith's v1 API does not support pagination; this debounce will make more sense
  // when migrated to `konnect-portal`, where the v2 API does paginate results.
  timeout = setTimeout(() => {
    searchProductVersions(query)
  }, FILTER_SEARCH_DEBOUNCE)
}

const handleProductVersionSelection = (items) => {
  if (timeout) { clearTimeout(timeout) }

  timeout = setTimeout(() => {
    selectedProductVersions.value = cloneDeep(items)
  }, FILTER_SELECTION_DEBOUNCE)
}

const handleChangedItem = (item) => {
  if (!item) { return }

  const itemAdded = selectedProductVersions.value.filter(curr => curr.value === item.value)

  versionMultiSelectModel.value = item

  // If a new item selected, set its `selected` state to true
  item.selected = !!itemAdded.length
}

const changeTimeframe = (timeframe) => {
  selectedTimeframe.value = cloneDeep(datePickerSelectionToTimeframe(timeframe))
}

const multiselectFooter = computed(() => {
  return hasProductVersions.value && searchResultFilter.value.hasMoreResults
    ? helpText.analytics.resultsLimited
    : ''
})

const searchProductVersions = (query: string) => {
  // Reset item list that may have been truncated by a previous search
  searchResultFilter.value.results = cloneDeep(allProductVersions.value)

  // Perform client-side search
  if (query) {
    const results = allProductVersions.value.filter(item => item.label.includes(query))

    searchResultFilter.value = {
      results: results.slice(0, MAX_FILTER_ITEMS),
      hasMoreResults: results.length > MAX_FILTER_ITEMS
    }
  }
}

const fetchProductVersions = async () => {
  return portalApiV2.value.service.registrationsApi.listApplicationRegistrations({ applicationId: appId.value })
    .then(({ data }) => {
      filterMultiselectLoading.value = false

      if (data?.data?.length) {
        allProductVersions.value = data.data.map(svc => {
          return {
            label: `${svc.product_name} - ${svc.product_version_name}`,
            value: svc.product_version_id
          }
        })

        const results = cloneDeep(allProductVersions.value)

        // Set the original state of our Product Versions filter
        searchResultFilter.value = {
          results: results.slice(0, MAX_FILTER_ITEMS),
          hasMoreResults: data.meta.page.total > MAX_FILTER_ITEMS
        }
      }
    }).catch((error) => handleError(error))
}

const fetchApplication = () => {
  send('FETCH')

  return portalApiV2.value.service.applicationsApi.getApplication({ applicationId: appId.value })
    .then(({ data }) => {
      send('RESOLVE')
      application.value = data

      vitalsLoading.value = false
    }).catch(error => {
      send('REJECT')
      errorMessage.value = getMessageFromError(error)
    })
}

const handleError = (error) => {
  notify({
    appearance: 'danger',
    message: getMessageFromError(error)
  })
}

onMounted(() => {
  fetchApplication()
  fetchProductVersions()
})

</script>

<style lang="scss" scoped>

.application-dashboard-wrapper {
  .page-title {
    margin-bottom: 24px;
  }
}

.analytics-filters {
  column-gap: 24px;
  flex-direction: column;
  flex-wrap: wrap;
  row-gap: 24px;
  display: flex;
  flex-grow: 1;
  justify-content: space-between;
  align-items: baseline;
  margin-bottom: 32px;

  @media (min-width: 768px) {
    flex-direction: row;
    justify-content: space-around;
  }

  // Dark theme causes the input field text to become unreadable
  &:deep(.k-multiselect-trigger) {
    background: var(--white, #fff);

    .k-input {
      background: var(--white, #fff);
    }
  }

  .analytics-service-filter {
    min-width: 50%;
    overflow: hidden;
    flex-grow: 1;
  }

  // override theme background and text colors until full portal customization
  .analytics-timepicker {
    &:deep(.timepicker-input) {
      background: var(--white, #fff);
    }

    &:deep(.k-segmented-control) {
      .k-button {
        color: #1155cb !important;
        font-weight: 500 !important;

        &.primary {
          background-color: #f2f6fe !important;
        }
      }
    }
  }
}

.analytics-summary {
  margin-bottom: 32px;
  .analytics-summary-title {
    font-weight: 400;
    margin-bottom: 16px;
    font-size: var(--type-lg);
  }
  .analytics-metrics-cards {
    margin-bottom: 32px;
  }

  .chart-overview {
    font-weight: 400;
    margin-bottom: 16px;
    font-size: var(--type-lg);
  }
}
.no-product-versions-message {
margin-bottom: 16px;
}

</style>
