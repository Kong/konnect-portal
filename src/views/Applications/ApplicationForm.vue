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
        <KAlert
          v-if="!hasAppAuthStrategies && !fetchingAuthStrategies && formMode === 'create'"
          :alert-message="helpText.application.authStrategyWarning"
          appearance="warning"
          class="no-auth-strategies-warning"
          data-testid="no-auth-strategies-warning"
        />
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
            class="mb-5"
          >
            <KLabel
              for="authStrat"
            >
              {{ helpText.application.authStrategy }} <span class="text-danger">*</span>
            </KLabel>
            <KSelect
              id="authStrat"
              :items="appAuthStrategies"
              :disabled="formMode === 'edit'"
              data-testid="application-auth-strategy-select"
              appearance="select"
              width="100%"
              @change="onChangeAuthStrategy"
            />
          </div>
          <div
            v-if="selectedAuthStrategy?.availableScopes"
            class="mb-5"
          >
            <KLabel
              for="availableScopes"
            >
              {{ helpText.application.availableScopes }}
            </KLabel>
            <KMultiselect
              id="availableScopes"
              v-model="selectedScopes"
              collapsed-context
              data-testid="available-scopes-select"
              class="available-scopes-select"
              :items="mappedAvailableScopes"
              :placeholder="helpText.application.filterScopesPlaceholder"
              width="100%"
              @change="handleChangedItem"
            />
          </div>
          <div
            v-if="appIsDcr || appIsSelfManaged"
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
            v-if="!appIsDcr"
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
import { v4 as uuidv4 } from 'uuid'
import { useRoute, useRouter } from 'vue-router'
import { useMachine } from '@xstate/vue'
import { createMachine } from 'xstate'
import PageTitle from '@/components/PageTitle.vue'
import CopyButton from '@/components/CopyButton.vue'
import usePortalApi from '@/hooks/usePortalApi'
import cleanupEmptyFields from '@/helpers/cleanupEmptyFields'
import useToaster from '@/composables/useToaster'
import { useI18nStore } from '@/stores'
import { CreateApplicationPayload, PortalAuthStrategy } from '@kong/sdk-portal-js'
import { fetchAll } from '@/helpers/fetchAll'

export default defineComponent({
  name: 'ApplicationForm',
  components: { PageTitle, CopyButton },

  setup () {
    function makeDefaultFormData (isDcr:boolean): CreateApplicationPayload {
      const returnObject = {
        name: '',
        description: '',
        redirect_uri: '',
        reference_id: '',
        auth_strategy_id: ''
      }
      // TODO: rem
      if (isDcr) {
        delete returnObject.reference_id
      } else {
        delete returnObject.redirect_uri
      }

      return returnObject
    }

    const helpText = useI18nStore().state.helpText
    const errorMessage = ref('')
    const clientSecret = ref('')
    const clientId = ref('')
    const applicationId = ref('')
    const applicationName = ref('')
    const secretModalIsVisible = ref(false)
    const appAuthStrategies = ref([])
    const appIsDcr = ref(false)
    const selectedAuthStrategy = ref(null)
    const selectedScopes = ref([])
    const alreadyGrantedScopes = ref([])
    const appIsSelfManaged = ref(false)
    const hasAppAuthStrategies = ref(false)
    const fetchingAuthStrategies = ref(true)

    const defaultFormData: CreateApplicationPayload = makeDefaultFormData(appIsDcr.value)
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
          error: { on: { CLICKED_SUBMIT: 'pending' } },
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
        (formMode.value !== 'edit' ? hasAppAuthStrategies.value : true) &&
        (appIsDcr.value || formData.value.reference_id?.length)
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

    onMounted(async () => {
      const promises = []
      if (id.value) {
        promises.push(fetchApplication())
      } else {
        // placeholder to make destructuring result work
        promises.push('_')
      }

      fetchingAuthStrategies.value = true
      promises.push(fetchAll(meta => portalApiV2.value.service.applicationsApi.listApplicationAuthStrategies(meta)))

      try {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const [_, rawAuthStrategies] = await Promise.all(promises)
        if (rawAuthStrategies.length) {
          hasAppAuthStrategies.value = true
          appAuthStrategies.value = rawAuthStrategies.map((strat: PortalAuthStrategy) => ({
            label: strat.name,
            value: strat.id,
            isDcr: strat.credential_type === 'client_credentials',
            isSelfManaged: strat.credential_type === 'self_managed_client_credentials',
            availableScopes: strat.credential_type === 'client_credentials' ? strat.available_scopes ? strat.available_scopes : undefined : undefined,
            selected: formData.value.auth_strategy_id ? strat.id === formData.value.auth_strategy_id : (strat.id === $route.query.auth_strategy_id || false)
          }))
        }

        const selected = rawAuthStrategies.length === 1
          ? appAuthStrategies.value[0]
          : appAuthStrategies.value.find((authStrat) => authStrat.selected === true)

        if (selected) {
          formData.value.auth_strategy_id = selected.value
          appIsDcr.value = selected.isDcr
          selectedAuthStrategy.value = selected
          appIsSelfManaged.value = selected.isSelfManaged
        }

        fetchingAuthStrategies.value = false
      } catch (err) {
        fetchingAuthStrategies.value = false
        notify({
          appearance: 'danger',
          message: `Error fetching application auth strategies: ${err}`
        })
      }
    })

    const mappedAvailableScopes = computed(() => {
      if (!selectedAuthStrategy.value.availableScopes?.length) {
        return []
      }

      return selectedAuthStrategy.value.availableScopes?.map((scope) => {
        const alreadySelected = alreadyGrantedScopes.value?.includes(scope)

        return {
          label: scope,
          value: scope,
          selected: alreadySelected
        }
      })
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

    const handleChangedItem = (item) => {
      if (!item) { return }

      const itemAdded = selectedScopes.value.includes(item.value)

      // If a new item selected, set its `selected` state to true
      item.selected = !itemAdded
    }

    const onChangeAuthStrategy = (event) => {
      const selected = appAuthStrategies.value.find((authStrat) => authStrat.value === event.value)

      selectedAuthStrategy.value = selected

      if (!selected) {
        return
      }

      formData.value.auth_strategy_id = selected.value
      appIsDcr.value = selected.isDcr
      appIsSelfManaged.value = selected.isSelfManaged
    }

    const handleSubmit = () => {
      send('CLICKED_SUBMIT')
      errorMessage.value = ''

      if (appIsDcr.value) {
        delete formData.value.reference_id
      } else {
        delete formData.value.redirect_uri
      }

      if (selectedAuthStrategy.value?.availableScopes) {
        formData.value.scopes = selectedScopes.value?.length ? selectedScopes.value : []
      } else {
        formData.value.scopes = undefined
      }

      portalApiV2.value.service.applicationsApi
        .createApplication({
          createApplicationPayload: cleanupEmptyFields(formData.value) as CreateApplicationPayload
        })
        .then((res) => {
          if (appIsDcr.value) {
            secretModalIsVisible.value = true
            applicationId.value = res.data.id
            applicationName.value = res.data.name
            clientId.value = res.data.credentials?.client_id
            clientSecret.value = res.data.credentials?.client_secret
          } else {
            handleSuccess(res.data.id, res.data.name, 'created')
          }
        })
        .catch((error) => handleError(error))
    }

    const handleUpdate = () => {
      send('CLICKED_SUBMIT')
      errorMessage.value = ''

      if (selectedAuthStrategy.value?.availableScopes) {
        formData.value.scopes = selectedScopes.value?.length ? selectedScopes.value : []
      } else {
        formData.value.scopes = undefined
      }

      delete formData.value.auth_strategy_id
      portalApiV2.value.service.applicationsApi
        .updateApplication({
          applicationId: id.value,
          updateApplicationPayload: cleanupEmptyFields(formData.value) as { name: string, [x: string]: any }
        })
        .then((res) => handleSuccess(res.data.id, res.data.name, 'updated'))
        .catch((error) => handleError(error))
    }

    const handleDelete = () => {
      errorMessage.value = ''
      portalApiV2.value.service.applicationsApi
        .deleteApplication({ applicationId: id.value })
        .then(() => handleSuccess('', '', 'deleted'))
        .catch((error) => handleError(error))
    }

    const fetchApplication = async () => {
      send('FETCH')

      return portalApiV2.value.service.applicationsApi
        .getApplication({ applicationId: id.value })
        .then((res) => {
          send('RESOLVE')

          const newFormData = {
            ...formData.value,
            name: res.data.name,
            description: res.data.description || '',
            redirect_uri: res.data.redirect_uri,
            reference_id: res.data.reference_id,
            auth_strategy_id: res.data.auth_strategy?.id
          }

          if (res.data.scopes?.length) {
            alreadyGrantedScopes.value = res.data.scopes
          }

          formData.value = newFormData
        })
        .catch((error) => handleError(error))
    }

    const handleAcknowledgeSecret = () => {
      send('CLICKED_CANCEL')
      secretModalIsVisible.value = false

      handleSuccess(applicationId.value, applicationName.value, 'created')
    }

    const getRedirectRoute = (id: string, name: string) => {
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
            application: name
          }
        }
      }

      // view application
      return { path: `/application/${id}` }
    }

    const handleSuccess = (id: string, name: string, action: string): void => {
      send('RESOLVE')
      notify({
        message: `Application successfully ${action}`
      })

      $router.push(getRedirectRoute(id, name))
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
      clientSecret,
      clientId,
      copyTokenToClipboard,
      fetchingAuthStrategies,
      secretModalIsVisible,
      handleChangedItem,
      mappedAvailableScopes,
      selectedScopes,
      handleAcknowledgeSecret,
      hasAppAuthStrategies,
      send,
      buttonText,
      formMode,
      formMethod,
      handleDelete,
      handleCancel,
      generateReferenceId,
      helpText,
      appAuthStrategies,
      selectedAuthStrategy,
      onChangeAuthStrategy,
      appIsDcr,
      appIsSelfManaged
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

.no-auth-strategies-warning {
  margin-bottom: 8px;
}
</style>
