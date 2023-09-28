<template>
  <div
    class="copy-button-container"
  >
    <KTooltip
      :label="helpText.clickToCopy"
    >
      <KClipboardProvider v-slot="{ copyToClipboard }">
        <KButton
          :is-rounded="false"
          :aria-label="helpText.ariaLabel"
          class="clipboard-button"
          data-testid="copy-button"
          appearance="secondary"
          @click="copyTokenToClipboard(copyToClipboard)"
        >
          <span class="truncate-text">{{ label }} {{ textToCopy }}</span>
          <KIcon
            color="#a3b6d9"
            icon="copy"
            :title="helpText.copyToClipboard"
          />
        </KButton>
      </KClipboardProvider>
    </KTooltip>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import useToaster from '@/composables/useToaster'
import { useI18nStore } from '@/stores'

export default defineComponent({
  name: 'CopyButton',
  props: {
    textToCopy: {
      type: String,
      required: true
    },
    label: {
      type: String,
      default: ''
    }
  },
  setup (props) {
    const { notify } = useToaster()
    const helpText = useI18nStore().state.helpText.copyButton

    const copyTokenToClipboard = (executeCopy) => {
      if (!executeCopy(props.textToCopy)) {
        notify({
          appearance: 'danger',
          message: helpText.copyFailed.start + (props.textToCopy) + helpText.copyFailed.end
        })
      }

      notify({
        message: helpText.copySucceeded.start + (props.textToCopy) + helpText.copySucceeded.end
      })
    }

    return {
      copyTokenToClipboard,
      helpText
    }
  }
})
</script>

<style lang="scss" scoped>
.copy-button-container {
  margin: $kui-space-60 0;
}

.truncate-text {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>

<style lang="scss">
.clipboard-button {
  --KButtonFontSize: 12px;

  width: 100%;
  justify-content: space-between;
}
</style>
