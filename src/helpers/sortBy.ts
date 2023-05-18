// allow sorting array by key, supporting dates and numbers

export enum SortOrder {
  ASC = 'asc',
  DESC = 'desc'
}

export enum SortType {
  NUMBER = 'number',
  DATE = 'date',
  STRING = 'string'
}

export function sortBy (key: string, order = SortOrder.ASC, type = SortType.NUMBER) {
  return (a: object, b: object) => {
    if (type === 'number') {
      return sortByNumber(key, order)(a, b)
    } else if (type === 'date') {
      return sortByDate(key, order)(a, b)
    } else {
      return sortByString(key, order)(a, b)
    }
  }
}

export function sortByString (key: string, order = 'asc') {
  return (a: object, b: object) => {
    const aValue = a[key].toLowerCase()
    const bValue = b[key].toLowerCase()

    if (aValue === bValue) {
      return 0
    }

    if (order === 'asc') {
      return aValue > bValue ? 1 : -1
    }

    return aValue < bValue ? 1 : -1
  }
}

export function sortByNumber (key: string, order = 'asc') {
  return (a: object, b: object) => {
    const aValue = a[key]
    const bValue = b[key]

    if (aValue === bValue) {
      return 0
    }

    if (order === 'asc') {
      return aValue > bValue ? 1 : -1
    }

    return aValue < bValue ? 1 : -1
  }
}

export function sortByDate (key: string, order = 'asc') {
  return (a: object, b: object) => {
    const aValue = new Date(a[key]).getTime()
    const bValue = new Date(b[key]).getTime()

    if (aValue === bValue) {
      return 0
    }

    if (order === 'asc') {
      return aValue > bValue ? 1 : -1
    }

    return aValue < bValue ? 1 : -1
  }
}
