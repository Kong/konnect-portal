<template>
  <KPop
    ref="popRef"
    :popover-timeout="0"
    popover-classes="mt-1 action-dropdown"
    class="float-right"
    placement="bottomEnd"
    width="150"
    hide-caret
    @opened="isOpened = true"
    @closed="isOpened = false"
  >
    <slot>
      <KButton
        appearance="btn-link"
        class="action-dropdown-button"
      >
        <KBadge
          data-testid="action-badge"
          :class="[
            'cursor-pointer actions-badge',
            { opened: isOpened }
          ]"
        >
          <KIcon
            icon="gearFilled"
            color="var(--steel-300)"
            size="16"
            view-box="0 0 16 16"
          />
        </KBadge>
      </KButton>
    </slot>
    <template #content>
      <div @click="onClickContent">
        <slot name="content" />
      </div>
    </template>
  </KPop>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
export default defineComponent({
  name: 'ActionsDropdown',
  setup () {
    const isOpened = ref(false)
    const popRef = ref()

    return {
      isOpened,
      popRef,
      async onClickContent () {
        isOpened.value = false

        // hide KPop content using ref - this isn't perfect but toggling hidePopover prop back and forth
        // doesn't work in this scenario. setTimeout instead of nextTick is used to prevent KPop from reopening
        // when isOpened value change is propagated to the renderer.
        setTimeout(popRef.value.hidePopper, 0)
      }
    }
  }
})
</script>

<style lang="scss" scoped>
.actions-badge.k-badge {
  --KBadgeBorderRadius: var(--spacing-sm);
  --KBadgeWidth: auto;
  --KBadgeMinWidth: auto;
  --KBadgePaddingY: var(--spacing-xxs);
  --KBadgePaddingX: var(--spacing-sm);
  --KBadgeBackground: var(--blue-200);
  --KBadgeLighterBackground: var(--white-100);
  border: 1px solid var(--section_colors-stroke);
  height: auto;
  display: flex;
  align-items: center;
}

.action-dropdown-button {
  --KButtonOutlineBorder: var(--section_colors-stroke);
  border: none;
  padding: 0 !important;
  margin: 0;
}
</style>

<style lang="scss">
.actions-badge.k-badge:hover, .actions-badge.opened {

  .kong-icon path {
    fill: var(--steel-500);
  }
}

.action-dropdown {
  --KPopPaddingY: 0;
  --KPopPaddingX: 0;
  --KPopBorder: var(--section_colors-stroke);
  div {
    color: var(--text_colors-secondary);
    background-color: var(--section_colors-tertiary);
    &:hover {
      background-color: var(--section_colors-accent);
    }
  }
  .delete-item {
    color: var(--red-500);
  }
}
</style>
