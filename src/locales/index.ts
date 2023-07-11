import { en } from './en'
import { fr } from './fr'
import { de } from './de'
import { es_ES } from './es_ES'

// If you wish to define additional locales, add them here separated by `|`
export type DefinedLocales = 'en'|'fr'|'de'|'es_ES'

export const locales: Record<DefinedLocales, typeof en> = {
  en,
  fr,
  de,
  es_ES
}