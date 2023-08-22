<template>
  <Content>
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
      <div>
        <PageTitle
          class="mb-5"
          :title="application.name"
        >
          <template #right>
            <KButton
              data-testid="application-update-button"
              appearance="primary"
              :is-rounded="false"
              :to="{ name: 'update-application' }"
            >
              {{ helpText.application.edit }}
            </KButton>
          </template>
        </PageTitle>
        <div class="d-flex justify-between mb-6">
          <div
            v-if="application.description"
            class="flex-1"
          >
            <p class="mb-2">
              {{ helpText.application.description }}
            </p>
            <p class="color-text_colors-secondary">
              {{ application.description }}
            </p>
          </div>
          <div class="flex-1 text-right">
            <div
              v-if="application.redirect_uri"
              class="color-text_colors-secondary"
            >
              {{ helpText.application.redirectUri(application.redirect_uri) }}
            </div>
            <div
              v-if="application.reference_id"
              class="color-text_colors-secondary"
            >
              {{ helpText.application.referenceId(application.reference_id) }}
            </div>
          </div>
        </div>
      </div>
      <hr class="my-6">
      <div
        v-if="!vitalsLoading"
      >
        <PageTitle class="mb-5">
          <h2 class="font-normal type-lg m-0">
            {{ analyticsCardTitle }}
          </h2>
          <template #right>
            <KButton
              data-testid="application-dashboard-button"
              :is-rounded="false"
              appearance="secondary"
              @click="$router.push({ name: 'application-dashboard', params: { application_id: id }})"
            >
              {{ helpText.analytics.viewAnalytics }}
            </KButton>
          </template>
        </PageTitle>
        <AnalyticsMetricsCard
          class="mb-4"
          data-testid="analytics-metric-cards"
          hide-title
          :application-id="application.id"
          :timeframe="(fixedTimeframe as Timeframe)"
        />
        <hr class="my-6">
      </div>
      <DcrAuthenticationTable
        v-if="isDcr"
        :application="application"
        class="mb-6"
      />
      <CredentialsList
        v-if="!isDcr"
        :id="id"
        class="mb-6"
      />
      <ProductList :id="id" />
    </section>
  </Content>
</template>

<script lang="ts">
import { defineComponent, computed, ref, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useMachine } from '@xstate/vue'
import { createMachine } from 'xstate'
import getMessageFromError from '@/helpers/getMessageFromError'
import usePortalApi from '@/hooks/usePortalApi'

import { useRoute } from 'vue-router'
import PageTitle from '@/components/PageTitle.vue'
import CredentialsList from './CredentialsList.vue'
import ProductList from './ProductList.vue'
import DcrAuthenticationTable from './DcrAuthenticationTable.vue'
import AnalyticsMetricsCard from '@/components/vitals/AnalyticsMetricsCard.vue'

import { useI18nStore, useAppStore } from '@/stores'
import { PortalTimeframeKeys } from '@/types/vitals'
import type { Timeframe } from '@kong-ui-public/analytics-utilities'
import {
  TimeframeKeys,
  TimePeriods
} from '@kong-ui-public/analytics-utilities'

export default defineComponent({
  name: 'ApplicationDetail',
  components: { AnalyticsMetricsCard, PageTitle, CredentialsList, ProductList, DcrAuthenticationTable },

  setup () {
    const errorMessage = ref('')
    const application = ref(null)

    const helpText = useI18nStore().state.helpText
    const $route = useRoute()
    const id = computed(() => $route.params.application_id as string)
    const breadcrumbs = computed(() => ([{
      key: 'my-apps',
      to: { name: 'my-apps' },
      text: helpText.application.breadcrumbMyApps
    }]))

    const { portalApiV2 } = usePortalApi()
    const appStore = useAppStore()
    const { isDcr, allowedTimePeriod } = storeToRefs(appStore)
    const vitalsLoading = ref(false)
    const fixedTimeframe = allowedTimePeriod.value === PortalTimeframeKeys.NINETY_DAYS
      ? ref(TimePeriods.get(TimeframeKeys.THIRTY_DAY) as Timeframe)
      : ref(TimePeriods.get(TimeframeKeys.ONE_DAY) as Timeframe)

    const { state: currentState, send } = useMachine(createMachine({
      predictableActionArguments: true,
      id: 'ApplicationDetails',
      initial: 'idle',
      states: {
        idle: { on: { FETCH: 'pending', REJECT: 'error' } },
        pending: { on: { RESOLVE: 'success', REJECT: 'error' } },
        success: { type: 'final' },
        error: { on: { FETCH: 'pending' } }
      }
    }))

    const analyticsCardTitle = allowedTimePeriod.value === PortalTimeframeKeys.NINETY_DAYS
      ? `${helpText.analytics.summary30Days} ${helpText.analytics.summary}`
      : `${helpText.analytics.summary24Hours} ${helpText.analytics.summary}`

    const fetchApplication = () => {
      send('FETCH')

      portalApiV2.value.service.applicationsApi.getApplication({ applicationId: id.value })
        .then(res => {
          application.value = res.data
          send('RESOLVE')
        })
        .catch(error => {
          send('REJECT')
          errorMessage.value = getMessageFromError(error)
        })
    }

    onMounted(() => {
      fetchApplication()
    })

    return {
      analyticsCardTitle,
      currentState,
      errorMessage,
      application,
      helpText,
      id,
      breadcrumbs,
      isDcr,
      fixedTimeframe,
      vitalsLoading
    }
  }
})
</script>
