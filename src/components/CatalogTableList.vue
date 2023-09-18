<template>
  <div class="max-w-screen-2xl mx-auto">
    <KTable
      :fetcher="fetcher"
      :fetcher-cache-key="fetcherCacheKey"
      has-side-border
      :headers="tableHeaders"
      is-small
      :is-loading="loading"
      is-clickable
      disable-pagination
      @row:click="handleRowClick"
    >
      <template #title="{ rowValue }">
        {{ rowValue }}
      </template>
      <template #latestVersion="{ row }">
        <div>
          <KBadge
            v-if="row.latestVersion"
            color="var(--text_colors-secondary)"
            background-color="var(--section_colors-accent)"
            class="product-version"
          >
            {{ row.latestVersion.name }}
          </KBadge>
        </div>
      </template>
      <template #links="{ row }">
        <router-link
          v-if="row.showSpecLink"
          :to="{ name: 'spec', params: { product: row.id } }"
          class="link"
        >
          {{ helpText.specificationLink }}
        </router-link>
        <router-link
          v-if="row.documentCount"
          :to="{ name: 'api-documentation-page', params: { product: row.id } }"
          class="link"
        >
          {{ helpText.documentationLink }}
        </router-link>
      </template>
    </KTable>
  </div>
</template>

<script lang="ts">
import { useI18nStore, CatalogItemModel } from '@/stores'
import { defineComponent, ref, computed, watch, PropType } from 'vue'
import { useRouter } from 'vue-router'

export default defineComponent({
  name: 'CatalogTableList',
  props: {
    products: {
      type: Array as PropType<CatalogItemModel[]>,
      default: () => []
    },
    loading: {
      type: Boolean,
      default: false
    }
  },
  setup (props) {
    const $router = useRouter()
    const helpText = useI18nStore().state.helpText.catalogTable
    const key = ref(0)
    const fetcherCacheKey = computed(() => key.value.toString())
    const revalidate = () => {
      key.value += 1
    }

    function handleRowClick (e, row) {
      $router.push({ path: `/spec/${row.id}` })
    }

    function fetcher () {
      return {
        total: props.products.length,
        data: props.products
      }
    }

    watch(() => props.products, () => {
      revalidate()
    }, { deep: true })

    return {
      handleRowClick,
      fetcher,
      fetcherCacheKey,
      helpText
    }
  },
  data () {
    return {
      tableHeaders: [
        { label: 'Title', key: 'title' },
        { label: 'Description', key: 'description' },
        { label: 'Latest Version', key: 'latestVersion' },
        { label: 'Details', key: 'links' }
      ]
    }
  }
})
</script>

<style lang="scss">
.products-content {
  .k-table {
    max-height: 600px;
    overflow: auto;

    thead th {
      color: var(--text_colors-secondary);
    }

    tbody {
      td {
        color: var(--text_colors-secondary);

        &:nth-of-type(1) {
          min-width: 120px;
          color: var(--text_colors-headings);
        }

        &:nth-of-type(2) {
          width: auto;
          max-width: 65ch;
          white-space: normal;
        }
      }
    }
  }
}
</style>
<style lang="scss" scoped>
.link {
  display: inline-block;
  margin: 0 0.25rem;
  color: var(--text_colors-link) !important;

  &:first-child {
    margin-left: 0;
  }

  &:last-child {
    margin-right: 0;
  }
}
</style>
