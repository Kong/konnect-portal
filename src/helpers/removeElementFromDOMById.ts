function removeElementFromDOMById (id: string) {
  return document.getElementById(id)?.remove()
}

export default removeElementFromDOMById
