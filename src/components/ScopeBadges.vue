<template>
  <div class="badge-container">
    <KBadge
      v-for="scope in showItems"
      :key="(scope as string)"
      :data-testid="`granted-${scope}`"
      class="scope-badge"
      shape="rectangular"
    >
      {{ scope }}
    </KBadge>
    <KBadge
      v-if="!showRest && hiddenItems.length"
      data-testid="show-more-scopes"
      shape="rectangular"
      @click.stop="handleShowMore"
    >
      <span>
        {{ helpText.showMoreLabel(hiddenItems.length.toString()) }}
      </span>
    </KBadge>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import { useI18nStore } from '@/stores'

export default defineComponent({
  name: 'ScopesBadge',
  props: {
    scopes: {
      type: Array,
      required: true
    }
  },
  setup (props) {
    const showRest = ref(false)
    const helpText = useI18nStore().state.helpText.productList
    const initialItems = props.scopes.slice(0, 3)
    const showItems = ref(initialItems)
    const hiddenItems = props.scopes.slice(3)
    const allItems = props.scopes

    const handleShowMore = () => {
      showRest.value = true
      showItems.value = allItems
    }

    return {
      helpText,
      initialItems,
      allItems,
      showItems,
      handleShowMore,
      hiddenItems,
      showRest
    }
  }
})
</script>

<style lang="scss" scoped>
  .badge-container {
    display: flex;
    flex-wrap: wrap;
    row-gap: 6px;

    :not(:last-child) {
      margin-right: 4px;
    }

    :deep(.k-badge) {
      background: var(--button_colors-primary-fill, var(--blue-500, #1155cb));
      border: 1px solid transparent;
      color: var(--button_colors-primary-text, #fff);
    }
  }
</style>
