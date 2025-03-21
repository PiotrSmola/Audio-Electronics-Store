<template>
  <div>
    <NavbarComponent @toggle-cart="toggleCart" />
    <div class="product-details-body">
      <div class="product-details">
        <div class="product-details__container">
          <div class="product-details__content">
            <div class="product-details__images">
              <div class="product-details__main-image">
                <img :src="selectedImage" :alt="product.name" />
              </div>
              <div class="product-details__thumbnails">
                <div
                  v-for="(image, index) in product.images"
                  :key="index"
                  class="product-details__thumbnail"
                  :class="{ 'product-details__thumbnail--active': selectedImageIndex === index }"
                  @click="selectImage(index)"
                >
                  <img :src="image" :alt="`${product.name} thumbnail ${index + 1}`" />
                </div>
              </div>
            </div>
            <div class="product-details__info">
              <h1 class="product-details__title">{{ product.name }}</h1>
              <div class="product-details__price">${{ product.price.toFixed(2) }}</div>
              <p class="product-details__description">{{ product.description }}</p>
              <button class="product-details__add-to-cart-btn" @click="addToCart(product)">
                Add to Cart
              </button>

              <div class="product-details__specs">
                <h2 class="product-details__subtitle">Specifications</h2>
                <table class="product-details__specs-table">
                  <tbody>
                    <tr v-for="(value, key) in product.specifications" :key="key">
                      <th>{{ formatSpecKey(key) }}</th>
                      <td>{{ value }}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <div class="product-details__reviews">
            <h2 class="product-details__subtitle">Customer Reviews</h2>
            <div class="product-details__reviews-summary">
              <div class="product-details__avg-rating">
                <span class="product-details__avg-rating-value">{{
                  averageRating.toFixed(1)
                }}</span>
                <div class="product-details__stars">
                  <div
                    class="product-details__stars-filled"
                    :style="{ width: `${averageRating * 20}%` }"
                  >
                    ★★★★★
                  </div>
                  <div class="product-details__stars-empty">★★★★★</div>
                </div>
                <span class="product-details__reviews-count"
                  >{{ product.reviews.length }} reviews</span
                >
              </div>
            </div>

            <div class="product-details__reviews-list">
              <div
                v-for="(review, index) in product.reviews"
                :key="index"
                class="product-details__review"
              >
                <h3 class="product-details__review-title">{{ review.title }}</h3>
                <div class="product-details__review-info">
                  <span class="product-details__review-author">{{ review.author }}</span>
                  <div class="product-details__review-rating">
                    <div class="product-details__stars">
                      <div
                        class="product-details__stars-filled"
                        :style="{ width: `${review.rating * 20}%` }"
                      >
                        ★★★★★
                      </div>
                      <div class="product-details__stars-empty">★★★★★</div>
                    </div>
                  </div>
                </div>
                <p class="product-details__review-text">{{ review.comment }}</p>
              </div>
            </div>
          </div>

          <div class="product-details__related">
            <h2 class="product-details__subtitle">You might also like</h2>
            <div class="product-details__related-list">
              <ProductCardComponent
                v-for="relatedProduct in relatedProducts"
                :key="relatedProduct.id"
                :product="relatedProduct"
                @add-to-cart="addToCart"
              />
            </div>
          </div>
        </div>
      </div>
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

import mainImage from '@/assets/img/product1.jpg'
import secondImage from '@/assets/img/product2.jpg'
import thirdImage from '@/assets/img/product3.jpg'
import fourthImage from '@/assets/img/product4.jpg'

export default {
  name: 'ProductDetailView',
  components: {
    NavbarComponent,
    FooterComponent,
    ShoppingCartComponent,
    ProductCardComponent,
  },
  data() {
    return {
      selectedImageIndex: 0,
      cartVisible: false,
      productsData: [
        {
          id: 1,
          name: 'Amplifier X100',
          price: 299.99,
          imgSrc: mainImage,
          images: [mainImage, secondImage, thirdImage, fourthImage],
          description:
            'High-end audio amplifier with crystal clear sound reproduction and powerful output for audiophiles. The X100 delivers superior audio performance with its high-quality components and advanced circuitry. Perfect for music enthusiasts who demand nothing but the best sound quality.',
          specifications: {
            power: '100W per channel',
            impedance: '4-16 ohms',
            frequency: '20Hz - 20kHz',
            dimensions: '17.3" x 4.1" x 13.8"',
            weight: '22 lbs',
            inputs: '3 RCA, 1 XLR, 1 Digital Optical',
            outputs: '2 Speaker terminals, 1 Headphone jack',
            warranty: '3 years',
          },
          reviews: [
            {
              title: 'Excellent Sound Quality',
              author: 'AudioEnthusiast',
              rating: 5,
              comment:
                'This amplifier exceeded my expectations. The sound is incredibly detailed and the power handling is impressive. Works perfectly with my bookshelf speakers. Highly recommended!',
            },
            {
              title: 'Worth Every Penny',
              author: 'MusicLover42',
              rating: 4,
              comment:
                'Great amplifier that delivers clear and powerful sound. The build quality is excellent and it looks gorgeous in my setup. Only reason for 4 stars is that it runs a bit hot after long sessions.',
            },
            {
              title: 'Impressive Clarity',
              author: 'SoundEngineer',
              rating: 5,
              comment:
                "As a professional sound engineer, I'm very picky about my audio equipment. This amplifier provides exceptional clarity and detail. The dynamics are preserved beautifully and the soundstage is impressive.",
            },
          ],
        },
        {
          id: 2,
          name: 'Bluetooth Speaker',
          price: 149.99,
          imgSrc: mainImage,
          images: [mainImage, secondImage, thirdImage, fourthImage],
          description:
            'Portable speaker with excellent sound quality and long-lasting battery life for your outdoor adventures. Take your music anywhere with this rugged, water-resistant speaker that delivers impressive sound in a compact package.',
          specifications: {
            power: '30W',
            batteryLife: 'Up to 20 hours',
            bluetooth: 'Bluetooth 5.0',
            waterResistance: 'IPX7',
            dimensions: '8.5" x 3.6" x 3.6"',
            weight: '2.5 lbs',
            inputs: 'Bluetooth, 3.5mm AUX',
            charging: 'USB-C',
            warranty: '2 years',
          },
          reviews: [
            {
              title: 'Great Sound for the Size',
              author: 'OutdoorFan',
              rating: 5,
              comment:
                'I take this speaker everywhere - camping, beach trips, backyard parties. The sound is impressive for its size and the battery lasts all day. The water resistance has saved it multiple times!',
            },
            {
              title: 'Solid Build, Good Sound',
              author: 'TechReviewer',
              rating: 4,
              comment:
                'This speaker packs a punch with solid bass and clear highs. Build quality is excellent and the controls are intuitive. Battery life is as advertised. Only giving 4 stars because the companion app is a bit buggy.',
            },
            {
              title: 'Perfect Travel Companion',
              author: 'FrequentTraveler',
              rating: 5,
              comment:
                "I've taken this speaker on multiple trips and it hasn't let me down. Sound quality is great for hotel rooms and small gatherings. The battery life is impressive, easily lasting through a weekend trip.",
            },
          ],
        },
      ],
    }
  },
  computed: {
    productId() {
      // Take product ID from query params
      return parseInt(this.$route.query.id) || 1
    },
    product() {
      // Find product by ID or return first one as default
      return this.productsData.find((p) => p.id === this.productId) || this.productsData[0]
    },
    selectedImage() {
      return this.product.images[this.selectedImageIndex]
    },
    relatedProducts() {
      // Take 3 related products (excluding current product)
      return this.productsData.filter((p) => p.id !== this.productId).slice(0, 3)
    },
    averageRating() {
      const sum = this.product.reviews.reduce((total, review) => total + review.rating, 0)
      return sum / this.product.reviews.length
    },
  },
  methods: {
    selectImage(index) {
      this.selectedImageIndex = index
    },
    addToCart(product) {
      const cartStore = useCartStore()
      cartStore.addProduct(product)
      alert(`Added ${product.name} to cart!`)
    },
    toggleCart() {
      this.cartVisible = !this.cartVisible
    },
    formatSpecKey(key) {
      return key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1')
    },
  },
}
</script>
<style lang="scss" src="./ProductDetails.scss"></style>
