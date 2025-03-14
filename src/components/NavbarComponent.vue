<template>
  <header class="navbar">
    <div class="navbar__container container">
      <a href="index.html" class="navbar__logo">
        Audio Electronics
        <img src="@/assets/img/logo-audio.png" alt="Audio Electronics Logo" class="navbar__img" />
      </a>
      <nav :class="{ 'navbar__menu--active': menuActive }" class="navbar__menu">
        <a href="index.html" class="navbar__link">Home</a>
        <a href="about.html" class="navbar__link">About</a>
        <a href="products.html" class="navbar__link">Products</a>
        <a href="contact.html" class="navbar__link">Contact</a>
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
      // Example search items
      searchItems: [
        {
          id: 1,
          name: 'Amplifier X100',
          price: 299.99,
          link: 'products.html#amplifier-x100',
          img: product1,
        },
        {
          id: 2,
          name: 'Wireless Headphones',
          price: 199.99,
          link: 'products.html#wireless-headphones',
          img: product2,
        },
        {
          id: 3,
          name: 'Bluetooth Speaker',
          price: 149.99,
          link: 'products.html#bluetooth-speaker',
          img: product3,
        },
      ],
      cartQuantity: 0,
    }
  },
  computed: {
    filteredSearchItems() {
      if (!this.searchQuery) return []
      return this.searchItems.filter((item) =>
        item.name.toLowerCase().includes(this.searchQuery.toLowerCase()),
      )
    },
  },
  methods: {
    toggleMenu() {
      this.menuActive = !this.menuActive
    },
    openSearch() {
      this.searchActive = true
    },
    closeSearch() {
      this.searchActive = false
    },
  },
  mounted() {
    const cart = JSON.parse(localStorage.getItem('CART')) || []
    this.cartQuantity = cart.reduce((sum, item) => sum + item.quantity, 0)
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
      font-size: 1.8rem;
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
