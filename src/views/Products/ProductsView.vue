<template>
  <div>
    <NavbarComponent @toggle-cart="toggleCart" />
    <main class="products">
      <section class="products__header container">
        <h1 class="products__title">Products</h1>
        <p class="products__subtitle">Find the perfect audio equipment for you</p>
      </section>
      <section class="products__list container">
        <ProductCardComponent
          v-for="product in products"
          :key="product.id"
          :product="product"
          @add-to-cart="addToCart"
        />
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
import ProductCardComponent from '@/components/ProductCardComponent.vue'
import { useCartStore } from '@/stores/cartStore'

// Import images using ES modules not using require
import product1 from '@/assets/img/product1.jpg'
import product2 from '@/assets/img/product2.jpg'
import product3 from '@/assets/img/product3.jpg'

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
      products: [
        {
          id: 1,
          name: 'Amplifier X100',
          price: 299.99,
          imgSrc: product1,
          description: 'High-end audio amplifier.',
        },
        {
          id: 2,
          name: 'Bluetooth Speaker',
          price: 149.99,
          imgSrc: product2,
          description: 'Portable speaker with excellent sound quality.',
        },
        {
          id: 3,
          name: 'Wireless Headphones',
          price: 199.99,
          imgSrc: product3,
          description: 'Wireless headphones for professionals.',
        },
      ],
      cartVisible: false,
    }
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
