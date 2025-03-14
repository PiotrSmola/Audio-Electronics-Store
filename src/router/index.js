import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/Home/HomeView.vue'
import ProductsView from '../views/Products/ProductsView.vue'

const routes = [
  { path: '/', name: 'HomeView', component: HomeView },
  { path: '/products', name: 'ProductsView', component: ProductsView },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
