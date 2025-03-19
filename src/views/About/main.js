import { createApp } from 'vue'
import About from './AboutView.vue'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import 'vuetify/styles'

const vuetify = createVuetify({
  components,
  directives,
  theme: {
    defaultTheme: 'light',
    themes: {
      light: {
        colors: {
          primary: '#be9c79',
          secondary: '#2c3e50',
        },
      },
    },
  },
})

const app = createApp(About)
app.use(vuetify)
app.mount('#app')
