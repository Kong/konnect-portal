<template>
  <KToggle v-slot="{toggle, isToggled}">
    <div
      class="inline user-dropdown relative"
      data-testid="user-dropdown"
    >
      <div
        v-if="isToggled.value"
        class="fixed inset-0 opacity-0"
        @click="toggle"
      />
      <KButton
        appearance="btn-link"
        :is-rounded="false"
        show-caret
        @click="toggle"
      >
        {{ email }}
      </KButton>
      <ul
        v-if="isToggled.value"
        class="list-none m-0 p-0 absolute w-40 shadow bg-white"
      >
        <li
          class="type-md block"
          data-testid="my-apps-item"
        >
          <router-link
            class="color-text_colors-primary block py-3 px-4"
            :to="{ name: 'my-apps' }"
            @click="toggle"
          >
            {{ helpText.myApps }}
          </router-link>
        </li>
        <li
          class="py-3 px-4 type-md cursor-pointer logout-btn block color-text_colors-primary"
          data-testid="logout-item"
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
      required: true,
    },
  },
  emits: ['logout'],
  data: () => ({
    helpText: useI18nStore().state.helpText.userDropdown,
  }),
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
    backdrop-filter: brightness(1.35);
    box-shadow: none !important;
    text-decoration: none !important;
  }

  ul {
    background-color: var(--section_colors-tertiary);
    border: 1px solid var(--section_colors-stroke);
    border-radius: 3px;
    left: 50%;
    transform: translateX(-50%);
    li {
      &:last-child { border-top: 1px solid var(--section_colors-stroke); }
      &:hover { background-color: var(--section_colors-accent); }
    }
  }

}
</style>
