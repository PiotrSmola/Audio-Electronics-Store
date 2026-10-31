import './assets/scss/main.scss'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { createVuetify } from 'vuetify'

// Vuetify CSS order matters for our overrides: all component styles first, then Vuetify's
// global styles (reset/utilities), then the app's own styles. Components themselves are
// tree-shaken and auto-imported by vite-plugin-vuetify (see vite.config.js); the component
// CSS they import later is already loaded here, so its position in the cascade stays the same.
import.meta.glob('/node_modules/vuetify/lib/components/*/*.css', { eager: true })
import 'vuetify/styles'
import '@mdi/font/css/materialdesignicons.css'
import './assets/scss/base.scss'
import './assets/scss/motion.scss'

import App from './App.vue'
import router from './router'
import reveal from './directives/reveal'

const vuetify = createVuetify({
  icons: {
    defaultSet: 'mdi',
  },
})

const app = createApp(App)
// Registered first so every view and component can use v-reveal (see src/directives/reveal.js)
app.directive('reveal', reveal)
app.use(createPinia())
app.use(router)
app.use(vuetify)
app.mount('#app')
