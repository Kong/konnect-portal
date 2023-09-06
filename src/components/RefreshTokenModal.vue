<template>
  <KModal
    class="refresh-secret-modal"
    data-testid="application-secret-token-modal"
    :is-visible="isVisible"
    :title="helpText.title"
    @canceled="$emit('closed')"
  >
    <template #header-content>
      {{ helpText.title }}
    </template>
    <template #body-content>
      {{ helpText.description1 }}<strong>{{ helpText.description2 }}</strong>{{ helpText.description3 }}
      <CopyButton
        :label="helpText.secret"
        :text-to-copy="token"
      />
    </template>
    <template #footer-content>
      <KButton
        appearance="primary"
        data-testid="close-btn"
        :is-rounded="false"
        @click="$emit('closed')"
      >
        {{ helpText.proceed }}
      </KButton>
    </template>
  </KModal>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { useI18nStore } from '@/stores'
import CopyButton from '@/components/CopyButton.vue'

export default defineComponent({
  name: 'RefreshTokenModal',
  components: { CopyButton },
  props: {
    isVisible: {
      type: Boolean,
      required: true,
    },
    token: {
      type: String,
      default: '',
    },
  },

  emits: ['closed'],

  setup() {
    const helpText = useI18nStore().state.helpText.refreshTokenModal

    return {
      helpText,
    }
  },

})
</script>

<style lang="scss">
.client-secret-table {
  table tbody td:last-of-type {
    text-align: right !important;
  }
}
</style>
