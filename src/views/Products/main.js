import { createApp } from 'vue'
import Products from './Products.vue'
import { createVuetify } from 'vuetify'
import 'vuetify/styles'
import './Products.scss'

const app = createApp(Products)
const vuetify = createVuetify()

app.use(vuetify)

app.mount('#app')
