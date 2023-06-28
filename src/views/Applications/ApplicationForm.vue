<template>
  <Content>
    <div class="w-1/2 mx-auto">
      <PageTitle
        :title="($route.meta.title as string)"
        class="mb-5"
      />
      <KAlert
        v-if="currentState.matches('error')"
        appearance="danger"
        class="mb-5"
        :alert-message="errorMessage"
      />
      <div>
        <p class="text-sm mb-5">
          <span class="text-danger">*</span> {{ helpText.application.reqField }}
        </p>
        <form @submit.prevent="formMethod">
          <div class="mb-5">
            <KLabel for="applicationName">
              {{ helpText.application.applicationName }} <span class="text-danger">*</span>
            </KLabel>
            <KInput
              id="applicationName"
              v-model.trim="formData.name"
              data-testid="application-name-input"
              type="text"
              class="k-input--full"
            />
          </div>
          <div
            v-if="isDcr"
            class="mb-5"
          >
            <KLabel for="redirectUri">
              {{ helpText.application.redirectUriLabel }}
            </KLabel>
            <KInput
              id="redirectUri"
              v-model="formData.redirect_uri"
              type="text"
              class="w-100 k-input--full"
            />
          </div>
          <div
            v-else
            class="mb-5"
          >
            <KLabel for="referenceId">
              {{ helpText.application.form.referenceId.label }} <span class="text-danger">*</span>
            </KLabel>
            <div class="d-flex">
              <KInput
                id="referenceId"
                v-model="formData.reference_id"
                data-testid="reference-id-input"
                type="text"
                class="k-input--full"
                :placeholder="helpText.application.form.referenceId.placeholder"
                :help="helpText.application.form.referenceId.help"
              />
              <KButton
                class="generate-reference-id-button"
                data-testid="generate-reference-id"
                :is-rounded="false"
                appearance="secondary"
                size="small"
                @click="generateReferenceId"
              >
                {{ helpText.application.form.referenceId.generate }}
              </KButton>
            </div>
          </div>
          <div class="mb-5">
            <KLabel for="description">
              {{ helpText.application.description }}
            </KLabel>

            <KTextArea
              id="description"
              v-model.trim="formData.description"
              :rows="5"
              class="k-input--full"
            />
          </div>
          <div class="flex">
            <div class="flex-1">
              <KButton
                :is-rounded="false"
                type="submit"
                appearance="primary"
                class="mr-4"
                :disabled="isEnabled ? null : true"
              >
                {{ buttonText }}
              </KButton>
              <KButton
                :is-rounded="false"
                appearance="secondary"
                @click="handleCancel"
              >
                {{ helpText.application.cancel }}
              </KButton>
            </div>
            <div v-if="formMode === 'edit'">
              <KButton
                data-testid="application-delete-button"
                appearance="danger"
                :is-rounded="false"
                @click="send('CLICKED_DELETE')"
              >
                {{ helpText.application.delete }}
              </KButton>
            </div>
          </div>
        </form>
      </div>
    </div>

    <KModal
      :title="modalTitle"
      :is-visible="currentState.matches('confirm_delete')"
      data-testid="application-delete-modal"
      :action-button-text="helpText.application.delete"
      action-button-appearance="danger"
      class="delete-modal"
      @canceled="send('CLICKED_CANCEL')"
    >
      <template #header-content>
        {{ modalTitle }}
      </template>
      <template #body-content>
        {{ helpText.application.confirmDelete(formData.name) }}
      </template>
      <template #footer-content>
        <KButton
          :is-rounded="false"
          appearance="danger"
          data-testid="application-delete-confirm-button"
          class="mr-3"
          @click="handleDelete"
        >
          {{ helpText.application.delete }}
        </KButton>
        <KButton
          appearance="secondary"
          :is-rounded="false"
          data-testid="application-delete-cancel-button"
          @click="send('CLICKED_CANCEL')"
        >
          {{ helpText.application.cancel }}
        </KButton>
      </template>
    </KModal>
    <KModal
      :title="helpText.application.applicationCredentials"
      :is-visible="secretModalIsVisible"
      data-testid="copy-secret-modal"
      :action-button-text="helpText.application.delete"
      action-button-appearance="danger"
      class="application-secret-modal"
      @canceled="send('CLICKED_CANCEL')"
    >
      <template #header-content>
        {{ helpText.application.applicationSecret }}
      </template>
      <template #body-content>
        {{ helpText.application.headerDescription1 }}<strong>{{ formData.name }}</strong>
        {{ helpText.application.headerDescription2 }}<strong>{{ helpText.application.headerDescription3 }}</strong>
        {{ helpText.application.headerDescription4 }}

        <CopyButton
          :label="helpText.application.clientID"
          :text-to-copy="clientId"
        />

        <CopyButton
          :label="helpText.application.clientSecret"
          :text-to-copy="clientSecret"
        />
      </template>
      <template #footer-content>
        <KButton
          :is-rounded="false"
          appearance="primary"
          data-testid="close-application-secret-modal"
          @click="handleAcknowledgeSecret"
        >
          {{ helpText.application.proceed }}
        </KButton>
      </template>
    </KModal>
  </Content>
</template>

<script lang="ts">
import { defineComponent, computed, ref, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { v4 as uuidv4 } from 'uuid'
import { useRoute, useRouter } from 'vue-router'
import { useMachine } from '@xstate/vue'
import { createMachine } from 'xstate'
import PageTitle from '@/components/PageTitle.vue'
import CopyButton from '@/components/CopyButton.vue'
import usePortalApi from '@/hooks/usePortalApi'
import cleanupEmptyFields from '@/helpers/cleanupEmptyFields'
import useToaster from '@/composables/useToaster'
import { useI18nStore, useAppStore } from '@/stores'
import { CreateApplicationPayload, UpdateApplicationPayload } from '@kong/sdk-portal-js'

export default defineComponent({
  name: 'ApplicationForm',
  components: { PageTitle, CopyButton },

  setup () {
    function makeDefaultFormData (isDcr:boolean): UpdateApplicationPayload {
      const returnObject = {
        name: '',
        description: '',
        redirect_uri: '',
        reference_id: ''
      }
      if (isDcr) {
        delete returnObject.reference_id
      } else {
        delete returnObject.redirect_uri
      }

      return returnObject
    }

    const helpText = useI18nStore().state.helpText
    const appStore = useAppStore()
    const { isDcr } = storeToRefs(appStore)
    const errorMessage = ref('')
    const clientSecret = ref('')
    const clientId = ref('')
    const applicationId = ref('')
    const secretModalIsVisible = ref(false)

    const defaultFormData: UpdateApplicationPayload = makeDefaultFormData(isDcr.value)
    const formData = ref(defaultFormData)

    const { notify } = useToaster()
    const $route = useRoute()
    const $router = useRouter()

    const { state: currentState, send } = useMachine(
      createMachine({
        predictableActionArguments: true,
        id: 'applicationFormMachine',
        initial: 'idle',
        states: {
          idle: {
            on: {
              CLICKED_SUBMIT: 'pending',
              FETCH: 'pending',
              CLICKED_DELETE: 'confirm_delete'
            }
          },
          pending: { on: { RESOLVE: 'success', REJECT: 'error' } },
          success: {
            on: { CLICKED_SUBMIT: 'pending', CLICKED_DELETE: 'confirm_delete' }
          },
          error: { on: { SUBMIT: 'pending' } },
          confirm_delete: {
            on: { CLICKED_DELETE: 'pending', CLICKED_CANCEL: 'idle' }
          }
        }
      })
    )
    const isEnabled = computed(
      () =>
        !currentState.value.matches('pending') &&
        formData.value.name.length &&
        (isDcr.value ? true : formData.value.reference_id?.length)
    )
    const modalTitle = computed(() => `Delete ${formData.value?.name}`)
    const id = computed(() => $route.params.application_id as string)
    const formMode = computed(() => (id.value ? 'edit' : 'create'))
    const formMethod = computed(() => formMode.value === 'create' ? handleSubmit : handleUpdate)
    const buttonText = computed(
      () =>
        ({
          edit: currentState.value.matches('pending') ? 'Submitting' : 'Update',
          create: currentState.value.matches('pending') ? 'Submitting' : 'Create'
        })[formMode.value]

    )

    const { portalApiV2 } = usePortalApi()

    onMounted(() => {
      if (id.value) {
        fetchApplication()
      }
    })

    const copyTokenToClipboard = (executeCopy, copyItem) => {
      if (!executeCopy(copyItem)) {
        notify({
          appearance: 'danger',
          message: helpText.copyButton.copyFailed.start + 'id' + helpText.copyButton.copyFailed.end
        })
      }

      notify({
        message: helpText.copyButton.copySucceeded.start + (copyItem) + helpText.copyButton.copySucceeded.end
      })
    }

    const handleSubmit = () => {
      send('CLICKED_SUBMIT')

      portalApiV2.value.service.applicationsApi
        .createApplication({
          createApplicationPayload: cleanupEmptyFields(formData.value) as CreateApplicationPayload
        })
        .then((res) => {
          if (isDcr.value) {
            secretModalIsVisible.value = true
            applicationId.value = res.data.id
            clientId.value = res.data.credentials?.client_id
            clientSecret.value = res.data.credentials?.client_secret
          } else {
            handleSuccess(res.data.id, 'created')
          }
        })
        .catch((error) => handleError(error))
    }

    const handleUpdate = () => {
      send('CLICKED_SUBMIT')

      portalApiV2.value.service.applicationsApi
        .updateApplication({
          applicationId: id.value,
          updateApplicationPayload: cleanupEmptyFields(formData.value) as { name: string, [x: string]: any }
        })
        .then((res) => handleSuccess(res.data.id, 'updated'))
        .catch((error) => handleError(error))
    }

    const handleDelete = () => {
      portalApiV2.value.service.applicationsApi
        .deleteApplication({ applicationId: id.value })
        .then(() => handleSuccess('', 'deleted'))
        .catch((error) => handleError(error))
    }

    const fetchApplication = () => {
      send('FETCH')
      portalApiV2.value.service.applicationsApi
        .getApplication({ applicationId: id.value })
        .then((res) => {
          send('RESOLVE')

          const newFormData = {
            ...formData.value,
            name: res.data.name,
            description: res.data.description || '',
            redirect_uri: res.data.redirect_uri,
            reference_id: res.data.reference_id
          }
          if (isDcr.value) {
            delete newFormData.reference_id
          } else {
            delete newFormData.redirect_uri
          }

          formData.value = newFormData
        })
        .catch((error) => handleError(error))
    }

    const handleAcknowledgeSecret = () => {
      send('CLICKED_CANCEL')
      secretModalIsVisible.value = false

      handleSuccess(applicationId.value, 'created')
    }

    const getRedirectRoute = (id: string) => {
      if (!id) {
        return { path: '/my-apps' }
      }

      // redirect to app reg modal in spec page
      if (
        $route.query.product &&
        $route.query.product_version
      ) {
        return {
          name: 'spec',
          params: {
            product: $route.query.product,
            product_version: $route.query.product_version
          },
          query: {
            application: id
          }
        }
      }

      // view application
      return { path: `/application/${id}` }
    }

    const handleSuccess = (id: string, action: string): void => {
      send('RESOLVE')
      notify({
        message: `Application successfully ${action}`
      })

      $router.push(getRedirectRoute(id))
    }

    const handleError = (error) => {
      const { data } = error.response
      const responseError =
        (data.invalid_parameters && data.invalid_parameters.length && data.invalid_parameters) ||
        data.detail ||
        error.detail

      send('REJECT')

      if (Array.isArray(responseError)) {
        errorMessage.value = responseError.map(err => err.reason).join(', ')

        return
      }

      errorMessage.value = responseError
    }

    const handleCancel = () => {
      $router.back()
    }

    const generateReferenceId = () => {
      formData.value.reference_id = uuidv4()
    }

    return {
      modalTitle,
      currentState,
      formData,
      errorMessage,
      isEnabled,
      id,
      isDcr,
      clientSecret,
      clientId,
      copyTokenToClipboard,
      secretModalIsVisible,
      handleAcknowledgeSecret,
      send,
      buttonText,
      formMode,
      formMethod,
      handleDelete,
      handleCancel,
      generateReferenceId,
      helpText
    }
  }
})
</script>

<style lang="scss">
.delete-modal, .application-secret-modal {
  --KModalHeaderColor: var(--text_colors-headings);
  --KModalColor: var(--text_colors-primary);
}
.k-input+.help, .k-input-wrapper+.help {
  color: var(--text_colors-secondary) !important;
}
</style>

<style lang="scss" scoped>

.generate-reference-id-button {
  position: relative;
  height: 36px;
  top: 4px;
  margin-left: 16px;
}
</style>
