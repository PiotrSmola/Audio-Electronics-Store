<template>
  <div>
    <NavBar />
    <main class="contact">
      <section class="contact__section container">
        <h1 class="contact__title">Contact</h1>
        <div class="contact__details">
          <div class="contact__item">
            <i class="fa-solid fa-location-dot"></i>
            <p>Address: Audio 123, 00-001 City</p>
          </div>
          <div class="contact__item">
            <i class="fa-solid fa-envelope"></i>
            <p>Email: contact@audioelectronics.com</p>
          </div>
          <div class="contact__item">
            <i class="fa-solid fa-phone"></i>
            <p>Phone: +48 123 456 789</p>
          </div>
        </div>
      </section>
    </main>
    <Footer />
    <ShoppingCart />
  </div>
</template>

<script>
import NavbarComponent from '@/components/NavbarComponent.vue'
import FooterComponent from '@/components/FooterComponent.vue'
import ShoppingCartComponent from '@/components/ShoppingCartComponent.vue'

export default {
  name: 'ContactView',
  components: { NavbarComponent, FooterComponent, ShoppingCartComponent },
}
</script>
