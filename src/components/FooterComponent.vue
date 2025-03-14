<template>
  <footer class="footer">
    <div class="footer__body container">
      <p>
        All rights reserved © Audio Electronics Store
        <span class="footer__date">{{ currentYear }}</span>
      </p>
      <div class="footer__icons">
        <a href="#" class="footer__icon"><i class="fa-brands fa-facebook-f"></i></a>
        <a href="#" class="footer__icon"><i class="fa-brands fa-instagram"></i></a>
        <a href="#" class="footer__icon"><i class="fa-brands fa-twitter"></i></a>
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
  .footer__body {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1rem;
  }
  .footer__icons {
    display: flex;
    gap: 1rem;
    a {
      color: #fff;
      font-size: 2rem;
      transition: color 0.3s;
      &:hover {
        color: #be9c79;
      }
    }
  }
}
</style>
