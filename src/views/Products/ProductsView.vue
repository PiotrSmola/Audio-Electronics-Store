<template>
  <div>
    <NavbarComponent @toggle-cart="toggleCart" />
    <div class="products-body">
      <header class="header-products">
        <div class="header-products__bgc">
          <div class="header-products__body container">
            <p class="header-products__text">Exclusive Deals on Premium Audio Equipment</p>
            <h1 class="header-products__heading">Experience Superior Sound</h1>
            <a class="header-products__link" href="#products">See Our Products</a>
          </div>
        </div>
      </header>
      <main class="products" id="products">
        <div class="products__container">
          <section class="products__header container">
            <h1 class="products__header__title">Products</h1>
            <p class="products__header__subtitle">
              Find the perfect audio equipment for you. Our extensive collection caters to every
              audiophile's needs, ensuring that you discover the ideal blend of performance and
              style for your personal setup.
            </p>
          </section>
          <section class="products__list container">
            <ProductCardComponent
              v-for="product in displayedProducts"
              :key="product.id"
              :product="product"
              @add-to-cart="addToCart"
            />
          </section>
          <div
            class="products__load-more"
            v-if="!showAllProducts && products.length > initialProductCount"
          >
            <button class="see-all-button" @click="showAllProducts = true">See All Products</button>
          </div>
        </div>
      </main>
    </div>
    <FooterComponent />
    <ShoppingCartComponent v-if="cartVisible" @close="cartVisible = false" />
  </div>
</template>

<script>
import NavbarComponent from '@/components/NavbarComponent.vue'
import FooterComponent from '@/components/FooterComponent.vue'
import ShoppingCartComponent from '@/components/ShoppingCartComponent.vue'
import ProductCardComponent from '@/components/ProductCardComponent.vue'
import { useCartStore } from '@/stores/cartStore'

// Import images using ES modules not using require
import product1 from '@/assets/img/product1.jpg'
import product2 from '@/assets/img/product2.jpg'
import product3 from '@/assets/img/product3.jpg'
import product4 from '@/assets/img/product4.jpg'
import product5 from '@/assets/img/product5.jpg'
import product6 from '@/assets/img/product6.jpg'
import product7 from '@/assets/img/product7.jpg'
import product8 from '@/assets/img/product8.jpg'
import product9 from '@/assets/img/product9.jpg'

export default {
  name: 'ProductsView',
  components: {
    NavbarComponent,
    FooterComponent,
    ShoppingCartComponent,
    ProductCardComponent,
  },
  data() {
    return {
      initialProductCount: 6,
      showAllProducts: false,
      products: [
        {
          id: 1,
          name: 'Amplifier X100',
          price: 299.99,
          imgSrc: product1,
          description:
            'High-end audio amplifier with crystal clear sound reproduction and powerful output for audiophiles.',
        },
        {
          id: 2,
          name: 'Bluetooth Speaker',
          price: 149.99,
          imgSrc: product2,
          description:
            'Portable speaker with excellent sound quality and long-lasting battery life for your outdoor adventures.',
        },
        {
          id: 3,
          name: 'Wireless Headphones',
          price: 199.99,
          imgSrc: product3,
          description:
            'Premium wireless headphones for professionals with noise cancellation and studio-quality sound.',
        },
        {
          id: 4,
          name: 'Soundbar Pro',
          price: 249.99,
          imgSrc: product4,
          description:
            'Sleek soundbar that delivers immersive audio experience for your home theater setup.',
        },
        {
          id: 5,
          name: 'Studio Headphones',
          price: 349.99,
          imgSrc: product5,
          description:
            'Professional studio headphones with precise sound reproduction for music production.',
        },
        {
          id: 6,
          name: 'Turntable Classic',
          price: 179.99,
          imgSrc: product6,
          description:
            'Vintage-inspired turntable with modern technology for vinyl enthusiasts and collectors.',
        },
        {
          id: 7,
          name: 'Digital Mixer',
          price: 399.99,
          imgSrc: product7,
          description:
            'Advanced digital mixer with multiple channels and effects for live performances.',
        },
        {
          id: 8,
          name: 'Bass Speaker',
          price: 279.99,
          imgSrc: product8,
          description:
            'Powerful bass speaker that adds depth to your music with clear low frequencies. Perfect for parties.',
        },
        {
          id: 9,
          name: 'DJ Controller',
          price: 329.99,
          imgSrc: product9,
          description:
            'Professional DJ controller with intuitive controls and seamless integration with popular DJ software.',
        },
      ],
      cartVisible: false,
    }
  },
  computed: {
    displayedProducts() {
      if (this.showAllProducts) {
        return this.products
      } else {
        return this.products.slice(0, this.initialProductCount)
      }
    },
  },
  methods: {
    addToCart(product) {
      const cartStore = useCartStore()
      cartStore.addProduct(product)
      alert(`Added ${product.name} to cart!`)
    },
    toggleCart() {
      this.cartVisible = !this.cartVisible
    },
  },
}
</script>

<style lang="scss" src="./Products.scss"></style>
