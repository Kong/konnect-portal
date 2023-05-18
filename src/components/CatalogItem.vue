<template>
  <KCard class="show-docs">
    <template #title>
      <p
        v-if="loading"
        class="services-card-title"
      >
        <KSkeletonBox width="10" />
      </p>
      <router-link
        v-else
        :to="`/spec/${service.id}`"
      >
        <p class="services-card-title truncate">
          {{ service.title }}
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
          {{ service.description }}
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
              <span class="mr-2">Latest Version:</span>
              <KBadge
                color="var(--text_colors-secondary)"
                background-color="var(--section_colors-accent)"
                class="service-version"
              >
                {{ version }}
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
                :to="{ name: 'spec', params: { service_package: service.id } }"
                class="link"
              >
                Specification
                <KIcon
                  icon="arrowRight"
                  size="16"
                  color="var(--text_colors-link)"
                  class="link-icon"
                />
              </router-link>
            </template>
          </div>
          <div
            v-if="service.hasDocumentation"
            class="details-item"
          >
            <template v-if="loading">
              <KSkeletonBox width="50" />
            </template>
            <template v-else>
              <router-link
                :to="{ name: 'api-documentation-page', params: { service_package: service.id } }"
                class="link"
              >
                Documentation
                <KIcon
                  icon="arrowRight"
                  size="16"
                  color="var(--text_colors-link)"
                  class="link-icon"
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
import { CustomProduct } from '@/stores'
import { PropType } from 'vue'

export default {
  name: 'CatalogItem',
  props: {
    service: {
      type: Object as PropType<CustomProduct>,
      default: () => {}
    },
    loading: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {}
  },
  computed: {
    version () {
      return this.service.versions[this.service.versions.length - 1]
    },
    versionLabel () {
      return this.service.versions.length === 1 ? 'Version: ' : 'Versions: '
    }
  }
}
</script>

<style lang="scss" scoped>
  .services-card-title {
    color: var(--text_colors-accent);
    font-weight: 600;
    padding: 1.5rem 1rem;
    border-bottom: 1px solid var(--section_colors-stroke);
    width: 100%;
  }

  .description {
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 4;
    line-height: 1.4rem;
    text-overflow: ellipsis;
    max-height: 5.6rem;
    overflow: hidden;
    white-space: pre-line;
    color: var(--text_colors-primary);
  }

  .details-item {
    padding: 0.25rem 0;
  }

  .link {
    display: inline-flex;
    align-items: center;
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
      height: 19rem;
      display: flex;
      flex-direction: column;
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
      padding: 1.5rem 1rem;
      display: flex;
      flex-direction: column;
    }

    .k-card-title,
    .k-card-header {
      margin-bottom: 0 !important;
    }

    .docs-links {
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      flex-wrap: wrap;
    }
  }
</style>
