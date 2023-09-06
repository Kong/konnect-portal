import { DefinedLocales, locales } from '@/locales'
import { defineStore } from 'pinia'

const locale = import.meta.env.VITE_LOCALE as DefinedLocales

if (!locale) {
  throw Error('VITE_LOCALE is not defined')
}

const defaultLocale = 'en'

if (!locales[locale]) {
  // eslint-disable-next-line no-console
  console.warn(`Locale ${locale} not found. Using default locale ${defaultLocale}`)
}

export const useI18nStore = defineStore('i18n', {
  state: () => ({
    state: { helpText: locales[locale] || locales[defaultLocale] }
  })
})
