import { locales } from '@/locales'
import { defineStore } from 'pinia'
const locale = import.meta.env.VITE_LOCALE

export const useI18nStore = defineStore('i18n', {
  state: () => ({
    state: { helpText: locales[locale] }
  })
})
