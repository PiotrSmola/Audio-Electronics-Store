import { createApp } from 'vue'
import Home from './HomeView.vue'
import { createVuetify } from 'vuetify'
import 'vuetify/styles'
import './Home.scss'

const app = createApp(Home)
const vuetify = createVuetify()

app.use(vuetify)

app.mount('#app')
