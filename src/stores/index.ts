import { createPinia } from 'pinia'

const piniaInstance = createPinia()

export default piniaInstance

export * from '@/stores/i18n'
export * from '@/stores/permissions'
export * from '@/stores/app'
export * from '@/stores/product'
