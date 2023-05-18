import { App } from 'vue'
import Content from './Content.vue'
import EmptyState from './EmptyState.vue'

export const registerComponents = (app: App<Element>) => {
  app.component('Content', Content)
  app.component('EmptyState', EmptyState)
}
