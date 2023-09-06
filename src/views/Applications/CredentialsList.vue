<template>
  <div class="credentials-list">
    <PageTitle class="mb-5">
      <h2 class="font-normal type-lg m-0">
        {{ helpText.title }}
      </h2>
      <template #right>
        <KButton
          data-testid="generate-credential-button"
          :is-rounded="false"
          appearance="secondary"
          @click="handleCreateCredential"
        >
          + {{ helpText.newButtonText }}
        </KButton>
      </template>
    </PageTitle>

    <KCard>
      <template #body>
        <KTable
          :is-loading="currentState.matches('pending')"
          data-testid="credentials-list"
          :fetcher-cache-key="fetcherCacheKey"
          :fetcher="fetcher"
          has-side-border
          is-small
          :headers="tableHeaders"
          :pagination-page-sizes="ktablePaginationConfig.paginationPageSizes"
          :initial-fetcher-params="{ pageSize: ktablePaginationConfig.initialPageSize }"
        >
          <template #id="{ row }">
            <CopyUuid
              class="flex"
              :icon-color="'var(--text_colors-primary)'"
              :uuid="row.id"
              :truncated="false"
            />
          </template>
          <template #actions="{ row }">
            <ActionsDropdown>
              <template #content>
                <div
                  class="py-2 px-3 type-md cursor-pointer rename-item"
                  @click="handleRenameCredentialModal(row)"
                >
                  {{ helpText.renameModal.actionLabel }}
                </div>
                <div
                  class="py-2 px-3 type-md cursor-pointer delete-item"
                  @click="handleDeleteCredentialModal(row)"
                >
                  {{ helpText.revokeModal.revokeButton }}
                </div>
              </template>
            </ActionsDropdown>
          </template>

          <template #empty-state>
            <EmptyState
              :title="helpText.noCredentialsText"
            />
          </template>
        </KTable>
      </template>
    </KCard>
    <KModal
      :is-visible="deleteCredentialModalVisible"
      :title="helpText.revokeModal.title"
      data-testid="revoke-credential-modal"
      class="revoke-credential-modal"
      @canceled="handleCloseDeleteCredentialModal"
    >
      <template #body-content>
        <p class="copy-text">
          {{ helpText.revokeModal.description.start + (deletedKeyRow?.display_name ? deletedKeyRow?.display_name : deletedKeyRow?.id) + helpText.revokeModal.description.end }}
        </p>
      </template>
      <template #footer-content>
        <KButton
          :is-rounded="false"
          appearance="danger"
          class="mr-3"
          data-testid="revoke-credential-modal-button"
          @click="handleDeleteCredentialSubmit"
        >
          {{ helpText.revokeModal.revokeButton }}
        </KButton>
        <KButton
          appearance="secondary"
          :is-rounded="false"
          data-testid="revoke-credential-close-modal-button"
          @click="handleCloseDeleteCredentialModal"
        >
          {{ helpText.revokeModal.cancelButton }}
        </KButton>
      </template>
    </KModal>
    <DisplayNameModal
      :is-visible="displayNameModalVisible"
      :rename-key-row="renameKeyRow"
      @rename-credential="handleRenameCredentialSubmit"
      @create-new-credential="handleCredentialSubmit"
      @close-display-name-modal="handleCloseDisplayNameModal"
    />
    <KModal
      :is-visible="copyCredentialModalVisible"
      :title="helpText.copyModal.title"
      data-testid="copy-new-credential-modal"
      class="copy-credential-modal"
      @canceled="handleCloseCopyCredentialModal"
    >
      <template #header-content>
        {{ helpText.copyModal.title }}
      </template>
      <template #body-content>
        <p class="copy-text mb-5">
          {{ helpText.copyModal.hiddenCredentialsText }}
        </p>

        <p class="copy-text copy-label">
          <span>{{ copySubheading + copyCredentialDisplayName }}</span>
        </p>

        <CopyButton
          class="copy-clipboard-button"
          :text-to-copy="credentialKey"
        />
      </template>
      <template #footer-content>
        <KClipboardProvider v-slot="{ copyToClipboard }">
          <KButton
            :is-rounded="false"
            appearance="primary"
            class="mr-3"
            data-testid="copy-credentials-confirm-modal-button"
            @click="copyTokenToClipboard(copyToClipboard)"
          >
            {{ helpText.copyModal.continueButton }}
          </KButton>
        </KClipboardProvider>
        <KButton
          :is-rounded="false"
          appearance="secondary"
          data-testid="copy-credentials-close-modal-button"
          @click="handleCloseCopyCredentialModal"
        >
          {{ helpText.copyModal.cancelButton }}
        </KButton>
      </template>
    </KModal>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed, ref } from 'vue'
import useToaster from '@/composables/useToaster'
import { useMachine } from '@xstate/vue'
import { createMachine } from 'xstate'
import getMessageFromError from '@/helpers/getMessageFromError'

import { useI18nStore } from '@/stores'
import usePortalApi from '@/hooks/usePortalApi'
import PageTitle from '@/components/PageTitle.vue'
import ActionsDropdown from '@/components/ActionsDropdown.vue'
import DisplayNameModal from '@/components/DisplayNameModal.vue'
import CopyButton from '@/components/CopyButton.vue'
import { ListCredentialsResponseDataInner } from '@kong/sdk-portal-js'

export default defineComponent({
  name: 'CredentialsList',
  components: { PageTitle, ActionsDropdown, CopyButton, DisplayNameModal },
  props: {
    id: {
      type: String,
      required: true
    }
  },

  setup (props) {
    const { notify } = useToaster()
    const helpText = useI18nStore().state.helpText.credentials

    const tableHeaders = [
      { label: 'Name', key: 'display_name' },
      { label: 'ID', key: 'id' },
      { key: 'actions', hideLabel: true }
    ]

    const copyCredentialModalVisible = ref(false)
    const displayNameModalVisible = ref(false)
    const deleteCredentialModalVisible = ref(false)
    const updatedDisplayName = ref('')
    const credentialKey = ref('')
    const copyCredentialDisplayName = ref('')
    const renameKeyRow = ref<ListCredentialsResponseDataInner | null>(null)
    const deletedKeyRow = ref<ListCredentialsResponseDataInner | null>(null)

    const ktablePaginationConfig = ref({
      paginationPageSizes: [25, 50, 100],
      initialPageSize: 25
    })

    const { portalApiV2 } = usePortalApi()

    const { state: currentState, send } = useMachine(
      createMachine({
        predictableActionArguments: true,
        id: 'CredentialsMachine',
        initial: 'idle',
        states: {
          idle: { on: { FETCH: 'pending' } },
          pending: { on: { RESOLVE: 'success' } },
          success: { on: { FETCH: 'pending' } }
        }
      })
    )

    const key = ref(0)
    const fetcherCacheKey = computed(() => key.value.toString())

    const revalidate = () => {
      key.value += 1
    }

    const fetcher = async (payload: { pageSize: number; page: number }) => {
      const { pageSize, page: pageNumber } = payload
      const apiOptions = { applicationId: props.id, pageNumber, pageSize }

      send('FETCH')

      return portalApiV2.value.service.credentialsApi.listCredentials(apiOptions).then((res) => {
        send('RESOLVE')

        return {
          data: res.data.data,
          total: res.data.meta.page.total
        }
      }).catch((e) => {
        return handleError(e)
      })
    }
    const handleCreateCredential = () => {
      displayNameModalVisible.value = true
    }

    const handleCredentialSubmit = (displayName: { value: string }) => {
      if (!displayName.value) {
        displayNameModalVisible.value = false

        return
      }

      portalApiV2.value.service.credentialsApi.createCredential({
        applicationId: props.id,
        createCredentialPayload: {
          display_name: displayName.value
        }
      })
        .then((res) => {
          displayNameModalVisible.value = false
          copyCredentialModalVisible.value = true
          copyCredentialDisplayName.value = res.data?.display_name ? res.data.display_name : res.data?.id
          credentialKey.value = res.data?.credential
          displayName.value = ''
          handleSuccess('created')
          revalidate()
        })
        .catch(error => {
          displayName.value = ''
          handleError(error)
        })
    }

    const handleRenameCredentialSubmit = (updatedDisplayName: { value: string }) => {
      if (!updatedDisplayName.value || updatedDisplayName.value === renameKeyRow.value?.display_name) {
        displayNameModalVisible.value = false
        renameKeyRow.value = null
        updatedDisplayName.value = ''

        return
      }

      portalApiV2.value.service.credentialsApi.updateCredential({
        applicationId: props.id,
        credentialId: renameKeyRow.value?.id,
        updateCredentialPayload: {
          display_name: updatedDisplayName.value
        }
      })
        .then(() => {
          displayNameModalVisible.value = false
          renameKeyRow.value = null
          handleSuccess('updated', updatedDisplayName.value)
          updatedDisplayName.value = ''
          revalidate()
        })
        .catch((error) => {
          handleError(error)
        })
    }

    const handleDeleteCredentialSubmit = () => {
      portalApiV2.value.service.credentialsApi.deleteCredential({
        applicationId: props.id,
        credentialId: deletedKeyRow.value?.id
      })
        .then(() => {
          handleSuccess('revoked')
          deletedKeyRow.value = null
          deleteCredentialModalVisible.value = false
          revalidate()
        })
        .catch(error => {
          handleError(error)
        })
    }

    const handleCloseDisplayNameModal = () => {
      displayNameModalVisible.value = false
      renameKeyRow.value = null
    }

    const handleCloseCopyCredentialModal = () => {
      copyCredentialModalVisible.value = false
      credentialKey.value = ''
      copyCredentialDisplayName.value = ''
    }

    const handleCloseDeleteCredentialModal = () => {
      deleteCredentialModalVisible.value = false
      deletedKeyRow.value = null
    }

    const handleDeleteCredentialModal = (keyRowValue: { id: string; display_name: string }) => {
      deleteCredentialModalVisible.value = true
      deletedKeyRow.value = keyRowValue
    }

    const handleRenameCredentialModal = (keyRowValue: { id: string; display_name: string }) => {
      displayNameModalVisible.value = true
      renameKeyRow.value = keyRowValue
    }

    const copyTokenToClipboard = (executeCopy: (arg0: string) => any) => {
      if (!executeCopy(credentialKey.value)) {
        notify({
          appearance: 'danger',
          message: `Failed to copy key: "${credentialKey.value}" to clipboard`
        })
      }

      notify({
        message: `Key "${credentialKey.value}" copied to clipboard`
      })

      copyCredentialModalVisible.value = false
      credentialKey.value = ''
    }

    const handleSuccess = (action: string, name = null) => {
      if (name) {
        notify({
          message: `Credential "${name}" successfully ${action}`
        })
      } else {
        notify({
          message: `Credential successfully ${action}`
        })
      }
    }

    const handleError = (error: any) => {
      notify({
        appearance: 'danger',
        message: getMessageFromError(error)
      })
      displayNameModalVisible.value = false
    }

    const copySubheading = ''

    return {
      copySubheading,
      helpText,
      tableHeaders,
      currentState,
      credentialKey,
      deletedKeyRow,
      renameKeyRow,
      updatedDisplayName,
      copyCredentialDisplayName,
      copyTokenToClipboard,
      handleCloseCopyCredentialModal,
      handleCloseDisplayNameModal,
      handleCloseDeleteCredentialModal,
      handleDeleteCredentialModal,
      handleRenameCredentialModal,
      handleRenameCredentialSubmit,
      displayNameModalVisible,
      deleteCredentialModalVisible,
      copyCredentialModalVisible,
      handleCredentialSubmit,
      handleCreateCredential,
      handleDeleteCredentialSubmit,
      fetcherCacheKey,
      fetcher,
      ktablePaginationConfig
    }
  }

})
</script>

<style lang="scss">
  .display-name-modal, .copy-credential-modal, .revoke-credential-modal {
    .k-modal-content {
      .k-modal-header {
        margin-left: unset;
        margin-right: unset;
      }
    }

    .k-modal-footer {
      &.modal-footer {
        justify-content: flex-end;
      }
    }

    .k-input-label {
      display: block;
      text-align: left;
      font-size: var(--type-md, 16px);
    }

    .display-name-input {
      .k-input {
        font-size: var(--type-md, 16px);
      }
    }
  }

  .copy-credential-modal {
    .copy-clipboard-button {
      margin-top: 0.5rem !important;

      .clipboard-button {
        padding: 10px 16px;
        padding-right: 8px;
        font-size: var(--type-md, 16px);
      }
    }
  }
</style>

<style lang="scss" scoped>
  .revoke-credential-modal, .copy-credential-modal {
    --KModalHeaderColor: var(--text_colors-headings);
    --KModalColor: var(--text_colors-primary);
    .copy-text {
      text-align: left;
      font-size: var(--type-md, 16px);

      &.copy-label {
        font-weight: 500;
      }
    }
  }

  .credentials-list {
    :deep(.kong-ui-copy-uuid) {
      align-items: center;

      .uuid-icon-wrapper {
        height: 16px;
      }
    }
  }
</style>
