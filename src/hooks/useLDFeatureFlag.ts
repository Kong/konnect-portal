import useLaunchDarkly from '@/composables/useLaunchDarkly'
import { LDFlagValue } from 'launchdarkly-js-client-sdk'

export default function useLDFeatureFlag (key:string, defaultValue:boolean): LDFlagValue {
  const { ldClient } = useLaunchDarkly()

  return ldClient?.variation(key, defaultValue)
}
