<template>
  <div>
    <NavbarComponent @toggle-cart="toggleCart" />
    <!-- Header -->
    <header class="header">
      <div class="header__bgc">
        <div class="header__body container">
          <p class="header__text">Exclusive Deals on Premium Audio Equipment</p>
          <h1 class="header__heading">Experience Superior Sound</h1>
          <a class="header__link" href="products.html">Shop Now</a>
        </div>
      </div>
    </header>

    <main>
      <!-- About Section -->
      <section class="about move" id="about">
        <div class="container">
          <h2 class="about__heading move">About Us</h2>
          <div class="about__body">
            <img src="@/assets/img/homeAbout.jpg" alt="Audio Equipment" class="about__img" />
            <div class="about__content">
              <h3 class="about__title">Passion for Quality Sound</h3>
              <p class="about__text">
                We bring you the best in audio electronics – from high‑fidelity amplifiers to
                cutting‑edge wireless speakers. Our carefully selected range combines innovative
                technology with superior craftsmanship to deliver an unparalleled listening
                experience.
              </p>
            </div>
            <a class="about__btn" href="about.html">Learn More</a>
          </div>
        </div>
      </section>

      <!-- Services Section -->
      <section class="services move" id="services">
        <div class="container">
          <h2 class="services__heading move">Our Services</h2>
          <div class="services__box">
            <div class="services__item move">
              <img src="@/assets/img/service1.jpg" alt="Professional Setup" class="services__img" />
              <h3 class="services__title">Professional Setup</h3>
              <p class="services__text">
                Expert installation and calibration of your audio system.
              </p>
            </div>
            <div class="services__item move">
              <img src="@/assets/img/service2.jpg" alt="Custom Tuning" class="services__img" />
              <h3 class="services__title">Custom Tuning</h3>
              <p class="services__text">
                Tailored sound tuning to match your environment and taste.
              </p>
            </div>
            <div class="services__item move">
              <img src="@/assets/img/service3.jpg" alt="Repair & Support" class="services__img" />
              <h3 class="services__title">Repair & Support</h3>
              <p class="services__text">Dedicated technical support and maintenance services.</p>
            </div>
          </div>
        </div>
      </section>

      <!-- Opening Hours Section -->
      <section class="open move" id="open">
        <div class="container">
          <div class="open__body">
            <h2 class="open__heading move">Opening Hours</h2>
            <div class="open__days">
              <div class="open__day">
                <span>Monday - Friday</span>
                <span>09:00 - 21:00</span>
              </div>
              <div class="open__day">
                <span>Saturday</span>
                <span>10:00 - 20:00</span>
              </div>
              <div class="open__day">
                <span>Sunday</span>
                <span>11:00 - 18:00</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Newsletter Section -->
      <section class="newsletter move" id="newsletter">
        <div class="container">
          <div class="newsletter__content">
            <h3 class="newsletter__title move">Sign Up for Updates</h3>
            <p class="newsletter__text move">
              Subscribe to our newsletter and get 10% off your first purchase.
            </p>
            <form class="newsletter__form">
              <input type="email" placeholder="Your Email" class="newsletter__input" />
              <button type="submit" class="newsletter__btn">Subscribe</button>
            </form>
          </div>
        </div>
      </section>
    </main>

    <FooterComponent />
    <ShoppingCartComponent v-if="cartVisible" @close="cartVisible = false" />
  </div>
</template>

<script>
import NavbarComponent from '@/components/NavbarComponent.vue'
import FooterComponent from '@/components/FooterComponent.vue'
import ShoppingCartComponent from '@/components/ShoppingCartComponent.vue'

export default {
  name: 'HomeView',
  components: { NavbarComponent, FooterComponent, ShoppingCartComponent },
  data() {
    return {
      cartVisible: false,
    }
  },
  methods: {
    toggleCart() {
      this.cartVisible = !this.cartVisible
    },
  },
}
</script>

<style lang="scss" src="./Home.scss"></style>
