<template>
  <div class="label-renderer">
    <KTruncate :rows="2">
      <KBadge
        v-for="label in labels"
        :key="label.key"
        background-color="var(--section_colors-accent)"
        class="product-public-label"
        color="var(--text_colors-secondary)"
      >
        {{ label.key }}: {{ label.value }}
      </KBadge>
    </KTruncate>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed } from 'vue'
import { KTruncate } from '@kong/kongponents'

export default defineComponent({
  name: 'LabelRenderer',
  components: {
    KTruncate
  },
  props: {
    labels: {
      type: Array as () => Array<{ key: string; value: string }>,
      required: true
    }
  },
  setup (props) {
    const isExpanded = ref(false)
    const initialLabelCount = 5

    const visibleLabels = computed(() => {
      return isExpanded.value ? props.labels : props.labels.slice(0, initialLabelCount)
    })

    const hasMoreLabels = computed(() => {
      return props.labels.length > initialLabelCount
    })

    const showMoreText = computed(() => {
      if (isExpanded.value) {
        return 'Show less'
      }

      const remainingCount = props.labels.length - initialLabelCount

      return `...and ${remainingCount} more`
    })

    const toggleExpand = () => {
      isExpanded.value = !isExpanded.value
    }

    return {
      visibleLabels,
      hasMoreLabels,
      showMoreText,
      toggleExpand
    }
  }
})
</script>

<style scoped>
.label-renderer {
  padding-right: 6px; /* Add padding to account for scrollbar width */
}

/* Styles for WebKit browsers (Chrome, Safari, etc.) */
.label-renderer::-webkit-scrollbar {
  width: 6px;
  display: block; /* Always show the scrollbar */
}

.label-renderer::-webkit-scrollbar-track {
  background: transparent;
}

.label-renderer::-webkit-scrollbar-thumb {
  background-color: var(--section_colors-stroke);
  border-radius: 3px;
}

/* Ensure content doesn't overlap with scrollbar */
.label-renderer > * {
  margin-right: 6px;
}
.product-public-label {
  background-color: var(--section_colors-accent);
  color: var(--text_colors-secondary);
}

</style>
