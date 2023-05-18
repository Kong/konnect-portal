<template>
  <div
    class="my-4"
  >
    <KTooltip
      :label="helpText.clickToCopy"
    >
      <KClipboardProvider v-slot="{ copyToClipboard }">
        <KButton
          :is-rounded="false"
          aria-label="Copy button content to clipboard"
          class="clipboard-button w-100 justify-content-between"
          data-testid="copy-button"
          appearance="secondary"
          @click="copyTokenToClipboard(copyToClipboard)"
        >
          <span>{{ label }} {{ textToCopy }}</span>
          <KIcon
            :title="helpText.copyToClipboard"
            icon="copy"
            color="var(--steel-300)"
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
          message: helpText.failedToCopy(props.textToCopy)
        })
      }

      notify({
        message: helpText.copiedToClipboard(props.textToCopy)
      })
    }

    return {
      copyTokenToClipboard,
      helpText
    }
  }
})
</script>

<style lang="scss">
.clipboard-button {
  --KButtonFontSize: 12px;
}
</style>
