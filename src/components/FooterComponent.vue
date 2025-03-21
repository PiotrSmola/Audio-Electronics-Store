<template>
  <footer class="footer">
    <div class="footer__body container">
      <p>
        All rights reserved © Audio Electronics Store
        <span class="footer__date">{{ currentYear }}</span>
      </p>
      <div class="footer__icons">
        <a href="#" class="footer__icon"><v-icon>mdi-facebook</v-icon></a>
        <a href="#" class="footer__icon"><v-icon>mdi-instagram</v-icon></a>
        <a href="#" class="footer__icon"><v-icon>mdi-twitter</v-icon></a>
      </div>
    </div>
  </footer>
</template>

<script>
export default {
  name: 'FooterComponent',
  computed: {
    currentYear() {
      return new Date().getFullYear()
    },
  },
}
</script>

<style lang="scss">
@use '@/assets/scss/main.scss' as *;

.footer {
  background-color: #141414;
  color: #fff;
  padding: 2rem 0;
  font-size: 1.5rem;
  text-align: center;
  @media (max-width: 576px) {
    font-size: 1.3rem;
  }
  .footer__body {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1rem;
    @media (max-width: 576px) {
      width: 85%;
    }
  }
  .footer__icons {
    display: flex;
    gap: 1rem;
    a {
      color: #fff;
      font-size: 1.5rem;
      transition: color 0.3s;
      &:hover {
        color: #4c018e;
      }
    }
  }
}
</style>
