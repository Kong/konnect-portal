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
    color: '#395380',
    'background-color': '#dae3f2'
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
  --KBadgeBorderRadius: #{$kui-space-40};
  --KBadgePaddingY: #{$kui-space-10};
  --KBadgePaddingX: #{$kui-space-40};
  --KBadgeFontSize: #{$kui-font-size-20};
  width: auto;
  height: 100%;
  vertical-align: middle;
  text-transform: uppercase;
}
</style>
