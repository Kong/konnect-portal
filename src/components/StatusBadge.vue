<template>
  <KBadge
    data-testid="status-badge"
    v-bind="badgeAppearance"
    class="status-badge"
  >
    {{ status }}
  </KBadge>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

const STATUSES = ['approved', 'pending', 'rejected', 'revoked', 'inactive']
const APPEARANCES = {
  approved: {
    appearance: 'success',
    color: '',
    'background-color': ''
  },
  pending: {
    appearance: 'custom',
    color: 'var(--steel-600)',
    'background-color': 'var(--steel-200)'
  },
  rejected: {
    appearance: 'danger',
    color: '',
    'background-color': ''
  },
  revoked: {
    appearance: 'danger',
    color: '',
    'background-color': ''
  },
  unregistered: {
    appearance: 'custom',
    color: 'var(--black-70)',
    'background-color': 'var(--black-10)'
  }
}

export default defineComponent({
  name: 'StatusBadge',
  props: {
    status: {
      type: String,
      required: true,
      validator: (val: string) => Object.values(STATUSES).includes(val)
    }
  },

  computed: {
    badgeAppearance () {
      return APPEARANCES[this.status]
    }
  }
})
</script>

<style lang="scss" scoped>
.status-badge {
  --KBadgeBorderRadius: var(--spacing-xs);
  --KBadgePaddingY: 0.1rem;
  --KBadgePaddingX: var(--spacing-xs);
  --KBadgeFontSize: var(--type-xs);
  height: 100%;
  text-transform: uppercase;
  vertical-align: middle;
  width: auto;
}
</style>
