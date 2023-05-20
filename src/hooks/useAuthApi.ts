import { authApi } from '@/services'
import { ref } from 'vue'

export default function useAuthApi () {
  const api = ref(authApi)

  return {
    authApi: api
  }
}
