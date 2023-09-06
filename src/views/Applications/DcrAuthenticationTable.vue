<template>
  <div class="client-secret-table">
    <PageTitle class="mb-5">
      <h2 class="font-normal type-lg m-0">
        {{ helpText.authentication }}
      </h2>
    </PageTitle>
    <KCard>
      <template #body>
        <KTable
          data-testid="client-secret-table"
          :is-loading="!application"
          :fetcher-cache-key="fetcherCacheKey"
          :fetcher="fetcher"
          disable-pagination
          is-small
          has-side-border
          :headers="tableHeaders"
        >
          <template #created_at="{ row }">
            {{ formatDate(row.created_at) }}
          </template>
          <template #actions="{ row }">
            <KButton
              data-testid="refresh-secret-button"
              :icon="isLoading ? 'spinner' : 'redo'"
              :is-rounded="false"
              :disabled="isLoading"
              appearance="secondary"
              @click="handleRefreshSecret(row.id)"
            >
              <span>{{ helpText.refreshToken }}</span>
            </KButton>
          </template>
        </KTable>
      </template>
    </KCard>
    <RefreshTokenModal
      :is-visible="refreshSecretModalVisible"
      :token="token"
      @closed="onModalClose"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent, computed, ref, watch } from 'vue'
import { format } from 'date-fns'
import getMessageFromError from '@/helpers/getMessageFromError'
import usePortalApi from '@/hooks/usePortalApi'
import { useI18nStore } from '@/stores'
import useToaster from '@/composables/useToaster'
import RefreshTokenModal from '@/components/RefreshTokenModal.vue'
import PageTitle from '@/components/PageTitle.vue'

export default defineComponent({
  name: 'DcrAuthenticationTable',
  components: { RefreshTokenModal, PageTitle },
  props: {
    application: {
      type: Object,
      required: true
    }
  },

  setup (props) {
    const { notify } = useToaster()
    const helpText = useI18nStore().state.helpText.dcrAuthentication
    const isLoading = ref(null)
    const tableHeaders = [
      { label: 'Client ID', key: 'reference_id' },
      { label: 'Created Date', key: 'created_at' },
      { key: 'actions', hideLabel: true }
    ]
    const refreshSecretModalVisible = ref(false)
    const token = ref(null)

    const key = ref(0)
    const fetcherCacheKey = computed(() => key.value.toString())

    const revalidate = () => {
      key.value += 1
    }

    function fetcher () {
      if (props.application) {
        return {
          data: [props.application],
          total: 1
        }
      }

      return {
        data: [],
        total: 0
      }
    }

    const { portalApiV2 } = usePortalApi()

    const formatDate = (date: Date) => {
      return format(new Date(date), 'yyyy-MM-dd ppp')
    }
    const handleRefreshSecret = (id: string) => {
      isLoading.value = true
      portalApiV2.value.service.credentialsApi.refreshApplicationToken({
        applicationId: id
      })
        .then((res) => {
          isLoading.value = null
          notify({
            message: 'Successfully refreshed secret'
          })
          refreshSecretModalVisible.value = true
          token.value = res.data.client_secret
        })
        .catch(error => {
          isLoading.value = null
          notify({
            appearance: 'danger',
            message: getMessageFromError(error)
          })
        })
    }

    const onModalClose = () => {
      refreshSecretModalVisible.value = false
      token.value = null
    }

    watch(() => props.application, () => {
      revalidate()
    })

    return {
      helpText,
      tableHeaders,
      isLoading,
      formatDate,
      token,
      onModalClose,
      handleRefreshSecret,
      refreshSecretModalVisible,
      fetcher,
      fetcherCacheKey
    }
  }

})
</script>

<style lang="scss">
.client-secret-table {
  table tbody td:last-of-type {
    text-align: right !important;
  }
}
</style>
