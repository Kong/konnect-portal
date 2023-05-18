function cleanupEmptyFields (dataToTransform: Record<string, any>) {
  const data = {}

  Object.entries(dataToTransform).forEach(([key, value]) => {
    if (value) {
      data[key] = value
    }
  })

  return data
}

export default cleanupEmptyFields
