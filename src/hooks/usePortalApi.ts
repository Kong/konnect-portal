import { portalApi, portalApiV2 } from '@/services'
import { ref } from 'vue'

export default function usePortalApi () {
  const api = ref(portalApi)
  const apiv2 = ref(portalApiV2)

  return {
    portalApi: api,
    portalApiV2: apiv2
  }
}
