<template>
  <v-app>
    <!-- Shared layout: rendered once for every page -->
    <div class="app-layout" :class="{ 'app-layout--page-switch': pageSwitching }">
      <NavbarComponent />
      <!-- Page transition: the old page fades out before the new one fades in (styles in
           assets/scss/motion.scss). The router's scrollBehavior waits for "app:page-enter". -->
      <router-view v-slot="{ Component }">
        <Transition
          name="page"
          mode="out-in"
          @before-leave="pageSwitching = true"
          @enter="onPageEnter"
          @after-enter="pageSwitching = false"
          @enter-cancelled="pageSwitching = false"
        >
          <component :is="Component" />
        </Transition>
      </router-view>
      <FooterComponent />
      <ShoppingCartComponent />
      <ToastComponent />
    </div>
  </v-app>
</template>

<script>
import NavbarComponent from '@/components/NavbarComponent.vue'
import FooterComponent from '@/components/FooterComponent.vue'
import ShoppingCartComponent from '@/components/ShoppingCartComponent.vue'
import ToastComponent from '@/components/ToastComponent.vue'
import { useCartStore } from '@/stores/cartStore'

export default {
  name: 'App',
  components: {
    NavbarComponent,
    FooterComponent,
    ShoppingCartComponent,
    ToastComponent,
  },
  data() {
    return {
      // True while one page fades out and the next fades in
      pageSwitching: false,
    }
  },
  watch: {
    // Close the cart panel whenever the user navigates to another page
    '$route.path'() {
      useCartStore().closeCart()
    },
  },
  methods: {
    // The new page is in the DOM now: let the router scroll to the top / to the #hash target.
    // (Single parameter on purpose: Vue would otherwise wait for a `done` callback.)
    onPageEnter() {
      window.dispatchEvent(new Event('app:page-enter'))
    },
  },
}
</script>

<style>
#app {
  display: flex;
}
/* Flex items default to min-width: auto; without this a single wide element would
   stretch the whole layout past the viewport on narrow phones */
#app > .v-application {
  min-width: 0;
}
html {
  scroll-behavior: smooth;
}
/* Dark backdrop between pages, so the fade never flashes the light page background */
.app-layout--page-switch {
  background-color: #101311;
}
@media (prefers-reduced-motion: reduce) {
  html {
    scroll-behavior: auto;
  }
}
</style>
