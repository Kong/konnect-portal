import { kongAuthApi } from '@/services'
import { ref } from 'vue'

export default function useKongAuthApi () {
  const api = ref(kongAuthApi)

  return {
    kongAuthApi: api
  }
}
