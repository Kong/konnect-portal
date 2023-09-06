/**
 * Determine if the resource path from a KRN from the API matches a requested resource path guard. Substitutes UUID for `*` matches.
 * @param {ParsedKrn} parsedKrn A parsed krn (from the API)
 * @param {string} requestedResourcePath The resource path being accessed
 * @returns {boolean}
 */
export const resourcePathMatches = (parsedKrn, requestedResourcePath: string) => {
  const parsedKrnResourcePathArray = parsedKrn?.resourcePath?.split('/')
  const requestedResourcePathArray = requestedResourcePath?.split('/')

  // If the krns do not have the same path, exit early
  if (parsedKrnResourcePathArray?.length !== requestedResourcePathArray?.length) {
    return false
  }

  const pathsMatch = []

  requestedResourcePathArray?.forEach((requestedPathValue, index) => {
    // Set the pathMatches to false by default
    let pathMatches = false

    // If odd index, requestedPathValue is UUID or wildcard '*'
    if (index % 2) {
      pathMatches = requestedPathValue === parsedKrnResourcePathArray[index] || parsedKrnResourcePathArray[index] === '*' && requestedPathValue !== ''
    } else {
      // If index is even number, requestedPathValue is the static entity, e.g. 'services', 'runtimegroups'
      pathMatches = requestedPathValue === parsedKrnResourcePathArray[index]
    }

    // Push boolean (true/false) depending on if either globMatches and entityMatches === true
    pathsMatch.push(pathMatches)
  })

  return pathsMatch?.every(matchFromPath => matchFromPath === true) || false
}

/**
 * @description Does the krnArg include the required properties and have a valid resource path
 * @param {(RequestedPermissionKrn|RequestedPermissionDictionary)} krnArg The object to validate
 * @return {*}  {boolean}
 */

export const krnArgIsValid = (krnArg) => {
  // If all object properties are valid krn args, and required properties are set
  // and ensure args.resourcePath does not include invalid characters in the path
  return objectIsKrnArg(krnArg) && krnResourcePathIsValid(krnArg.resourcePath)
}

/**
 * @description Returns true if the potentialKrnArgs object is of type RequestedPermissionKrn and not a dictionary
 * @param {(RequestedPermissionKrn|RequestedPermissionDictionary)} potentialKrnArgs The object to validate
 * @return {*}  {boolean} Is the object a single krn arg, rather than a dictionary
 */

export const objectIsKrnArg = (potentialKrnArgs) => {
  const keys = Object.keys(potentialKrnArgs)
  const values = Object.values(potentialKrnArgs)

  return keys.every(
    (key) => key === 'service' || key === 'action' || key === 'resourcePath'
  ) &&
  values.every(value => !!value)
}

/**
 * @description Is the krn resourcePath (if present) valid (doesn't contain any restricted characters)
 * @param {string} [resourcePath] The krnArg resource path
 * @return {*}  {boolean}
 */

export const krnResourcePathIsValid = (resourcePath) => {
  if (resourcePath.includes('}') || resourcePath.includes('{')) {
    // Log error to help developer find invalid array
    console.error(`Invalid krn resourcePath value: ${resourcePath}`)

    return false
  }

  return true
}
