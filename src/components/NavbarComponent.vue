<template>
  <header class="navbar">
    <div class="navbar__container container">
      <router-link to="/" class="navbar__logo">
        Audio Electronics
        <img src="@/assets/img/logo-audio.png" alt="Audio Electronics Logo" class="navbar__img" />
      </router-link>
      <nav :class="{ 'navbar__menu--active': menuActive }" class="navbar__menu">
        <router-link to="/" class="navbar__link">Home</router-link>
        <router-link to="/about" class="navbar__link">About</router-link>
        <router-link to="/products" class="navbar__link">Products</router-link>
        <router-link to="/contact" class="navbar__link">Contact</router-link>
      </nav>
      <div class="navbar__icons">
        <v-btn icon class="navbar__search-btn" @click="openSearch">
          <v-icon>mdi-magnify</v-icon>
        </v-btn>
        <v-btn icon class="navbar__cart-btn" @click="$emit('toggle-cart')">
          <v-icon>mdi-cart</v-icon>
          <span class="navbar__cart-quantity">{{ cartQuantity }}</span>
        </v-btn>
      </div>
    </div>

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

// Example image imports for search
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
    // Use Pinia to calculate the total number of products in the cart
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
  }
  .navbar__logo {
    font-size: 2rem;
    color: #fff;
    display: flex;
    align-items: center;
    text-decoration: none;
    .navbar__img {
      width: 50px;
      margin-left: 0.5rem;
    }
  }
  .navbar__menu {
    display: flex;
    gap: 2rem;
    .navbar__link {
      color: #fff;
      text-decoration: none;
      font-size: 1.7rem;
      transition: color 0.3s;
      &:hover {
        color: #be9c79;
      }
    }
    @media (max-width: 768px) {
      display: none;
    }
  }
  .navbar__menu--active {
    display: flex;
    flex-direction: column;
    position: fixed;
    top: 8vh;
    left: 0;
    width: 100%;
    height: 92vh;
    background-color: #fff;
    text-transform: uppercase;
    font-family: 'Asul', sans-serif;
    padding: 5em 0 0 1.5em;
  }
  .navbar__icons {
    display: flex;
    gap: 1rem;
    position: relative;
    .navbar__cart-quantity {
      position: absolute;
      top: -10px;
      right: -10px;
      background-color: rgb(172, 48, 48);
      border-radius: 100px;
      padding: 0.2rem 0.5rem;
      font-size: 1.2rem;
      color: #fff;
    }
  }
}
</style>
