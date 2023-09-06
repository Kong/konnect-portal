<template>
  <KCard class="show-docs">
    <template #title>
      <p
        v-if="loading"
        class="products-card-title"
      >
        <KSkeletonBox width="10" />
      </p>
      <router-link
        v-else
        :to="`/spec/${product.id}`"
      >
        <p class="products-card-title truncate">
          {{ product.title }}
        </p>
      </router-link>
    </template>
    <template #body>
      <p class="description color-text_colors-secondary">
        <template
          v-if="loading"
        >
          <KSkeletonBox width="100" />
          <KSkeletonBox width="50" />
          <KSkeletonBox width="75" />
        </template>
        <template v-else>
          {{ product.description }}
        </template>
      </p>
      <ul class="mt-auto pt1">
        <li class="details-item">
          <span
            v-if="version"
            class="my-2 color-text_colors-secondary"
          >
            <template
              v-if="loading"
            >
              <KSkeletonBox width="2" />
            </template>
            <template v-else>
              <span class="mr-2">{{ helpText.latestVersion }}</span>
              <KBadge
                background-color="var(--section_colors-accent)"
                class="product-version"
                color="var(--text_colors-secondary)"
              >
                {{ version.name }}
              </KBadge>
            </template>
          </span>
        </li>
        <li class="docs-links">
          <div class="details-item">
            <template v-if="loading">
              <KSkeletonBox width="50" />
            </template>
            <template v-else>
              <router-link
                class="link"
                :to="{ name: 'spec', params: { product: product.id } }"
              >
                {{ helpText.specificationLink }}
                <KIcon
                  class="link-icon"
                  color="var(--text_colors-link)"
                  icon="arrowRight"
                  size="16"
                />
              </router-link>
            </template>
          </div>
          <div
            v-if="product.documentCount"
            class="details-item"
          >
            <template v-if="loading">
              <KSkeletonBox width="50" />
            </template>
            <template v-else>
              <router-link
                class="link"
                :to="{ name: 'api-documentation-page', params: { product: product.id } }"
              >
                {{ helpText.documentationLink }}
                <KIcon
                  class="link-icon"
                  color="var(--text_colors-link)"
                  icon="arrowRight"
                  size="16"
                />
              </router-link>
            </template>
          </div>
        </li>
      </ul>
    </template>
  </KCard>
</template>

<script lang="ts">
import { CatalogItemModel, useI18nStore } from '@/stores'
import { PropType } from 'vue'

export default {
  name: 'CatalogItem',
  props: {
    product: {
      type: Object as PropType<CatalogItemModel>,
      default: () => {},
    },
    loading: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    const helpText = useI18nStore().state.helpText.catalogItem

    return {
      helpText,
    }
  },
  computed: {
    version() {
      return this.product.latestVersion
    },
    versionLabel() {
      return this.product.versionCount === 1 ? 'Version: ' : 'Versions: '
    },
  },
}
</script>

<style lang="scss" scoped>
  .products-card-title {
    border-bottom: 1px solid var(--section_colors-stroke);
    color: var(--text_colors-accent);
    font-weight: 600;
    padding: 1.5rem 1rem;
    width: 100%;
  }

  .description {
    -webkit-box-orient: vertical;
    color: var(--text_colors-primary);
    display: -webkit-box;
    -webkit-line-clamp: 4;
    line-height: 1.4rem;
    max-height: 5.6rem;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: pre-line;
  }

  .details-item {
    padding: 0.25rem 0;
  }

  .link {
    align-items: center;
    display: inline-flex;
  }

  .link-icon {
    height: 16px;
    padding-left: 0.25rem;
  }
</style>

<style lang="scss">
  .products-content {
    --KCardPaddingY: 0;
    --KCardPaddingX: 0;
    --KCardBackground: var(--section_colors-tertiary);
    --KCardBorderRadius: 4px;
    --KCardBorder: 1px solid var(--section_colors-stroke);

    .kong-card {
      display: flex;
      flex-direction: column;
      height: 19rem;
    }

    .show-docs.kong-card {
      height: 20rem;
    }

    .k-card-title {
      width: 100%;
    }

    .k-card-content {
      flex: 1 1 auto;
    }

    .k-card-body {
      display: flex;
      flex-direction: column;
      padding: 1.5rem 1rem;
    }

    .k-card-title,
    .k-card-header {
      margin-bottom: 0 !important;
    }

    .docs-links {
      display: flex;
      flex-direction: row;
      flex-wrap: wrap;
      justify-content: space-between;
    }
  }
</style>
