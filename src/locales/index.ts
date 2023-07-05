import { en } from './en'
import { es_ES } from './es_ES'

// If you wish to define additional locales, add them here separated by `|`
export type DefinedLocales = 'en | es_ES'

export const locales: Record<DefinedLocales, typeof en> = {
  en,
  es_ES,
}