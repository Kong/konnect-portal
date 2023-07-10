import { App } from 'vue'
import Content from './Content.vue'
import EmptyState from './EmptyState.vue'
import AnalyticsEmptyState from './vitals/AnalyticsEmptyState.vue'

export const registerComponents = (app: App<Element>) => {
  app.component('Content', Content)
  app.component('EmptyState', EmptyState)
  app.component('AnalyticsEmptyState', AnalyticsEmptyState)
}
