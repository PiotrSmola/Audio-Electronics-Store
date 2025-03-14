import { createApp } from 'vue'
import Contact from './Contact.vue'
import { createVuetify } from 'vuetify'
import 'vuetify/styles'
import './Contact.scss'

const app = createApp(Contact)
const vuetify = createVuetify()

app.use(vuetify)

app.mount('#app')
