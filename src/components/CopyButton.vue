<template>
  <div
    class="my-4"
  >
    <KTooltip
      :label="helpText.clickToCopy"
    >
      <KClipboardProvider v-slot="{ copyToClipboard }">
        <KButton
          appearance="secondary"
          :aria-label="helpText.ariaLabel"
          class="clipboard-button w-100 justify-content-between"
          data-testid="copy-button"
          :is-rounded="false"
          @click="copyTokenToClipboard(copyToClipboard)"
        >
          <span class="truncate">{{ label }} {{ textToCopy }}</span>
          <KIcon
            color="var(--steel-300)"
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
      required: true,
    },
    label: {
      type: String,
      default: '',
    },
  },
  setup(props) {
    const { notify } = useToaster()
    const helpText = useI18nStore().state.helpText.copyButton

    const copyTokenToClipboard = (executeCopy) => {
      if (!executeCopy(props.textToCopy)) {
        notify({
          appearance: 'danger',
          message: helpText.copyFailed.start + (props.textToCopy) + helpText.copyFailed.end,
        })
      }

      notify({
        message: helpText.copySucceeded.start + (props.textToCopy) + helpText.copySucceeded.end,
      })
    }

    return {
      copyTokenToClipboard,
      helpText,
    }
  },
})
</script>

<style lang="scss">
.clipboard-button {
  --KButtonFontSize: 12px;
}
</style>
