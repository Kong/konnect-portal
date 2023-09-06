<template>
  <div
    v-if="!searchTriggered && totalCount > pageSize"
    class="card-pagination-bar flex items-center justify-end"
  >
    <span class="pagination-text type-lg color-text_colors-secondary mr-4">{{ getPaginationString() }}</span>
    <div>
      <button
        class="pagination-button"
        :class="buttonDisabled === 'pageBack' ? 'disabled' : ''"
        data-testid="pagination-first"
        @click="returnToFirstPage"
      >
        <KIcon
          height="16"
          icon="collapseExpand"
          view-box="0 0 16 16"
          width="16"
        />
      </button>
      <button
        class="pagination-button"
        :class="buttonDisabled === 'pageBack' ? 'disabled' : ''"
        data-testid="pagination-backwards"
        @click="pageBack"
      >
        <KIcon
          height="16"
          icon="back"
          view-box="0 0 16 8"
          width="16"
        />
      </button>
      <button
        class="pagination-button"
        :class="buttonDisabled === 'pageForward' ? 'disabled' : ''"
        data-testid="pagination-forwards"
        @click="pageForward"
      >
        <KIcon
          height="16"
          icon="forward"
          view-box="0 0 16 8"
          width="16"
        />
      </button>
      <button
        class="pagination-button"
        :class="buttonDisabled === 'pageForward' ? 'disabled' : ''"
        data-testid="pagination-last"
        @click="goToLastPage"
      >
        <KIcon
          class="kong-pag-last"
          height="16"
          icon="collapseExpand"
          view-box="0 0 16 16"
          width="16"
        />
      </button>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'PaginationBar',
  props: {
    totalCount: {
      type: Number,
      default: 0,
    },
    pageSize: {
      type: Number,
      default: 12,
    },
    searchTriggered: Boolean,
  },
  emits: ['pageChanged'],
  data() {
    return {
      currentPage: 1,
      buttonDisabled: 'pageBack',
    }
  },
  watch: {
    searchTriggered(newval) {
      if (newval === true) {
        this.returnToFirstPage()
      }
    },
  },
  methods: {
    getPaginationString() {
      let startCount = (this.currentPage - 1) * this.pageSize
      let endCount = startCount + this.pageSize

      startCount++

      if (endCount > this.totalCount) {
        endCount = this.totalCount
      }

      return startCount + ' - ' + endCount + ' of ' + this.totalCount
    },
    pageForward() {
      if (this.buttonDisabled === 'pageForward') {
        return
      }

      this.currentPage++
      const lastEntry = ((this.currentPage - 1) * this.pageSize) + this.pageSize
      if (lastEntry >= this.totalCount) {
        this.buttonDisabled = 'pageForward'
      } else {
        this.buttonDisabled = ''
      }

      this.$emit('pageChanged', this.currentPage)
    },
    pageBack() {
      if (this.buttonDisabled === 'pageBack') {
        return
      }

      this.currentPage--
      if (this.currentPage === 1) {
        this.buttonDisabled = 'pageBack'
      } else {
        this.buttonDisabled = ''
      }

      this.$emit('pageChanged', this.currentPage)
    },
    returnToFirstPage() {
      this.buttonDisabled = 'pageBack'
      this.currentPage = 1
      this.$emit('pageChanged', this.currentPage)
    },
    goToLastPage() {
      this.buttonDisabled = 'pageForward'
      this.currentPage = Math.ceil(this.totalCount / this.pageSize)
      this.$emit('pageChanged', this.currentPage)
    },
  },
})
</script>

<style lang="scss" scoped>
.pagination-button {
  align-items: center;
  border: 1px solid var(--section_colors-stroke);
  border-radius: 50%;
  cursor: pointer;
  display: inline-flex;
  height: 44px;
  justify-content: center;
  margin-left: 5px;
  width: 44px;
  &:focus {
    border-color: var(--button_colors-primary-fill);
    outline: none;
  }
}
</style>

<style lang="scss">
.catalog-card-view {
  .pagination-button .kong-icon path {
    fill: var(--text_colors-secondary);
    fill-opacity: unset;
  }

  .pagination-button.disabled .kong-icon path {
    fill-opacity: .5;
  }

  .kong-icon.kong-icon-collapseExpand.kong-pag-last {
    transform: rotate(180deg);
  }
}
</style>
