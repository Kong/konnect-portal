<template>
  <KToggle v-slot="{toggle, isToggled}">
    <div
      data-testid="user-dropdown"
      class="inline user-dropdown relative"
    >
      <div
        v-if="isToggled.value"
        class="fixed inset-0 opacity-0"
        @click="toggle"
      />
      <KButton
        show-caret
        :is-rounded="false"
        appearance="btn-link"
        @click="toggle"
      >
        {{ email }}
      </KButton>
      <ul
        v-if="isToggled.value"
        class="list-none m-0 p-0 absolute w-40 shadow bg-white"
      >
        <li
          data-testid="my-apps-item"
          class="type-md block"
        >
          <router-link
            :to="{ name: 'my-apps' }"
            class="color-text_colors-primary block py-3 px-4"
            @click="toggle"
          >
            {{ helpText.myApps }}
          </router-link>
        </li>
        <li
          data-testid="logout-item"
          class="py-3 px-4 type-md cursor-pointer logout-btn block color-text_colors-primary"
          @click="$emit('logout')"
        >
          {{ helpText.logout }}
        </li>
      </ul>
    </div>
  </KToggle>
</template>

<script lang="ts">
import { useI18nStore } from '@/stores'
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'UserDropdown',
  props: {
    email: {
      type: String,
      required: true
    }
  },
  emits: ['logout'],
  data: () => ({
    helpText: useI18nStore().state.helpText.userDropdown
  })
})
</script>

<style lang="scss">
.user-dropdown {
  --KButtonLink: var(--text_colors-header);

  .k-button {
    --spacing-lg: var(--spacing-sm);
    // this is to fix the alignment of the text
    line-height: 24px !important;
  }

  .k-button:focus,
  .k-button:hover,
  .k-button.is-active {
    text-decoration: none !important;
    box-shadow: none !important;
    backdrop-filter: brightness(1.35);
  }

  ul {
    border: 1px solid var(--section_colors-stroke);
    border-radius: 3px;
    left: 50%;
    transform: translateX(-50%);
    background-color: var(--section_colors-tertiary);
    li {
      &:last-child { border-top: 1px solid var(--section_colors-stroke); }
      &:hover { background-color: var(--section_colors-accent); }
    }
  }

}
</style>
