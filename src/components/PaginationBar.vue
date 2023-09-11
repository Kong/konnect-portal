<template>
  <div
    v-if="!searchTriggered && totalCount > pageSize"
    class="card-pagination-bar flex items-center justify-end"
  >
    <span class="pagination-text type-lg color-text_colors-secondary mr-4">{{ getPaginationString() }}</span>
    <div>
      <button
        class="pagination-button"
        data-testid="pagination-first"
        :class="buttonDisabled === 'pageBack' ? 'disabled' : ''"
        @click="returnToFirstPage"
      >
        <KIcon
          width="16"
          height="16"
          view-box="0 0 16 16"
          icon="collapseExpand"
        />
      </button>
      <button
        class="pagination-button"
        data-testid="pagination-backwards"
        :class="buttonDisabled === 'pageBack' ? 'disabled' : ''"
        @click="pageBack"
      >
        <KIcon
          width="16"
          height="16"
          view-box="0 0 16 8"
          icon="back"
        />
      </button>
      <button
        class="pagination-button"
        data-testid="pagination-forwards"
        :class="buttonDisabled === 'pageForward' ? 'disabled' : ''"
        @click="pageForward"
      >
        <KIcon
          width="16"
          height="16"
          view-box="0 0 16 8"
          icon="forward"
        />
      </button>
      <button
        class="pagination-button"
        data-testid="pagination-last"
        :class="buttonDisabled === 'pageForward' ? 'disabled' : ''"
        @click="goToLastPage"
      >
        <KIcon
          icon="collapseExpand"
          class="kong-pag-last"
          width="16"
          height="16"
          view-box="0 0 16 16"
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
      default: 0
    },
    pageSize: {
      type: Number,
      default: 12
    },
    searchTriggered: Boolean
  },
  emits: ['pageChanged'],
  data () {
    return {
      currentPage: 1,
      buttonDisabled: 'pageBack'
    }
  },
  watch: {
    searchTriggered (newval) {
      if (newval === true) {
        this.returnToFirstPage()
      }
    }
  },
  methods: {
    getPaginationString () {
      let startCount = (this.currentPage - 1) * this.pageSize
      let endCount = startCount + this.pageSize

      startCount++

      if (endCount > this.totalCount) {
        endCount = this.totalCount
      }

      return startCount + ' - ' + endCount + ' of ' + this.totalCount
    },
    pageForward () {
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
    pageBack () {
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
    returnToFirstPage () {
      this.buttonDisabled = 'pageBack'
      this.currentPage = 1
      this.$emit('pageChanged', this.currentPage)
    },
    goToLastPage () {
      this.buttonDisabled = 'pageForward'
      this.currentPage = Math.ceil(this.totalCount / this.pageSize)
      this.$emit('pageChanged', this.currentPage)
    }
  }
})
</script>

<style lang="scss" scoped>
.pagination-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  border: 1px solid var(--section_colors-stroke);
  border-radius: 50%;
  margin-left: 5px;
  cursor: pointer;
  &:focus {
    outline: none;
    border-color: var(--button_colors-primary-fill);
  }
}
</style>

<style lang="scss">
.card-pagination-bar {
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
