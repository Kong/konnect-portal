import { en } from './en'

// If you wish to define additional locales, add them here separated by `|`
export type DefinedLocales = 'en'

export const locales: Record<DefinedLocales, typeof en> = {
  en
}
