<template>
  <KToggle v-slot="{toggle, isToggled}">
    <div
      class="inline nav-dropdown relative"
      :data-testid="dataTestid"
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
            class="color-text_colors-primary block py-3 px-4"
            :data-testid="item.testid"
            :to="{ name: item.routerLink }"
            @click="(e) => { toggle(e); item.onClick?.() }"
          >
            {{ item.label }}
          </router-link>
          <div
            v-else
            class="color-text_colors-primary block py-3 px-4 cursor-pointer"
            :data-testid="item.testid"
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
      required: true,
    },
    items: {
      type: Array as PropType<{
        label: string
        routerLink?: string
        onClick?: () => void
        testid?: string
      }[]>,
      required: true,
    },
    dataTestid: {
      type: String,
      required: false,
      default: '',
    },
  },
})
</script>

<style lang="scss">
.nav-dropdown {
  --KButtonLink: var(--text_colors-header);

  .apps-item {
    font-size: $kui-font-size-40;
    display: block;

    .apps-link {
      display: block;
      padding: $kui-space-50 $kui-space-60;
    }
  }

  .logout-btn {
    font-size: $kui-font-size-40;
    display: block;
    cursor: pointer;
    padding: $kui-space-50 $kui-space-60;
  }

  .k-button {
    --spacing-lg: #{$kui-space-50};
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
