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
          class="mb-4"
        />
        <div v-if="!availableApplications.length">
          <p class="color-text_colors-primary">
            {{ helpText.applicationRegistration.noAvailableApplications }}
          </p>
          <div v-if="registeredApplications.length">
            <p>
              {{ alreadyRegisteredMessage }}
            </p>
            <ul class="registered-apps-list">
              <li
                v-for="app in registeredApplications"
                :key="app.id"
              >
                <router-link
                  :to="{
                    name: 'show-application',
                    params: { 'application_id': app.id }
                  }"
                  class="color-blue-500"
                >
                  {{ app.name }}
                </router-link>
              </li>
            </ul>
          </div>
        </div>
        <div v-else>
          <div class="color-text_colors-primary font-semibold mb-2">
            {{ helpText.applicationRegistration.selectApplication }}
          </div>
          <div>
            <select
              v-model="selectedApplication"
              class="k-input w-100 mb-4"
            >
              <option
                v-for="app in availableApplications"
                :key="app.id"
                :value="app.id"
              >
                {{ app.name }}
              </option>
            </select>
            <router-link
              data-testid="create-application-2"
              :to="{ name: 'create-application', query: { product: $route.params.product, product_version: $route.params.product_version } }"
              class="color-blue-500"
            >
              {{ helpText.applicationRegistration.createNewApplication }}
            </router-link>
          </div>
        </div>
      </div>
      <div v-if="currentState.matches('success_application_status_is_pending')">
        <p class="color-text_colors-primary">
          {{ modalText.body }}
        </p>
      </div>
    </template>
    <template #footer-content>
      <KButton
        v-if="!availableApplications.length"
        data-testid="create-application"
        :is-rounded="false"
        appearance="primary"
        :disabled="currentState.matches('pending')"
        class="mr-3"
        :to="{ name: 'create-application', query: { product: $route.params.product, product_version: $route.params.product_version } }"
      >
        {{ helpText.applicationRegistration.createApplication }}
      </KButton>
      <KButton
        v-else
        data-testid="submit-registration"
        :is-rounded="false"
        appearance="primary"
        :disabled="currentState.matches('pending')"
        class="mr-3"
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
import { computed, defineComponent, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useMachine } from '@xstate/vue'
import { createMachine } from 'xstate'
import useToaster from '@/composables/useToaster'
import usePortalApi from '@/hooks/usePortalApi'
import { useI18nStore } from '@/stores'
import getMessageFromError from '@/helpers/getMessageFromError'
import { fetchAll } from '@/helpers/fetchAll'
import useLDFeatureFlag from '@/hooks/useLDFeatureFlag'
import { FeatureFlags } from '@/constants/feature-flags'

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
    const apiProductFlagEnabled = useLDFeatureFlag(FeatureFlags.ApiProductBuilder, false)
    const $router = useRouter()
    const $route = useRoute()
    const { notify } = useToaster()

    const helpText = useI18nStore().state.helpText
    const errorMessage = ref('')
    const selectedApplication = ref('')
    const applications = ref([])

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

    const availableApplications = computed(() => {
      return applications.value.filter(app => {
        if (app?.registrations?.length > 0) {
          return app.registrations.every(r => r.product_version_id !== props.version?.id)
        }

        return app
      })
    })

    const registeredApplications = computed(() => {
      return applications.value.filter(app => {
        if (app?.registrations?.length > 0) {
          return app.registrations.some(r => r.product_version_id === props.version?.id)
        }

        return app
      })
    })

    const attachRegistrations = async (apps) => {
      const appsWithReg = await Promise.all(apps.map(async app => {
        app.registrations = await fetchAll((meta) => portalApiV2.value.service.registrationsApi.listApplicationRegistrations({ applicationId: app.id, ...meta }))

        return app
      }))

      return appsWithReg
    }

    const initializeSelectedApplication = () => {
      // no available applications, return
      if (!availableApplications.value.length) {
        return
      }

      // if initialSelectedApplication prop exists in availableApplications, return initialSelectedApplication (id)
      if (availableApplications.value.some(app => app.id === props.initialSelectedApplication)) {
        return props.initialSelectedApplication
      }

      // otherwise, return the first available application id
      return availableApplications.value[0].id
    }

    const fetchApplications = () => {
      send('FETCH')
      fetchAll((meta) => portalApiV2.value.service.applicationsApi.listApplications(meta))
        .then(async (apps) => {
          applications.value = await attachRegistrations(apps)
          selectedApplication.value = initializeSelectedApplication()
          send('RESOLVE')
        })
        .catch(error => {
          console.error(error)
          send('REJECT', {
            errorMessage: getMessageFromError(error)
          })
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
          /** @param {import('axios').AxiosResponse<{status: 'approved'|'pending'}>} res */
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
    }

    watch(() => props.isVisible, (newState) => {
      if (newState) {
        fetchApplications()
      }
    })

    watch(selectedApplication, (newSelectedApplication) => {
      if (newSelectedApplication && newSelectedApplication !== $route.query.application) {
        $router.replace({
          query: {
            ...$route.query,
            application: newSelectedApplication
          }
        })
      }
    })

    const alreadyRegisteredMessage = apiProductFlagEnabled ? helpText.applicationRegistration.registeredApplicationsProduct : helpText.applicationRegistration.registeredApplicationsService

    return {
      currentState,
      errorMessage,
      applications,
      selectedApplication,
      helpText,
      modalText,
      availableApplications,
      alreadyRegisteredMessage,
      registeredApplications,
      submitSelection,
      closeModal
    }
  }
})
</script>

<style lang="scss" scoped>

 .registered-apps-list {
   margin-top: 1rem;
   list-style: none;
   text-align: left;
   padding-left: var(--spacing-xl, 32px);
 }
</style>

<style lang="scss">
.application-registration-modal {
  .modal-backdrop {
    .modal-dialog {
      margin-top: 7rem;
    }
  }
}
</style>
