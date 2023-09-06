<template>
  <div class="view-spec-modal">
    <KModal
      :is-visible="isVisible"
      :title="helpText.viewSpec"
      @canceled="closeModal"
    >
      <template #header-content>
        <span class="color-text_colors-primary">{{ helpText.viewSpec }}</span>
      </template>
      <template #body-content>
        <span>
          <code>
            <!--
              eslint-disable vue/no-mutating-props
              specContents is from props and not to be changed. The no-mutating-props
              rule does not take into account that even though textarea is an editable element,
              ours is disabled meaning no mutation
            -->
            <textarea
              id="spec-area"
              disabled
              :value="specContents"
            />
          </code>
        </span>
      </template>
      <template #footer-content>
        <KClipboardProvider v-slot="{ copyToClipboard }">
          <KButton
            appearance="primary"
            class="copy"
            data-testid="copy-btn"
            :is-rounded="false"
            @click="copySpec(copyToClipboard)"
          >
            {{ helpText.copy }}
          </KButton>
        </KClipboardProvider>
        <KButton
          appearance="secondary"
          class="ml-2"
          data-testid="download-btn"
          :is-rounded="false"
          type="submit"
          @click="downloadCallback"
        >
          {{ helpText.download }}
        </KButton>
        <KButton
          appearance="secondary"
          class="close"
          data-testid="close-btn"
          :is-rounded="false"
          style="margin-left: auto;"
          @click="closeModal"
        >
          {{ helpText.close }}
        </KButton>
      </template>
    </KModal>
  </div>
</template>

<script setup lang="ts">
import { PropType, defineEmits } from 'vue'
import useToaster from '@/composables/useToaster'
import { useI18nStore } from '@/stores'

const helpText = useI18nStore().state.helpText.viewSpecModal

const props = defineProps({
  specName: {
    type: String,
    default: '',
  },
  specContents: {
    type: String,
    default: '',
  },
  isVisible: {
    type: Boolean,
    default: false,
  },
  downloadCallback: {
    type: Function as PropType<() => void>,
    required: true,
  },
})

const emit = defineEmits(['close'])

const { notify } = useToaster()

const closeModal = () => {
  emit('close')
}

const copySpec = (executeCopy) => {
  if (!executeCopy(props.specContents)) {
    notify({
      appearance: 'danger',
      message: helpText.copyError,
    })
  }

  notify({
    message: helpText.copySuccess,
  })
}
</script>

<style lang="scss" scoped>
#spec-area {
  background-color: var(--section_colors-tertiary);
  color: var(--text_colors-primary);
  font-family: var(--font-family-mono);
  font-size: var(--type-xs);
  height: 300px;
  margin: 0;
  overflow: scroll;
  padding: var(--spacing-md);
  white-space: pre;
  width: 100%;
}
</style>
