import { DocumentTree } from '@kong/sdk-portal-js'

export function generateDocuments (docId: any): DocumentTree[] {
  return [
    {
      id: crypto.randomUUID(),
      parent_document_id: null,
      slug: 'mock-document-1',
      title: 'Mock Document #1',
      meta: {},
      children: []
    },
    {
      id: crypto.randomUUID(),
      parent_document_id: null,
      slug: 'mock-document-2',
      title: 'Mock Document #3',
      meta: {},
      children: []
    },
    {
      id: docId,
      parent_document_id: null,
      slug: 'mock-document-3',
      title: 'Mock Document #3',
      meta: {},
      children: [
        {
          id: crypto.randomUUID(),
          parent_document_id: docId,
          slug: 'child-document-1',
          title: 'Child Document #1',
          meta: {},
          children: []
        },
        {
          id: crypto.randomUUID(),
          parent_document_id: docId,
          slug: 'child-document-2',
          title: 'Child Document #2',
          meta: {},
          children: []
        }
      ]
    }
  ]
}
