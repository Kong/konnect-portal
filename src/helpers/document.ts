import { BaseNode, TextNode } from '@kong-ui-public/document-viewer'

export function findAllNodesOfType<NodeType extends BaseNode<string>> (node: NodeType, nodeType: string): NodeType[] {
  const returnNodes: NodeType[] = []
  if (node.type === nodeType) {
    returnNodes.push(node)
  }

  if (Array.isArray(node.children)) {
    returnNodes.push(...node.children.flatMap(child => findAllNodesOfType<NodeType>(child as NodeType, nodeType)))
  }

  return returnNodes
}

export function getNodeTextContent (node) {
  return findAllNodesOfType<TextNode>(node, 'text').map(node => node.text).join('')
}

export function hasDocumentInTree (documentChildren, documentId) {
  return documentChildren.some((document) => {
    return document.id === documentId ||
      (document.children && hasDocumentInTree(document.children, documentId))
  })
}
