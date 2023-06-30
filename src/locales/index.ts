import { en } from './en'
import { de } from './de'

// If you wish to define additional locales, add them here separated by `|`
export type DefinedLocales = 'en|de'

export const locales: Record<DefinedLocales, typeof en> = {
  en
}
