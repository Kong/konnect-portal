import { en } from './en'
import { ca_ES } from './ca_ES'

// If you wish to define additional locales, add them here separated by `|`
export type DefinedLocales = 'en | ca_ES'

export const locales: Record<DefinedLocales, typeof en> = {
  en,
  ca_ES
}
