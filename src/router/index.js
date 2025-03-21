import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/Home/HomeView.vue'
import ProductsView from '../views/Products/ProductsView.vue'
import AboutView from '@/views/About/AboutView.vue'
import ContactView from '@/views/Contact/ContactView.vue'
import ProductDetailView from '../views/Products/ProductDetailsView.vue'

const routes = [
  { path: '/', name: 'HomeView', component: HomeView },
  { path: '/products', name: 'ProductsView', component: ProductsView },
  {
    path: '/productdetail',
    name: 'ProductDetailView',
    component: ProductDetailView,
  },
  { path: '/about', name: 'AboutView', component: AboutView },
  { path: '/contact', name: 'ContactView', component: ContactView },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior() {
    return { top: 0 }
  },
})

export default router
