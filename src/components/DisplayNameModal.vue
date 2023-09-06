<template>
  <KModal
    class="display-name-modal"
    data-testid="display-name-modal"
    :is-visible="isVisible"
    :title="isEditModal ? helpText.renameModal.title : helpText.creationModal.title"
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
        class="w-100 k-input--full display-name-input"
        data-testid="rename-display-name-input"
        :placeholder="helpText.renameModal.inputPlaceholder"
        type="text"
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
        class="w-100 k-input--full display-name-input"
        data-testid="display-name-input"
        :placeholder="helpText.creationModal.inputPlaceholder"
        type="text"
        @keyup.enter="submitHandler"
      />
    </template>
    <template
      v-if="isEditModal"
      #footer-content
    >
      <KButton
        appearance="primary"
        class="mr-3"
        data-testid="rename-credential-modal-button"
        :disabled="updatedDisplayName ? null : true"
        :is-rounded="false"
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
        appearance="primary"
        class="mr-3"
        data-testid="create-credential-modal-button"
        :disabled="displayName ? null : true"
        :is-rounded="false"
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
      required: true,
    },
    renameKeyRow: {
      type: Object,
      required: true,
    },
  },
  emits: ['create-new-credential', 'rename-credential', 'close-display-name-modal'],

  setup(props, { emit }) {
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
      submitHandler,
    }
  },

})
</script>

<style lang="scss" scoped>
.display-name-modal {
  --KModalHeaderColor: var(--text_colors-headings);
  --KModalColor: var(--text_colors-primary);
}
</style>
