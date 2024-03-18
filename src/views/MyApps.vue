<template>
  <Content>
    <PageTitle
      :title="helpText.myApps"
      class="mb-6"
    >
      <template #right>
        <KButton
          data-testid="create-application-button"
          appearance="primary"
          :disabled="!hasAppAuthStrategies"
          :is-rounded="false"
          :to="{ name: 'create-application' }"
        >
          <svg
            width="16"
            height="16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            class="mr-2"
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
    <KAlert
      v-if="!hasAppAuthStrategies && !fetchingAuthStrategies"
      :alert-message="helpText.authStrategyWarning"
      appearance="warning"
      class="no-auth-strategies-warning"
      data-testid="no-auth-strategies-warning"
    />
    <div
      v-if="!vitalsLoading && myAppsReady"
    >
      <MetricsProvider
        v-slot="{ timeframe }"
        v-bind="metricProviderProps"
      >
        <h2 class="summary-tier-based mb-4">
          {{ analyticsCardTitle(timeframe) }}
        </h2>
        <KCard
          class="mb-4 analytics-my-apps"
          data-testid="analytics-metric-cards"
        >
          <template #body>
            <MetricsConsumer />
          </template>
        </KCard>
      </MetricsProvider>
    </div>
    <div>
      <KAlert
        :is-showing="!!deleteError"
        :title="deleteError"
        appearance="danger"
        data-testid="delete-error-alert"
      />
      <KAlert
        :is-showing="!!refreshSecretError"
        :title="refreshSecretError"
        appearance="danger"
        data-testid="refresh-error-alert"
      />
      <KCard>
        <template #body>
          <KTable
            data-testid="applications-table"
            :fetcher-cache-key="fetcherCacheKey"
            :fetcher="fetcher"
            has-side-border
            :has-error="currentState.matches('error') && !deleteError && !refreshSecretError"
            :is-loading="currentState.matches('pending')"
            :headers="tableHeaders"
            is-clickable
            is-small
            class="applications-table"
            :pagination-page-sizes="paginationConfig.paginationPageSizes"
            :search-input="searchStr"
            :initial-fetcher-params="{ pageSize: paginationConfig.initialPageSize }"
            @row:click="(_, row) => $router.push({ name: 'show-application', params: { application_id: row.id }})"
          >
            <template #toolbar="{ state }">
              <div class="applications-toolbar">
                <KInput
                  v-if="state.hasData || searchStr"
                  v-model="searchStr"
                  :placeholder="helpText.searchPlaceholder"
                  type="search"
                />
              </div>
            </template>
            <template #name="{ row }">
              {{ row.name }}
            </template>
            <template #actions="{ row }">
              <ActionsDropdown
                :key="row.id"
                :data-testid="'actions-dropdown-' + row.id"
              >
                <template #content>
                  <div
                    data-testid="dropdown-analytics-dashboard"
                    class="py-2 px-3 type-md cursor-pointer"
                    @click="$router.push({ name: 'application-dashboard', params: { application_id: row.id }})"
                  >
                    {{ helpTextVitals.viewAnalytics }}
                  </div>
                  <div
                    v-if="isApplicationDcr(row)"
                    data-testid="dropdown-refresh-application-dcr-token"
                    class="py-2 px-3 type-md cursor-pointer"
                    @click="handleRefreshSecret(row.id)"
                  >
                    {{ helpText.refreshSecret }}
                  </div>
                  <div
                    data-testid="dropdown-delete-application"
                    class="py-2 px-3 type-md cursor-pointer delete-item"
                    @click="deleteItem = row"
                  >
                    {{ helpText.delete }}
                  </div>
                </template>
              </ActionsDropdown>
            </template>
            <template #empty-state>
              <EmptyState
                :title="searchStr ? helpText.noSearchResults : helpText.noApp"
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
      data-testid="application-delete-modal"
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
          data-testid="application-delete-confirm-button"
          :disabled="currentState.matches('pending')"
          :icon="currentState.matches('pending') ? 'spinner' : undefined"
          :is-rounded="false"
          class="mr-3"
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
import getMessageFromError from '@/helpers/getMessageFromError'
import RefreshTokenModal from '@/components/RefreshTokenModal.vue'
import PageTitle from '@/components/PageTitle.vue'
import ActionsDropdown from '@/components/ActionsDropdown.vue'
import MetricsProvider from '@/components/vitals/MetricsProvider.vue'
import usePortalApi from '@/hooks/usePortalApi'
import useToaster from '@/composables/useToaster'
import { useI18nStore } from '@/stores'
import { Timeframe, TimeframeKeys } from '@kong-ui-public/analytics-utilities'
import '@kong-ui-public/analytics-metric-provider/dist/style.css'
import { EXPLORE_V2_DIMENSIONS, EXPLORE_V2_FILTER_TYPES, MetricsConsumer } from '@kong-ui-public/analytics-metric-provider'
import { GetApplicationResponse, CredentialType } from '@kong/sdk-portal-js'

export default defineComponent({
  name: 'MyApps',
  components: { PageTitle, ActionsDropdown, RefreshTokenModal, MetricsProvider, MetricsConsumer },

  setup () {
    const { notify } = useToaster()
    const errorMessage = ref('')
    const searchStr = ref('')
    const applications = ref([])
    const key = ref(0)
    const fetcherCacheKey = computed(() => key.value.toString())
    const deleteItem = ref(null)
    const deleteError = ref(null)
    const refreshSecretError = ref(null)
    const showSecretModal = ref(false)
    const token = ref(null)
    const { portalApiV2 } = usePortalApi()
    const hasAppAuthStrategies = ref(false)
    const fetchingAuthStrategies = ref(true)

    const helpText = useI18nStore().state.helpText.myApp
    const helpTextVitals = useI18nStore().state.helpText.analytics
    const vitalsLoading = ref(true)

    const paginationConfig = ref({
      paginationPageSizes: [25, 50, 100],
      initialPageSize: 25
    })

    const isApplicationDcr = (application: GetApplicationResponse) => {
      return application.auth_strategy?.credential_type === CredentialType.ClientCredentials
    }

    const modalTitle = computed(() => `Delete ${deleteItem.value?.name}`)
    const appIds = ref([])

    const { state: currentState, send } = useMachine(createMachine({
      predictableActionArguments: true,
      id: 'DeveloperMachine',
      initial: 'idle',
      states: {
        idle: { on: { FETCH: 'pending', REJECT: 'error' } },
        pending: { on: { RESOLVE: 'success', REJECT: 'error' } },
        success: { on: { FETCH: 'pending' } },
        error: { on: { FETCH: 'pending' } }
      }
    }))

    const revalidate = () => {
      key.value += 1
    }

    const fetcher = async (payload: { pageSize: number; page: number }) => {
      const { pageSize, page: pageNumber } = payload
      const reqPayload = {
        pageNumber,
        pageSize,
        ...(searchStr.value.length && { filterNameContains: searchStr.value })
      }

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
      send('FETCH')
      portalApiV2.value.service.applicationsApi
        .deleteApplication({
          applicationId: deleteItem.value.id
        })
        .then(() => {
          send('RESOLVE')
          deleteItem.value = null
          deleteError.value = null
          revalidate() // refetch applications
          notify({
            message: helpText.deleteSuccess
          })
        })
        .catch(error => {
          send('REJECT')
          deleteItem.value = null
          deleteError.value = helpText.deleteFailure(getMessageFromError(error))
        })
    }

    const handleRefreshSecret = (id: string) => {
      send('FETCH')
      refreshSecretError.value = null

      portalApiV2.value.service.credentialsApi.refreshApplicationToken({ applicationId: id })
        .then((res) => {
          notify({
            message: helpText.refreshSecretSuccess
          })
          showSecretModal.value = true
          token.value = res.data.client_secret
        })
        .catch(error => {
          send('REJECT')
          refreshSecretError.value = helpText.refreshSecretFailure(getMessageFromError(error))
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

    onMounted(async () => {
      vitalsLoading.value = false
      fetchingAuthStrategies.value = true

      try {
        const appAuthStrategies = await portalApiV2.value.service.applicationsApi.listApplicationAuthStrategies()
        if (appAuthStrategies.data?.data?.length) {
          hasAppAuthStrategies.value = true
        }

        fetchingAuthStrategies.value = false
      } catch (err) {
        fetchingAuthStrategies.value = false
        notify({
          appearance: 'danger',
          message: helpText.authStrategyFetchError(getMessageFromError(err))
        })
      }
    })

    return {
      modalTitle,
      errorMessage,
      applications,
      currentState,
      tableHeaders,
      handleDelete,
      fetchingAuthStrategies,
      isApplicationDcr,
      deleteItem,
      deleteError,
      showSecretModal,
      hasAppAuthStrategies,
      token,
      onModalClose,
      handleRefreshSecret,
      refreshSecretError,
      searchStr,
      fetcherCacheKey,
      fetcher,
      paginationConfig,
      helpText,
      helpTextVitals,
      analyticsCardTitle,
      vitalsLoading,
      metricProviderProps,
      myAppsReady
    }
  }
})
</script>

<style lang="scss" scoped>
.delete-modal, .refresh-secret-modal {
  --KModalHeaderColor: var(--text_colors-headings);
  --KModalColor: var(--text_colors-primary);
}

.no-auth-strategies-warning {
  margin-bottom: 8px;
}
</style>
