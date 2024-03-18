<template>
  <KModal
    data-testid="application-registration-modal"
    class="application-registration-modal"
    :is-visible="isVisible"
    :title="applications.length ? modalText.title : helpText.applicationRegistration.noApplications"
    @proceed="submitSelection"
    @canceled="closeModal"
  >
    <template #header-content>
      <span class="color-text_colors-primary">
        {{ applications.length ? modalText.title : helpText.applicationRegistration.noApplications }}
      </span>
    </template>
    <template #body-content>
      <KSkeleton
        v-if="currentState.matches('pending')"
        :delay-milliseconds="200"
      />
      <div v-else-if="!currentState.matches('success_application_status_is_pending')">
        <KAlert
          v-if="currentState.matches('error') "
          appearance="danger"
          :alert-message="errorMessage"
          class="alert-message"
        />
        <KTable
          class="applications-list"
          :is-loading="currentState.matches('pending')"
          data-testid="applications-list"
          :fetcher-cache-key="fetcherCacheKey"
          :empty-state-title="helpText.applicationRegistration.noApplications"
          :empty-state-message="searchStr ? helpText.applicationRegistration.noFoundApplications : helpText.applicationRegistration.noAvailableApplications"
          :fetcher="fetcher"
          has-side-border
          :headers="tableHeaders"
          :pagination-page-sizes="ktablePaginationConfig.paginationPageSizes"
          :row-attrs="rowAttrsFn"
          :initial-fetcher-params="{ pageSize: ktablePaginationConfig.initialPageSize }"
          :search-input="searchStr"
          @row:click="handleRowClick"
        >
          <template #toolbar="{ state }">
            <div class="applications-toolbar">
              <KInput
                v-if="state.hasData || searchStr"
                v-model="searchStr"
                :placeholder="helpText.applicationRegistration.searchPlaceholder"
                type="search"
              />

              <KButton
                v-if="state.hasData"
                appearance="primary"
                :is-rounded="false"
                :to="{ name: 'create-application', query: createApplicationQuery }"
              >
                {{ helpText.applicationRegistration.createApplication }}
              </KButton>
            </div>
          </template>
          <template #name="{ row }">
            <div class="name-container">
              <p
                class="table-text"
                :data-testid="`register-${row.name}`"
              >
                {{ row.name }}
              </p>
              <div v-if="selectedApplication === row.id">
                <KMultiselect
                  v-if="availableScopes.length"
                  v-model="selectedScopes"
                  :label="helpText.applicationRegistration.availableScopesLabel"
                  collapsed-context
                  data-testid="available-scopes-select"
                  class="available-scopes-select"
                  :items="mappedAvailableScopes"
                  :loading="fetchingScopes"
                  :placeholder="fetchingScopes ? helpText.applicationRegistration.fetchingScopesLabel : helpText.applicationRegistration.filterScopes"
                  width="100%"
                  @change="handleChangedItem"
                >
                  <template #label-tooltip>
                    {{ helpText.applicationRegistration.updateScopesWarning }}
                  </template>
                </KMultiselect>
              </div>
            </div>
          </template>
        </KTable>
      </div>
      <div v-if="currentState.matches('success_application_status_is_pending')">
        <p class="color-text_colors-primary">
          {{ modalText.body }}
        </p>
      </div>
    </template>
    <template #footer-content>
      <KButton
        v-if="!applications.length"
        data-testid="create-application"
        :is-rounded="false"
        appearance="primary"
        :disabled="currentState.matches('pending')"
        class="button-spacing"
        :to="{ name: 'create-application', query: createApplicationQuery }"
      >
        {{ helpText.applicationRegistration.createApplication }}
      </KButton>
      <KButton
        v-else
        data-testid="submit-registration"
        :is-rounded="false"
        appearance="primary"
        :disabled="currentState.matches('pending') || !selectedApplication"
        class="button-spacing"
        @click="currentState.matches('success_application_status_is_pending') ? closeModal() : submitSelection()"
      >
        {{ modalText.buttonText }}
      </KButton>
      <KButton
        v-if="!currentState.matches('success_application_status_is_pending') "
        appearance="secondary"
        :is-rounded="false"
        @click="closeModal"
      >
        {{ helpText.applicationRegistration.cancelButton }}
      </KButton>
    </template>
  </KModal>
</template>

<script lang="ts">
import { computed, defineComponent, ref, onMounted, watch, PropType } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useMachine } from '@xstate/vue'
import { createMachine } from 'xstate'
import useToaster from '@/composables/useToaster'
import usePortalApi from '@/hooks/usePortalApi'
import { ProductWithVersions, useI18nStore } from '@/stores'
import getMessageFromError from '@/helpers/getMessageFromError'
import { CreateRegistrationPayload } from '@kong/sdk-portal-js'

export default defineComponent({
  name: 'ViewSpecRegistrationModal',
  props: {
    initialSelectedApplication: {
      type: String,
      default: ''
    },
    isVisible: {
      type: Boolean,
      default: false
    },
    product: {
      type: Object as PropType<ProductWithVersions>,
      default: () => {}
    },
    version: {
      type: Object,
      default: () => {}
    }
  },

  emits: ['close'],

  setup (props, { emit }) {
    const $router = useRouter()
    const $route = useRoute()
    const { notify } = useToaster()

    const searchStr = ref('')
    const helpText = useI18nStore().state.helpText
    const errorMessage = ref('')
    const selectedApplication = ref('')
    const availableScopes = ref([])
    const selectedScopes = ref([])
    const alreadyGrantedScopes = ref([])
    const applications = ref([])
    const key = ref(0)
    const fetchingScopes = ref(false)
    const fetcherCacheKey = computed(() => key.value.toString())

    const mappedAvailableScopes = computed(() => {
      if (!availableScopes.value?.length) {
        return []
      }

      return availableScopes.value?.map((scope) => {
        const alreadySelected = alreadyGrantedScopes.value?.includes(scope)

        return {
          label: scope,
          value: scope,
          selected: alreadySelected
        }
      })
    })

    const tableHeaders = [
      { label: 'Name', key: 'name' }
    ]

    const ktablePaginationConfig = ref({
      paginationPageSizes: [5, 25, 50],
      initialPageSize: 5
    })

    const { portalApiV2 } = usePortalApi()

    const { state: currentState, send } = useMachine(
      createMachine({
        predictableActionArguments: true,
        id: 'RegistrationModalMachine',
        initial: 'idle',
        states: {
          idle: { on: { FETCH: 'pending' } },
          pending: {
            on: {
              RESOLVE: 'loaded',
              REGISTERED_PENDING: 'success_application_status_is_pending',
              REGISTERED_APPROVED: 'success_application_status_is_approved',
              REJECT: 'error'
            }
          },
          loaded: { on: { CLICK_SUBMIT: 'pending', CLOSED: 'idle' } },
          success_application_status_is_approved: { on: { CLOSED: 'idle' } },
          success_application_status_is_pending: { on: { CLOSED: 'idle' } },
          error: { on: { CLOSED: 'idle' } }
        }
      })
    )

    const modalText = computed(() => {
      const defaultModal = helpText.applicationRegistration.modalApplicationRegistrationDefault
      const successModal = helpText.applicationRegistration.modalApplicationRegistrationStatusIsPending

      return {
        default: {
          title: defaultModal.title(props.product?.name, props.version?.name),
          buttonText: defaultModal.buttonText
        },
        success: {
          title: successModal.title,
          body: successModal.body,
          buttonText: successModal.buttonText
        }
      }[currentState.value.matches('success_application_status_is_pending') ? 'success' : 'default']
    })

    const authStrategyId = computed(() => {
      const productVersion = $route.params.product_version
      const matchingVersion = props.product?.versions?.find((version) => version.id === productVersion)
      if (!matchingVersion) {
        return
      }

      return matchingVersion.registration_configs[0]?.id
    })

    const createApplicationQuery = computed(() => {
      return {
        product: $route.params.product,
        product_version: $route.params.product_version,
        ...(authStrategyId.value)
          ? { auth_strategy_id: authStrategyId.value }
          : {}
      }
    })

    const rowAttrsFn = (rowItem) => {
      return {
        class: {
          selected: rowItem.id === selectedApplication.value
        },
        'data-testid': 'row-item'
      }
    }

    const handleRowClick = (e, row) => {
      selectedApplication.value = row.id
    }

    const fetcher = async (payload: { pageSize: number; page: number }) => {
      const { pageSize, page: pageNumber } = payload

      const requestOptions = {
        productId: props.product?.id || $route.params.product?.toString(),
        productVersionId: props.version?.id || $route.params.product_version?.toString(),
        filterAuthStrategyId: authStrategyId.value,
        ...(searchStr.value?.length && { filterNameContains: searchStr.value }),
        unregistered: true,
        pageNumber,
        pageSize
      }

      send('FETCH')

      return portalApiV2.value.service.versionsApi.getApplicationsByProductVersion(requestOptions)
        .then((res) => {
          send('RESOLVE')

          applications.value = res.data.data

          return {
            data: res.data.data,
            total: res.data.meta.page.total
          }
        }).catch((e) => {
          send('RESOLVE')

          return handleError(e)
        })
    }

    const handleError = (error: any) => {
      notify({
        appearance: 'danger',
        message: getMessageFromError(error)
      })
    }

    const handleChangedItem = (item) => {
      if (!item) { return }

      const itemAdded = selectedScopes.value.includes(item.value)

      // If a new item selected, set its `selected` state to true
      item.selected = !itemAdded
    }

    const submitSelection = async () => {
      send('CLICK_SUBMIT')
      const payload: CreateRegistrationPayload = {
        product_version_id: props.version.id
      }

      if (selectedScopes.value?.length) {
        payload.scopes = selectedScopes.value
      }

      await portalApiV2.value.service.registrationsApi.createApplicationRegistration({
        applicationId: selectedApplication.value,
        createRegistrationPayload: payload
      })
        .then(
          res => {
            let message = 'Registration '

            if (res.data.status === 'approved') {
              send('REGISTERED_APPROVED')
              message += 'approved'
              notify({ message })
              $router.replace({ name: 'show-application', params: { application_id: res.data.application_id } })
            } else if (res.data.status === 'pending') {
              send('REGISTERED_PENDING')
              message += 'requested'
              notify({ message })
            }
          })
        .catch((error) => {
          send('REJECT')

          errorMessage.value = getMessageFromError(error)
        })
    }

    const closeModal = () => {
      send('CLOSED')
      emit('close')
      selectedApplication.value = null
      searchStr.value = ''
    }

    watch(() => selectedApplication.value, (newSelectedApplication, oldSelectedApplication) => {
      // We reset selectedScopes if we change applications
      if (newSelectedApplication !== oldSelectedApplication && selectedScopes.value?.length) {
        selectedScopes.value = []
      }
    })

    watch([() => props.product, () => props.version, () => selectedApplication.value], async (newValues, oldValues) => {
      if (props.product && props.version) {
        alreadyGrantedScopes.value = []
        fetchingScopes.value = true
        // Only make the getProductVersion request if we change productVersions
        if (newValues[1] !== oldValues[1]) {
          await portalApiV2.value.service.versionsApi.getProductVersion({
            productId: props.product.id,
            productVersionId: props.version.id
          }).then((res) => {
            fetchingScopes.value = false
            const registrationConfigs = res.data?.registration_configs

            if (registrationConfigs?.length && registrationConfigs[0].available_scopes) {
              availableScopes.value = registrationConfigs[0].available_scopes
            }
          }).finally(() => {
            fetchingScopes.value = false
          })
        }

        // don't fetch the applications granted scopes if there are no available
        // scopes.
        if (selectedApplication.value && availableScopes.value?.length) {
          fetchingScopes.value = true

          await portalApiV2.value.service.applicationsApi.getApplicationProductVersionGrantedScopes({
            applicationId: selectedApplication.value,
            productVersionId: props.version.id
          }).then((res) => {
            const grantedScopesArr = res.data.scopes

            if (grantedScopesArr?.length) {
              alreadyGrantedScopes.value = grantedScopesArr
              selectedScopes.value = grantedScopesArr
            }

            fetchingScopes.value = false
          }).finally(() => {
            fetchingScopes.value = false
          })
        }
      }
    })

    onMounted(async () => {
      if (props.initialSelectedApplication) {
        searchStr.value = props.initialSelectedApplication
      }
    })

    const alreadyRegisteredMessage = helpText.applicationRegistration.registeredApplicationsProduct

    return {
      currentState,
      errorMessage,
      applications,
      selectedApplication,
      helpText,
      handleChangedItem,
      availableScopes,
      mappedAvailableScopes,
      selectedScopes,
      rowAttrsFn,
      fetchingScopes,
      fetcher,
      modalText,
      searchStr,
      tableHeaders,
      fetcherCacheKey,
      ktablePaginationConfig,
      alreadyRegisteredMessage,
      handleRowClick,
      submitSelection,
      closeModal,
      authStrategyId,
      createApplicationQuery
    }
  }
})
</script>

<style lang="scss" scoped>

 .table-text {
  text-align: left;
 }

 .application-registration-modal {
  :deep(.selected) {
    td {
      font-weight: 600;
      width: 100%;
    }
  }

  // TODO: kui vars
  .alert-message {
    margin-bottom: 16px;
  }
  .button-spacing {
    margin-right: 12px;
  }
 }

  .name-container {
    display: flex;
    flex-direction: column;

    .available-scopes-select {
      margin-top: 14px;
    }
  }

  .applications-toolbar {
    display: flex;
    justify-content: space-between;
  }

</style>

<style lang="scss">
.application-registration-modal {
  .modal-backdrop {
    .modal-dialog {
      margin-top: 4rem;
      margin-bottom: 0;
      max-width: 750px;

      .k-multiselect {
        .k-multiselect-icon .k-multiselect-clear-icon {
          top: 21px;
        }

        .k-multiselect-selections {
          display: flex;
          flex-wrap: wrap;
        }
      }
    }
  }
  .k-table-toolbar {
    margin-bottom: 8px !important;
  }
}
</style>
