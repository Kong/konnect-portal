import { defineStore, storeToRefs } from 'pinia'
import { ref } from 'vue'
import { resourcePathMatches, krnArgIsValid } from '@/helpers/permissions'
import { useAppStore } from '@/stores'

const KRN_STRUCT = {
  prefix: 'krn',
  regionBlockPrefix: 'reg/',
  orgBlockPrefix: 'org/',
  blockDelimeter: ':',
  pathDelimeter: '/'
}

export const usePermissionsStore = defineStore('permissions', () => {
  const krns = ref([])

  const addKrns = (payload) => {
    // If replaceAll is true, first clear all stored krns
    if (payload.replaceAll === true) {
      krns.value = []
    }

    // Store new krns
    krns.value = [...new Set([...krns.value, ...payload.krns].map(krn => JSON.stringify(krn)))].map(krn => JSON.parse(krn))
  }

  const parseKrn = (krnResource) => {
    const parsedKrn = {
      service: null,
      region: null,
      organization: null,
      resourcePath: null
    }

    // If not a valid krn, exit early
    if (!krnResource.startsWith(`${KRN_STRUCT.prefix}${KRN_STRUCT.blockDelimeter}`)) {
      console.error('parseKrn: Invalid KRN prefix')

      return null
    }

    const krnBlocks = krnResource.split(KRN_STRUCT.blockDelimeter)

    const [serviceBlock, regionBlock, orgBlock, resourceBlock] = krnBlocks.slice(1)

    // length of 4 gives: krn block, service block, geo block, and org block
    if (krnBlocks.length < 4) {
      console.error('parseKrn: Invalid number of KRN blocks')

      return null
    }

    parsedKrn.service = serviceBlock
    parsedKrn.region = regionBlock.replace(KRN_STRUCT.regionBlockPrefix, '')
    parsedKrn.organization = orgBlock.replace(KRN_STRUCT.orgBlockPrefix, '')

    if (resourceBlock !== undefined) {
      parsedKrn.resourcePath = resourceBlock
    }

    return parsedKrn
  }

  const canUserAccess = async (requestedPermission) => {
    const appStore = useAppStore()
    const { portalId, isRbacEnabled, isPublic } = storeToRefs(appStore)

    if (isPublic.value || !isRbacEnabled.value) {
      return true
    }

    // If object is invalid KRN exist early
    if (!krnArgIsValid(requestedPermission)) {
      return false
    }

    let requestedResourcePath

    const { service: requestedService, action, resourcePath } = requestedPermission

    // Block below is to simplify usage of `canUserAccess` by allowing to omit
    // first part which is static and contains always `portals/<portalId>`
    if (resourcePath.startsWith('portals')) {
      // full path provided, omit adding prefix `portals/<portalId>`
      requestedResourcePath = resourcePath
    } else {
      // simplify path - adding prefix `portals/<portalId>`
      requestedResourcePath = `portals/${portalId.value}/${resourcePath}`
    }

    // If set, ensure the requestedResourcePath does not include an `undefined` string
    // An `undefined` string is expected when evaluating the route guards in some scenarios as
    // provided route params will not be set at initial evaluation (e.g. when the Sidebar evaluates
    // permissions on app hydration); however, the params _will_ be present and valid in the beforeEach hook.
    if (requestedResourcePath.includes('/undefined')) {
      // Return false since this is an invalid resourcePath
      return false
    }

    // Ensure action starts with a hash '#'
    const requestedAction = action && action.startsWith('#') ? action : `#${action}`

    // Check if any krns exist in the store that match the requestedService and requestedResourcePath
    let matchingResources = krns.value.filter((krn) => {
      const parsedKrn = parseKrn(krn.resource)

      // If the requested service does not equal the krn service, exit early
      if (requestedService !== parsedKrn.service) {
        return false
      }

      return resourcePathMatches(parsedKrn, requestedResourcePath)
    })

    // If the requestedService is defined and the user has no matching resource paths
    // we return false as we fetch all of permissions for now and we do not need to refetch
    // permissions if requested one is not a part of ours.
    // Might change in the fututre
    if (matchingResources.length === 0) {
      return false
    }

    // Filter the resources with matching resourcePath by the requested action(s)
    matchingResources = matchingResources.filter((krn) => krn.actions.some(action => !!requestedAction && requestedAction === action))

    // Return true if the matchingResources contains an allowed action
    return matchingResources.length > 0
  }

  return {
    addKrns,
    canUserAccess
  }
})
