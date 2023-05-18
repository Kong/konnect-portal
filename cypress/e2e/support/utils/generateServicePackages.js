const generateServicePackages = (count, options = []) => {
  const servicesData = []

  for (let i = 0; i < count; i++) {
    servicesData.push({
      source: {
        id: 'a5afb115-025e-4da1-a013-bf05b326e0a5' + i,
        created_at: '2020-08-25T16:14:52.450Z',
        updated_at: '2020-08-25T16:14:52.450Z',
        name: 'barAPI' + i,
        description: null,
        documents: [],
        versions: [
          {
            id: 'a41041e4-d324-43c8-977a-ad68f1839751' + i,
            created_at: '2020-08-25T16:14:54.564Z',
            updated_at: '2020-08-25T16:14:54.564Z',
            version: 'v2'
          }
        ],
        ...options[i] || {}
      }
    })
  }

  return servicesData
}

export default generateServicePackages
