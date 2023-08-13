export const snakeToCamelCase = (obj) => {
  if (typeof obj !== 'object' || obj === null) { return obj }

  if (Array.isArray(obj)) {
    return obj.map(item => snakeToCamelCase(item))
  }

  return Object.keys(obj).reduce((acc, key) => {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      const camelKey = key.replace(/_([a-z])/g, (match, letter) => letter.toUpperCase())

      acc[camelKey] = snakeToCamelCase(obj[key])
    }

    return acc
  }, {})
}
