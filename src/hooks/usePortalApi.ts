import { portalApiV2 } from '@/services'
import { ref } from 'vue'

export default function usePortalApi () {
  const apiv2 = ref(portalApiV2)

  return {
    portalApiV2: apiv2
  }
}
