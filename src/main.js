import { createApp } from 'vue'
import { standalonePageForPath } from './pages.js'
import './style.css'

const page = standalonePageForPath(window.location.pathname)
const component = page?.kind === 'autumn'
  ? import('./AutumnPage.vue')
  : import('./App.vue')

component.then(({ default: App }) => createApp(App).mount('#app'))
