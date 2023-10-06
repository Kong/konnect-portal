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
            </div>
          </template>
          <template #name="{ row }">
            <p
              class="table-text"
              :data-testid="`register-${row.name}`"
            >
              {{ row.name }}
            </p>
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
        :to="{ name: 'create-application', query: { product: $route.params.product, product_version: $route.params.product_version } }"
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
import { computed, defineComponent, ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useMachine } from '@xstate/vue'
import { createMachine } from 'xstate'
import useToaster from '@/composables/useToaster'
import usePortalApi from '@/hooks/usePortalApi'
import { useI18nStore } from '@/stores'
import getMessageFromError from '@/helpers/getMessageFromError'

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
      type: Object,
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
    const applications = ref([])
    const key = ref(0)
    const fetcherCacheKey = computed(() => key.value.toString())

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
        productId: props.product?.id || $route.params.product,
        versionId: props.version?.id || $route.params.product_version,
        ...(searchStr.value.length && { filterNameContains: searchStr.value }),
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

    const submitSelection = () => {
      send('CLICK_SUBMIT')
      portalApiV2.value.service.registrationsApi.createApplicationRegistration({
        applicationId: selectedApplication.value,
        createRegistrationPayload: {
          product_version_id: props.version.id
        }
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

    onMounted(() => {
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
      rowAttrsFn,
      fetcher,
      modalText,
      searchStr,
      tableHeaders,
      fetcherCacheKey,
      ktablePaginationConfig,
      alreadyRegisteredMessage,
      handleRowClick,
      submitSelection,
      closeModal
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
    background-color: var(--text_colors-accent) !important;

    td {
      color: var(--section_colors-body) !important;
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

</style>

<style lang="scss">
.application-registration-modal {
  .modal-backdrop {
    .modal-dialog {
      margin-top: 4rem;
      margin-bottom: 0;
      max-width: 750px;
    }
  }
  .k-table-toolbar {
    margin-bottom: 8px !important;
  }
}
</style>
