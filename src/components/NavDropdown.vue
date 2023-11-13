<template>
  <KToggle v-slot="{toggle, isToggled}">
    <div
      :data-testid="dataTestid"
      class="inline nav-dropdown relative"
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
        {{ label }}
      </KButton>
      <ul
        v-if="isToggled.value"
        class="list-none m-0 p-0 absolute w-40 shadow bg-white"
      >
        <li
          v-for="item of items"
          :key="item.label"
          class="type-md block"
        >
          <router-link
            v-if="item.routerLink"
            :data-testid="item.testid"
            :to="{ name: item.routerLink }"
            class="color-text_colors-primary block py-3 px-4"
            @click="(e) => { toggle(e); item.onClick?.() }"
          >
            {{ item.label }}
          </router-link>
          <div
            v-else
            :data-testid="item.testid"
            class="color-text_colors-primary block py-3 px-4 cursor-pointer"
            @click="(e) => { toggle(e); item.onClick?.() }"
          >
            {{ item.label }}
          </div>
        </li>
      </ul>
    </div>
  </KToggle>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'

export default defineComponent({
  name: 'NavDropdown',
  props: {
    label: {
      type: String,
      required: true
    },
    items: {
      type: Array as PropType<{
        label: string
        routerLink?: string
        onClick?: () => void
        testid?: string
      }[]>,
      required: true
    },
    dataTestid: {
      type: String,
      required: false,
      default: ''
    }
  }
})
</script>

<style lang="scss">
.nav-dropdown {
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
    border-top-left-radius: 0;
    border-top-right-radius: 0;
    left: 50%;
    transform: translateX(-50%);
    top: 41px;
    background-color: var(--section_colors-tertiary);
    li {
      &:last-child { border-top: 1px solid var(--section_colors-stroke); }
      &:hover { background-color: var(--section_colors-accent); }
    }
  }

}
</style>
