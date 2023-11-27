import { defineStore, storeToRefs } from 'pinia'
import { useAppStore } from '@/stores'
import { portalApiV2 } from '@/services'
import { ProductActionsResponseActions } from '@kong/sdk-portal-js'

export type ProductAction = keyof ProductActionsResponseActions

export const usePermissionsStore = defineStore('permissions', () => {
  const canUserAccess = async (requestedPermission: { action: ProductAction; productId: string }) => {
    const appStore = useAppStore()
    const { isRbacEnabled, isPublic } = storeToRefs(appStore)

    if (isPublic.value || !isRbacEnabled.value) {
      return true
    }

    const { action, productId } = requestedPermission

    const { data } = await portalApiV2.service.productsApi.getProductActions({ productId })

    //  make sure the requested action is true on the response
    return data.actions[action]
  }

  return {
    canUserAccess
  }
})
