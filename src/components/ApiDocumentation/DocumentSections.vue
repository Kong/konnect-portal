<template>
  <div
    v-if="items.length"
    class="wrapper"
  >
    <p>{{ helpText.onThisPage }}</p>
    <ul>
      <li
        v-for="item in items"
        :key="item.slug"
        :class="{
          active: activeHeading === item.slug,
          'mt-4':true,
          'pl-4': true,
          ['ml-'+(item.level-1)*4]: true
        }"
      >
        <a
          :href="`#${item.slug}`"
          class="noZensmooth"
          @click="handleClick"
        >
          {{ item.title }}
        </a>
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import { useI18nStore } from '@/stores'
import { PropType, defineComponent, ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
type ItemType = {
    level: number;
    slug: string;
    title: string;
}[]

export default defineComponent({
  name: 'DocumentSections',
  props: {
    items: {
      type: Array as PropType<ItemType>,
      required: true
    }
  },
  setup () {
    const helpText = useI18nStore().state.helpText.apiDocumentation.sections
    const route = useRoute()
    const router = useRouter()
    // get the initial value from the route, but subsequent changes will be handled by the click handler
    const activeHeading = ref(route.hash.slice(1))

    // this click handler updates the active styling of the header in the sidebar
    function handleClick (e) {
      if (e.target instanceof HTMLAnchorElement) {
        e.preventDefault()
        const targetHash = `#${e.target.href.split('#')[1]}`

        router.replace({ path: route.path, hash: targetHash })
        const element = document.querySelector(targetHash)

        if (element) {
          element.scrollIntoView({ behavior: 'smooth' })
        }

        activeHeading.value = e.target.href.split('#')[1]
      }
    }

    onMounted(() => {
      const initialHash = route.hash

      if (initialHash) {
        const element = document.querySelector(initialHash)

        if (element) {
          element.scrollIntoView({ behavior: 'smooth' })
        }
      }
    })

    return {
      helpText,
      activeHeading,
      handleClick
    }
  }
})
</script>

<style lang="scss" scoped>
  .wrapper {
    position: sticky;
    top: 0;
    max-height: calc(100vh - var(--headerHeight));
    padding: 2rem 0;
    overflow-x: auto;
  }

  p {
    color: var(--text_colors-accent, #6f7787);
    font-size: 0.75rem;
    margin: 0 0 0.75rem;
  }

  ul {
    margin: 0;
    padding: 0;
    padding-right: 2rem;
    list-style: none;
  }

  li {
    font-size: 0.875rem;
    margin: 0.25rem 0;
    position: relative;
    border-left: 2px solid rgba(0,0,0,0);
  }

  li.active {
    border-left: 2px solid var(--text_colors-accent, #6f7787);
    font-weight: 500;
  }

  li.active a,
  a:hover {
    color: var(--text_colors-accent, #6f7787);
  }

  a {
    color: var(--text_colors-secondary, #4d4d4d);
  }
</style>
