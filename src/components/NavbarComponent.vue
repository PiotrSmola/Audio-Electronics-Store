<template>
  <header class="navbar">
    <div class="navbar__container container">
      <router-link to="/" class="navbar__logo">
        <p id="store-name">Audio Electronics</p>
        <img src="@/assets/img/logo-audio.png" alt="Audio Electronics Logo" class="navbar__img" />
      </router-link>
      <!-- Menu for desktop -->
      <nav :class="{ 'navbar__menu--active': menuActive }" class="navbar__menu">
        <router-link to="/" class="navbar__link" @click="closeMenu">Home</router-link>
        <router-link to="/about" class="navbar__link" @click="closeMenu">About</router-link>
        <router-link to="/products" class="navbar__link" @click="closeMenu">Products</router-link>
        <router-link to="/contact" class="navbar__link" @click="closeMenu">Contact</router-link>
      </nav>
      <div class="navbar__icons">
        <v-btn icon class="navbar__search-btn" @click="openSearch">
          <v-icon>mdi-magnify</v-icon>
        </v-btn>
        <v-btn icon class="navbar__cart-btn" @click="$emit('toggle-cart')">
          <v-icon>mdi-cart</v-icon>
          <span class="navbar__cart-quantity">{{ cartQuantity }}</span>
        </v-btn>
        <!-- Hamburger toggle button for mobile -->
        <v-btn icon class="navbar__toggle-btn" @click="toggleMenu">
          <v-icon v-if="!menuActive">mdi-menu</v-icon>
          <v-icon v-else>mdi-close</v-icon>
        </v-btn>
      </div>
    </div>

    <!-- Modal menu for mobile -->
    <transition name="fade">
      <nav v-if="menuActive" class="navbar__menu-mobile" @click.self="closeMenu">
        <div class="navbar__menu-mobile-container">
          <router-link to="/" class="navbar__link" @click="closeMenu">Home</router-link>
          <router-link to="/about" class="navbar__link" @click="closeMenu">About</router-link>
          <router-link to="/products" class="navbar__link" @click="closeMenu">Products</router-link>
          <router-link to="/contact" class="navbar__link" @click="closeMenu">Contact</router-link>
        </div>
      </nav>
    </transition>

    <!-- Search dialog using Vuetify -->
    <v-dialog v-model="searchActive" persistent max-width="600">
      <v-card>
        <v-card-title>
          <v-text-field
            v-model="searchQuery"
            label="Search for audio equipment"
            clearable
            autofocus
            outlined
          ></v-text-field>
        </v-card-title>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" text @click="closeSearch">Close</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </header>
</template>

<script>
import { useCartStore } from '@/stores/cartStore'
import product1 from '@/assets/img/product1.jpg'
import product2 from '@/assets/img/product2.jpg'
import product3 from '@/assets/img/product3.jpg'

export default {
  name: 'NavbarComponent',
  data() {
    return {
      menuActive: false,
      searchActive: false,
      searchQuery: '',
      searchItems: [
        {
          id: 1,
          name: 'Amplifier X100',
          price: 299.99,
          link: '/products#amplifier-x100',
          img: product1,
        },
        {
          id: 2,
          name: 'Wireless Headphones',
          price: 199.99,
          link: '/products#wireless-headphones',
          img: product2,
        },
        {
          id: 3,
          name: 'Bluetooth Speaker',
          price: 149.99,
          link: '/products#bluetooth-speaker',
          img: product3,
        },
      ],
    }
  },
  computed: {
    cartQuantity() {
      const cartStore = useCartStore()
      return cartStore.cartQuantity
    },
    filteredSearchItems() {
      if (!this.searchQuery) return []
      return this.searchItems.filter((item) =>
        item.name.toLowerCase().includes(this.searchQuery.toLowerCase()),
      )
    },
  },
  methods: {
    openSearch() {
      this.searchActive = true
    },
    closeSearch() {
      this.searchActive = false
    },
    toggleMenu() {
      this.menuActive = !this.menuActive
    },
    closeMenu() {
      this.menuActive = false
    },
  },
}
</script>

<style lang="scss">
@use '@/assets/scss/main.scss' as *;

.navbar {
  background-color: #101311;
  padding: 1rem 0;
  .navbar__container {
    display: flex;
    align-items: center;
    justify-content: space-between;
    position: relative;
  }
  .navbar__logo {
    font-size: 2rem;
    color: #fff;
    display: flex;
    align-items: center;
    text-decoration: none;
    @media (max-width: 1020px) {
      font-size: 1.7rem;
    }
    @media (max-width: 576px) {
      padding: 0 1rem;
      font-size: 1.5rem;
      gap: 1.4rem;
      #store-name {
        display: none;
      }
    }
    .navbar__img {
      width: 70px;
      margin-left: 1rem;
      @media (max-width: 1020px) {
        margin-right: 1rem;
        width: 60px;
      }
      @media (max-width: 576px) {
        margin-left: 0;
        margin-right: 1.5rem;
      }
    }
  }
  .navbar__menu {
    display: flex;
    gap: 2rem;
    @media (max-width: 1020px) {
      padding: 0 1.6rem;
      gap: 1.5rem;
    }
    .navbar__link {
      color: #fff;
      text-decoration: none;
      font-size: 1.7rem;
      text-transform: uppercase;
      transition: color 0.3s;
      &:hover {
        color: #be9c79;
      }
      @media (max-width: 1020px) {
        font-size: 1.5rem;
      }
    }
    @media (max-width: 768px) {
      display: none;
    }
  }
  .navbar__toggle-btn {
    display: none;
    @media (max-width: 768px) {
      display: flex;
    }
  }
  .navbar__icons {
    display: flex;
    gap: 1rem;
    position: relative;

    @media (max-width: 768px) {
      gap: 0.5rem;
    }

    button {
      font-size: 1rem;
      width: 43px;
      height: 43px;
    }
    .navbar__cart-quantity {
      position: absolute;
      top: -10px;
      right: -10px;
      background-color: rgb(172, 48, 48);
      border-radius: 100px;
      padding: 0.2rem 0.5rem;
      font-size: 1.2rem;
      color: #fff;
      @media (max-width: 576px) {
        font-size: 0.9em;
        padding: 0.2rem 0.4rem;
      }
    }
  }
}

/* Mobile menu overlay */
.navbar__menu-mobile {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.9);
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;

  .navbar__menu-mobile-container {
    display: flex;
    flex-direction: column;
    gap: 2rem;
    text-transform: uppercase;
    font-family: 'Asul', sans-serif;

    .navbar__link {
      color: #ffffff;
      text-decoration: none;
      font-size: 2rem;
      text-align: center;
      transition: color 0.3s;
      &:hover {
        color: #b9834e;
        scale: 1.2;
        overflow: hidden;
      }
    }
  }
}

/* Fade transition for mobile menu */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
