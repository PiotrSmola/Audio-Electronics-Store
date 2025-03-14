<template>
  <div>
    <NavBar />
    <main class="about">
      <section class="about__section container">
        <h1 class="about__title">O nas</h1>
        <p class="about__description">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam nec purus ut libero
          ultricies ultricies. Nullam nec purus ut libero ultricies ultricies. Nullam nec purus ut
          libero ultricies ultricies. Nullam nec purus ut libero ultricies ultricies. Nullam nec
          purus ut libero ultricies ultricies. Nullam nec purus ut libero ultricies
        </p>
        <img src="@/assets/img/about_audio.jpg" alt="O nas" class="about__image" />
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
  name: 'AboutView',
  components: { NavbarComponent, FooterComponent, ShoppingCartComponent },
}
</script>

<style lang="scss" src="./About.scss"></style>
