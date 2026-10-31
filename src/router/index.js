import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/Home/HomeView.vue'
import ProductsView from '@/views/Products/ProductsView.vue'
import ProductDetailView from '@/views/Products/ProductDetailsView.vue'
import AboutView from '@/views/About/AboutView.vue'
import ContactView from '@/views/Contact/ContactView.vue'
import NotFoundView from '@/views/NotFound/NotFoundView.vue'
import { getProductById } from '@/data/products'

const SITE_NAME = 'Audio Electronics Store'

const routes = [
  { path: '/', name: 'HomeView', component: HomeView, meta: { title: 'Home' } },
  { path: '/products', name: 'ProductsView', component: ProductsView, meta: { title: 'Products' } },
  {
    path: '/products/:id(\\d+)',
    name: 'ProductDetailView',
    component: ProductDetailView,
    meta: { title: 'Product Details' },
    beforeEnter: (to) => {
      if (!getProductById(to.params.id)) {
        return notFoundLocation(to)
      }
    },
  },
  // Legacy URL (/productdetail?id=3) - kept so old links keep working
  {
    path: '/productdetail',
    redirect: (to) => ({
      name: 'ProductDetailView',
      params: { id: Math.abs(parseInt(to.query.id, 10)) || 1 },
      query: {},
    }),
  },
  { path: '/about', name: 'AboutView', component: AboutView, meta: { title: 'About' } },
  { path: '/contact', name: 'ContactView', component: ContactView, meta: { title: 'Contact' } },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: NotFoundView,
    meta: { title: 'Page Not Found' },
  },
]

function notFoundLocation(to) {
  return {
    name: 'NotFound',
    params: { pathMatch: to.path.substring(1).split('/') },
    query: to.query,
    hash: to.hash,
  }
}

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    // In-page anchors such as /products#products or /contact#contact.
    // New pages jump to the top instantly (they fade in, so a long smooth scroll would look odd).
    // The navbar is sticky, so anchors are offset by its height to stay fully visible.
    const position = () => {
      if (savedPosition) return savedPosition
      if (!to.hash) return { top: 0, behavior: 'instant' }
      const navbarHeight = document.querySelector('.navbar')?.offsetHeight || 0
      return { el: to.hash, top: navbarHeight, behavior: 'smooth' }
    }

    // App.vue swaps pages with an out-in <Transition> whenever the page component changes.
    // Scroll only once the new page is in the DOM (App.vue fires "app:page-enter"), so the old
    // page does not jump while fading out and #hash targets exist. Same-component navigations
    // (e.g. /products/1 -> /products/2, or a #hash on the current page) do not transition.
    const fromComponent = from.matched[0]?.components?.default
    const toComponent = to.matched[0]?.components?.default
    if (!fromComponent || fromComponent === toComponent) return position()

    return new Promise((resolve) => {
      const done = () => {
        window.removeEventListener('app:page-enter', done)
        clearTimeout(fallback)
        resolve(position())
      }
      // Safety net in case the transition never reports back
      const fallback = setTimeout(done, 1000)
      window.addEventListener('app:page-enter', done)
    })
  },
})

router.afterEach((to) => {
  const product = to.name === 'ProductDetailView' ? getProductById(to.params.id) : null
  const pageTitle = product ? product.name : to.meta.title
  document.title = pageTitle ? `${pageTitle} | ${SITE_NAME}` : SITE_NAME
})

export default router
