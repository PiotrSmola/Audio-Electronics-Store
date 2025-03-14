import { createApp } from 'vue'
import About from './About.vue'
import { createVuetify } from 'vuetify'
import 'vuetify/styles'
import './About.scss'

const app = createApp(About)
const vuetify = createVuetify()

app.use(vuetify)

app.mount('#app')
