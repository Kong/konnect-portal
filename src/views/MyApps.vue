<template>
  <Content>
    <PageTitle
      :title="helpText.myApps"
      class="my-apps-title-wrapper"
    >
      <template #right>
        <KButton
          data-testid="create-application-button"
          appearance="primary"
          :is-rounded="false"
          :to="{ name: 'create-application' }"
        >
          <svg
            width="16"
            height="16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            class="create-application-button-plus"
          >
            <title>{{ helpText.plus }}</title>
            <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M16 8A8 8 0 110 8a8 8 0 0116 0zM7 5a1 1 0 012 0v2h2a1 1 0 110 2H9v2a1 1 0 11-2 0V9H5a1 1 0 110-2h2V5z"
              fill="#fff"
              fill-opacity=".75"
            />
          </svg>
          {{ helpText.newApp }}
        </KButton>
      </template>
    </PageTitle>
    <div
      v-if="contextualAnalytics && !vitalsLoading && myAppsReady"
    >
      <MetricsProvider
        v-slot="{ timeframe }"
        v-bind="metricProviderProps"
      >
        <h2 class="summary-tier-based">
          {{ analyticsCardTitle(timeframe) }}
        </h2>
        <KCard
          class="analytics-my-apps"
          data-testid="analytics-metric-cards"
        >
          <template #body>
            <MetricsConsumer />
          </template>
        </KCard>
      </MetricsProvider>
    </div>
    <div>
      <KCard>
        <template #body>
          <KTable
            data-testid="applications-table"
            :fetcher-cache-key="fetcherCacheKey"
            :fetcher="fetcher"
            has-side-border
            :has-error="currentState.matches('error')"
            :is-loading="currentState.matches('pending')"
            :headers="tableHeaders"
            is-clickable
            is-small
            class="applications-table"
            :pagination-page-sizes="paginationConfig.paginationPageSizes"
            :initial-fetcher-params="{ pageSize: paginationConfig.initialPageSize }"
            @row:click="(_, row) => $router.push({ name: 'show-application', params: { application_id: row.id }})"
          >
            <template #name="{ row }">
              {{ row.name }}
            </template>
            <template #actions="{ row }">
              <ActionsDropdown :key="row.id">
                <template #content>
                  <div
                    v-if="contextualAnalytics"
                    data-testid="dropdown-analytics-dashboard"
                    class="dropdown-analytics-dashboard"
                    @click="$router.push({ name: 'application-dashboard', params: { application_id: row.id }})"
                  >
                    {{ helpTextVitals.viewAnalytics }}
                  </div>
                  <div
                    v-if="isDcr"
                    data-testid="dropdown-refresh-application-dcr-token"
                    class="dropdown-refresh-application-dcr-token"
                    @click="handleRefreshSecret(row.id)"
                  >
                    {{ helpText.refreshSecret }}
                  </div>
                  <div
                    data-testid="dropdown-delete-application"
                    class="dropdown-delete-application delete-item"
                    @click="deleteItem = row"
                  >
                    {{ helpText.delete }}
                  </div>
                </template>
              </ActionsDropdown>
            </template>
            <template #empty-state>
              <EmptyState
                :title="helpText.noApp"
              >
                <template #message>
                  <p>
                    <router-link
                      data-testid="create-application-link"
                      :to="{
                        name: 'create-application'
                      }"
                    >
                      {{ helpText.create }}
                    </router-link>
                    {{ helpText.getStarted }}
                  </p>
                </template>
              </EmptyState>
            </template>
            <template #error-state>
              <EmptyState
                is-error
                :title="helpText.noApp"
              >
                <template #message>
                  <p>
                    {{ 'Error: ' + errorMessage }}
                  </p>
                </template>
              </EmptyState>
            </template>
          </KTable>
        </template>
      </KCard>
    </div>

    <KModal
      :title="modalTitle"
      :is-visible="!!deleteItem"
      :action-button-text="helpText.delete"
      action-button-appearance="danger"
      class="delete-modal"
      @canceled="deleteItem = null"
    >
      <template #header-content>
        {{ modalTitle }}
      </template>
      <template #body-content>
        {{ helpText.deleteDialog(deleteItem.name) }}
      </template>
      <template #footer-content>
        <KButton
          appearance="danger"
          :is-rounded="false"
          class="delete-modal-delete-button"
          @click="handleDelete"
        >
          {{ helpText.delete }}
        </KButton>
        <KButton
          appearance="secondary"
          :is-rounded="false"
          @click="deleteItem = null"
        >
          {{ helpText.cancel }}
        </KButton>
      </template>
    </KModal>

    <RefreshTokenModal
      :is-visible="showSecretModal"
      :token="token"
      @closed="onModalClose"
    />
  </Content>
</template>

<script lang="ts">
import { defineComponent, computed, ref, onMounted } from 'vue'
import { useMachine } from '@xstate/vue'
import { createMachine } from 'xstate'
import { FeatureFlags } from '@/constants/feature-flags'
import useLDFeatureFlag from '@/hooks/useLDFeatureFlag'
import getMessageFromError from '@/helpers/getMessageFromError'
import RefreshTokenModal from '@/components/RefreshTokenModal.vue'
import PageTitle from '@/components/PageTitle.vue'
import ActionsDropdown from '@/components/ActionsDropdown.vue'
import MetricsProvider from '@/components/vitals/MetricsProvider.vue'
import usePortalApi from '@/hooks/usePortalApi'
import useToaster from '@/composables/useToaster'
import { useI18nStore, useAppStore } from '@/stores'
import { Timeframe, TimeframeKeys } from '@kong-ui-public/analytics-utilities'
import '@kong-ui-public/analytics-metric-provider/dist/style.css'
import { EXPLORE_V2_DIMENSIONS, EXPLORE_V2_FILTER_TYPES, MetricsConsumer } from '@kong-ui-public/analytics-metric-provider'

import { storeToRefs } from 'pinia'

export default defineComponent({
  name: 'MyApps',
  components: { PageTitle, ActionsDropdown, RefreshTokenModal, MetricsProvider, MetricsConsumer },

  setup () {
    const { notify } = useToaster()
    const errorMessage = ref('')
    const applications = ref([])
    const key = ref(0)
    const fetcherCacheKey = computed(() => key.value.toString())
    const deleteItem = ref(null)
    const showSecretModal = ref(false)
    const token = ref(null)
    const { portalApiV2 } = usePortalApi()

    const appStore = useAppStore()
    const { isDcr } = storeToRefs(appStore)
    const helpText = useI18nStore().state.helpText.myApp
    const helpTextVitals = useI18nStore().state.helpText.analytics
    const vitalsLoading = ref(true)

    // @ts-ignore: Dev Portal doesn't have TS for feature flags.
    const contextualAnalytics = useLDFeatureFlag(FeatureFlags.PortalContextualAnalytics, false)

    const paginationConfig = ref({
      paginationPageSizes: [25, 50, 100],
      initialPageSize: 25
    })

    const modalTitle = computed(() => `Delete ${deleteItem.value?.name}`)
    const appIds = ref([])

    const { state: currentState, send } = useMachine(createMachine({
      predictableActionArguments: true,
      id: 'DeveloperMachine',
      initial: 'idle',
      states: {
        idle: { on: { FETCH: 'pending', REJECT: 'error' } },
        pending: { on: { RESOLVE: 'success', REJECT: 'error' } },
        success: { type: 'final' },
        error: { on: { FETCH: 'pending' } }
      }
    }))

    const revalidate = () => {
      key.value += 1
    }

    const fetcher = async (payload: { pageSize: number; page: number }) => {
      const { pageSize, page: pageNumber } = payload
      const reqPayload = { pageNumber, pageSize }

      send('FETCH')

      return portalApiV2.value.service.applicationsApi
        .listApplications(reqPayload)
        .then((res) => {
          send('RESOLVE')

          appIds.value = res.data.data.map((item) => item.id)

          return {
            data: res.data.data,
            total: res.data.meta.page.total
          }
        }).catch((e) => {
          send('REJECT')

          errorMessage.value = getMessageFromError(e)
        })
    }

    const handleDelete = () => {
      portalApiV2.value.service.applicationsApi
        .deleteApplication({
          applicationId: deleteItem.value.id
        })
        .then(() => {
          deleteItem.value = null
          revalidate() // refetch applications
          notify({
            message: 'Application deleted'
          })
        })
        .catch(error => {
          deleteItem.value = null
          notify({
            appearance: 'danger',
            message: `Error: ${getMessageFromError(error)}`
          })
        })
    }

    const handleRefreshSecret = (id: string) => {
      portalApiV2.value.service.credentialsApi.refreshApplicationToken({ applicationId: id })
        .then((res) => {
          notify({
            message: 'Successfully refreshed secret'
          })
          showSecretModal.value = true
          token.value = res.data.client_secret
        })
        .catch(error => {
          notify({
            appearance: 'danger',
            message: getMessageFromError(error)
          })
        })
    }

    const onModalClose = () => {
      showSecretModal.value = false
      token.value = null
    }

    const tableHeaders = [
      { label: 'Name', key: 'name' },
      { label: 'Description', key: 'description' },
      { hideLabel: true, key: 'actions' }
    ]

    const analyticsCardTitle = (timeframe: Timeframe) => {
      if (timeframe.key === TimeframeKeys.ONE_DAY) {
        return `${helpTextVitals.summary24Hours} ${helpTextVitals.summary}`
      } else if (timeframe.key === TimeframeKeys.THIRTY_DAY) {
        return `${helpTextVitals.summary30Days} ${helpTextVitals.summary}`
      }

      return helpTextVitals.summary
    }

    const myAppsReady = computed(() => Boolean(appIds.value && appIds.value?.length))

    const metricProviderProps = computed(() => ({
      queryReady: myAppsReady.value,
      additionalFilter: [
        {
          type: EXPLORE_V2_FILTER_TYPES.IN,
          dimension: EXPLORE_V2_DIMENSIONS.APPLICATION,
          values: appIds.value
        }
      ]
    }))

    onMounted(() => {
      vitalsLoading.value = false
    })

    return {
      modalTitle,
      errorMessage,
      applications,
      currentState,
      tableHeaders,
      handleDelete,
      isDcr,
      deleteItem,
      showSecretModal,
      token,
      onModalClose,
      handleRefreshSecret,
      fetcherCacheKey,
      fetcher,
      paginationConfig,
      helpText,
      helpTextVitals,
      analyticsCardTitle,
      contextualAnalytics,
      vitalsLoading,
      metricProviderProps,
      myAppsReady
    }
  }
})
</script>

<style lang="scss">
.delete-modal, .refresh-secret-modal {
  --KModalHeaderColor: var(--text_colors-headings);
  --KModalColor: var(--text_colors-primary);
}
</style>

<style lang="scss" scoped>
.my-apps-title-wrapper  {
  margin-bottom: 24px;
}
.create-application-button-plus  {
  margin-right: 8px;
}
.analytics-my-apps,
.summary-tier-based {
  margin-bottom: 16px;
}

.dropdown-delete-application,
.dropdown-refresh-application-dcr-token,
.dropdown-analytics-dashboard {
  padding: 8px 12px;
  cursor: pointer;
  font-size: 16px;
  line-height: 24px;
}

.delete-modal-delete-button {
  margin-right: 12px;
}
</style>
