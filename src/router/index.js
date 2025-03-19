import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/Home/HomeView.vue'
import ProductsView from '../views/Products/ProductsView.vue'
import AboutView from '@/views/About/AboutView.vue'

const routes = [
  { path: '/', name: 'HomeView', component: HomeView },
  { path: '/products', name: 'ProductsView', component: ProductsView },
  { path: '/about', name: 'AboutView', component: AboutView },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
