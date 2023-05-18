export function parse (cookieString) {
  return cookieString.split(';').reduce((acc, cur) => {
    const obj = cur.split('=')
    const noSpaceKey = obj[0].replace(/\s+/g, '')

    acc[noSpaceKey] = {
      key: obj[0],
      value: obj[1]
    }

    return acc
  }, {})
}

export function stringify (cookieObject) {
  return Object.keys(cookieObject).reduce((acc, cur) => {
    const key = cookieObject[cur].key
    const value = cookieObject[cur].value

    return acc === '' ? `${key}=${value}` : `${acc};${key}=${value}`
  }, '')
}
