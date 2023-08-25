import { I18nType } from './i18n-type'

import { ca_ES } from './ca_ES'
import { de } from './de'
import { en } from './en'
import { es_ES } from './es_ES'
import { fr } from './fr'

// If you wish to define additional locales, add them here separated by `|`
export type DefinedLocales = |
'ca_ES' |
'de' |
'en' |
'es_ES' |
'fr'

export const locales: Record<DefinedLocales, I18nType> = {
  ca_ES,
  de,
  en,
  es_ES,
  fr
}

export function translationNeeded (str: string) { return str }
