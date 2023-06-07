import { GetApplicationResponse, GetRegistrationResponse, PortalContext, Product, ProductVersion } from '@kong/sdk-portal-js'
import { v4 as uuidv4 } from 'uuid'

const versions: ProductVersion[] = [
  {
    created_at: '2022-03-26T14:52:46.323Z',
    updated_at: '2022-03-26T14:52:46.323Z',
    id: '1afac832-5b2a-474c-a56d-c241364f41cf',
    name: 'v1-beta',
    deprecated: false,
    registration_configs: [{ name: 'key-auth' }]
  }
]

const product: Product = {
  created_at: '2022-03-23T14:52:41.893Z',
  updated_at: '2022-03-23T14:52:41.893Z',
  id: 'a5afb115-025e-4da1-a013-bf05b326e0a51',
  name: 'barAPI',
  description: null,
  document_count: 0,
  latest_version: {
    id: versions[0].id,
    name: versions[0].name
  },
  version_count: 1
}

const productVersion: ProductVersion = {
  ...versions[0],
  registration_configs: []
}

const apps: GetApplicationResponse[] = [
  {
    name: 'My Cool App',
    description: 'My Cool App has a cool description',
    reference_id: '1',
    id: uuidv4(),
    created_at: '2022-03-25T13:15:02.104Z',
    updated_at: '2022-03-25T13:15:02.104Z'
  },
  {
    name: 'My Other App',
    reference_id: '2',
    id: uuidv4(),
    created_at: '2022-03-25T13:15:02.104Z',
    updated_at: '2022-03-25T13:15:02.104Z',
    description: 'My Other App has a cool description'
  },
  {
    name: 'My Other Other App',
    description: 'My Other Other App has a cool description',
    reference_id: '3',
    id: uuidv4(),
    created_at: '2022-03-25T13:15:02.104Z',
    updated_at: '2022-03-25T13:15:02.104Z'
  },
  {
    name: 'My DCR App',
    description: 'My DCR App has a cool description',
    reference_id: '4',
    redirect_uri: 'http://google.com',
    id: uuidv4(),
    created_at: '2022-03-25T13:15:02.104Z',
    updated_at: '2022-03-25T13:15:02.104Z'
  }
]

const productRegistration: GetRegistrationResponse = {
  created_at: '2022-03-25T13:15:02.104Z',
  updated_at: '2022-03-25T13:15:02.104Z',
  id: 'f3081666-e388-41ac-a6c0-9f37de2c2102',
  status: 'approved',
  application_id: apps[1].id,
  product_id: product.id,
  product_name: product.name,
  product_version_id: productVersion.id,
  product_version_name: productVersion.name
}

const defaultContext: PortalContext = {
  portal_id: '123',
  org_id: '123',
  is_public: false,
  dcr_provider_ids: [],
  basic_auth_enabled: true,
  oidc_auth_enabled: false,
  featureset_id: '6202956f054d96149719eed0',
  rbac_enabled: false,
  allowed_time_period: '2022-03-25T13:15:02.104Z'
}

export { versions, product, productVersion, productRegistration, apps, defaultContext }
