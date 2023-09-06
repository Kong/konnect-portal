<template>
  <KModal
    :is-visible="isVisible"
    :title="isEditModal ? helpText.renameModal.title : helpText.creationModal.title"
    data-testid="display-name-modal"
    class="display-name-modal"
    @canceled="handleCloseModal"
  >
    <template #header-content>
      {{ isEditModal ? `${helpText.renameModal.title} - ${renameKeyRow.display_name}` : helpText.creationModal.title }}
    </template>
    <template
      v-if="isEditModal"
      #body-content
    >
      <KLabel for="updatedDisplayName">
        {{ helpText.renameModal.inputLabel }}
      </KLabel>
      <KInput
        id="updatedDisplayName"
        v-model="updatedDisplayName"
        :placeholder="helpText.renameModal.inputPlaceholder"
        data-testid="rename-display-name-input"
        type="text"
        class="w-100 k-input--full display-name-input"
        @keyup.enter="submitHandler"
      />
    </template>
    <template
      v-else
      #body-content
    >
      <KLabel for="displayName">
        {{ helpText.creationModal.inputLabel }}
      </KLabel>
      <KInput
        id="displayName"
        v-model="displayName"
        :placeholder="helpText.creationModal.inputPlaceholder"
        data-testid="display-name-input"
        type="text"
        class="w-100 k-input--full display-name-input"
        @keyup.enter="submitHandler"
      />
    </template>
    <template
      v-if="isEditModal"
      #footer-content
    >
      <KButton
        :is-rounded="false"
        :disabled="updatedDisplayName ? null : true"
        appearance="primary"
        class="mr-3"
        data-testid="rename-credential-modal-button"
        @click="submitHandler"
      >
        {{ helpText.renameModal.continueButton }}
      </KButton>
      <KButton
        appearance="secondary"
        :is-rounded="false"
        @click="handleCloseModal"
      >
        {{ helpText.renameModal.cancelButton }}
      </KButton>
    </template>
    <template
      v-else
      #footer-content
    >
      <KButton
        :is-rounded="false"
        :disabled="displayName ? null : true"
        appearance="primary"
        class="mr-3"
        data-testid="create-credential-modal-button"
        @click="submitHandler"
      >
        {{ helpText.creationModal.continueButton }}
      </KButton>
      <KButton
        appearance="secondary"
        :is-rounded="false"
        @click="handleCloseModal"
      >
        {{ helpText.creationModal.cancelButton }}
      </KButton>
    </template>
  </KModal>
</template>

<script lang="ts">
import { defineComponent, computed, ref } from 'vue'
import { useI18nStore } from '@/stores'

export default defineComponent({
  name: 'DisplayNameModal',
  props: {
    isVisible: {
      type: Boolean,
      required: true
    },
    renameKeyRow: {
      type: Object,
      required: true
    }
  },
  emits: ['create-new-credential', 'rename-credential', 'close-display-name-modal'],

  setup (props, { emit }) {
    const helpText = useI18nStore().state.helpText.credentials
    const isEditModal = computed(() => props.renameKeyRow?.id)
    const displayName = ref('')
    const updatedDisplayName = ref('')

    const handleCloseModal = () => {
      displayName.value = ''
      updatedDisplayName.value = ''

      emit('close-display-name-modal')
    }

    const submitHandler = () => {
      if (displayName.value) {
        emit('create-new-credential', displayName)
      } else if (updatedDisplayName.value) {
        emit('rename-credential', updatedDisplayName)
      }
    }

    return {
      helpText,
      displayName,
      isEditModal,
      updatedDisplayName,
      handleCloseModal,
      submitHandler
    }
  }

})
</script>

<style lang="scss" scoped>
.display-name-modal {
  --KModalHeaderColor: var(--text_colors-headings);
  --KModalColor: var(--text_colors-primary);
}
</style>
