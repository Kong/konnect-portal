export function idFromPathMethod (pathName: string, method: string) {
  return `${toLower(method)}${escapeString(pathName)}`
}

// copied from helpers in 'swagger-js', we use this to get the proper id
const toLower = (str: string) => String.prototype.toLowerCase.call(str)

const escapeString = (str: string) => {
  return str.replace(/[^\w]/gi, '_')
}
