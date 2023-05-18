import useLaunchDarkly from '@/composables/useLaunchDarkly'

/**
 * @description Provides a hook to access LD feature flags
 * @param {FeatureFlags} [key] Feature flag
 * @param {any} [defaultValue] Default flag value
 * @return LDFlagValue
 */

export default function useLDFeatureFlag (key, defaultValue) {
  const { ldClient } = useLaunchDarkly()

  return ldClient?.variation(key, defaultValue)
}
