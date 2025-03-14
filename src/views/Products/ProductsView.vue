<template>
  <div>
    <NavBar />
    <main class="products">
      <section class="products__header container">
        <h1 class="products__title">Produkty</h1>
        <p class="products__subtitle">Znajdź idealny sprzęt audio dla siebie</p>
      </section>
      <section class="products__list container">
        <ProductCard
          v-for="product in products"
          :key="product.id"
          :product="product"
          @add-to-cart="addToCart"
        />
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
import ProductCardComponent from '@/components/ProductCardComponent.vue'

export default {
  name: 'ProductsView',
  components: { NavbarComponent, FooterComponent, ShoppingCartComponent, ProductCardComponent },
  data() {
    return {
      products: [
        {
          id: 1,
          name: 'Wzmacniacz audio',
          price: 299.99,
          imgSrc: require('@/assets/img/products/amplifier.jpg'),
          description: 'Wysokiej klasy wzmacniacz audio.',
        },
        {
          id: 2,
          name: 'Głośnik Bluetooth',
          price: 149.99,
          imgSrc: require('@/assets/img/products/bluetooth_speaker.jpg'),
          description: 'Przenośny głośnik o doskonałej jakości dźwięku.',
        },
        {
          id: 3,
          name: 'Słuchawki studyjne',
          price: 199.99,
          imgSrc: require('@/assets/img/products/studio_headphones.jpg'),
          description: 'Słuchawki dla profesjonalistów.',
        },
      ],
    }
  },
  methods: {
    addToCart(product) {
      let cart = JSON.parse(localStorage.getItem('CART')) || []
      const exists = cart.find((item) => item.id === product.id)
      if (exists) {
        exists.quantity++
      } else {
        cart.push({ ...product, quantity: 1 })
      }
      localStorage.setItem('CART', JSON.stringify(cart))
      alert(`Dodano ${product.name} do koszyka!`)
    },
  },
}
</script>

<style lang="scss" src="./Products.scss"></style>
