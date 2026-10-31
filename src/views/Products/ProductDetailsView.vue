<template>
  <div v-if="product" class="product-details-body">
    <div class="product-details">
      <!-- Keyed by product: switching products (e.g. "You might also like") fades the old page
           out and replays every entrance for the new one -->
      <Transition name="pd-swap" mode="out-in" @enter="onProductEnter">
        <div :key="product.id" class="product-details__container">
          <!-- 1. Gallery + buying column -->
          <section class="product-details__top">
            <div class="product-details__wrap">
              <nav class="product-details__crumbs" aria-label="Breadcrumb">
                <router-link :to="{ name: 'ProductsView' }">Catalogue</router-link>
                <span aria-hidden="true">/</span>
                <span>{{ category }}</span>
                <span aria-hidden="true">/</span>
                <span aria-current="page">No. {{ catalogueNumber }}</span>
              </nav>

              <div class="product-details__content">
                <div class="product-details__images">
                  <div
                    ref="mainImage"
                    class="product-details__main-image"
                    :class="{ 'is-zooming': zooming }"
                    @pointerenter="onZoomEnter"
                    @pointermove="onZoomMove"
                    @pointerleave="onZoomLeave"
                  >
                    <div ref="zoomLayer" class="product-details__zoom">
                      <Transition name="pd-crossfade">
                        <img :key="selectedImage" :src="selectedImage" :alt="product.name" />
                      </Transition>
                    </div>
                    <span class="product-details__image-count" aria-hidden="true"
                      >{{ pad(selectedImageIndex + 1) }} / {{ pad(product.images.length) }}</span
                    >
                  </div>
                  <div ref="thumbnails" class="product-details__thumbnails">
                    <div
                      v-for="(image, index) in product.images"
                      :key="index"
                      class="product-details__thumbnail"
                      :class="{
                        'product-details__thumbnail--active': selectedImageIndex === index,
                      }"
                      :style="{ '--thumb-index': index }"
                      role="button"
                      tabindex="0"
                      :aria-label="`Show image ${index + 1} of ${product.name}`"
                      :aria-pressed="selectedImageIndex === index ? 'true' : 'false'"
                      @click="selectImage(index)"
                      @keydown.enter.prevent="selectImage(index)"
                      @keydown.space.prevent="selectImage(index)"
                    >
                      <img :src="image" :alt="`${product.name} thumbnail ${index + 1}`" />
                    </div>
                    <!-- Frame that glides to the active thumbnail -->
                    <span
                      class="product-details__thumb-indicator"
                      :class="{ 'is-ready': indicatorReady }"
                      :style="indicatorStyle"
                      aria-hidden="true"
                    ></span>
                  </div>
                </div>

                <div class="product-details__info">
                  <p class="ae-eyebrow product-details__eyebrow">
                    No. {{ catalogueNumber }} — {{ category }}
                  </p>
                  <h1 class="product-details__title ae-display">{{ product.name }}</h1>
                  <div class="product-details__price-row">
                    <p class="product-details__price">
                      <span class="product-details__currency">$</span>{{ price }}
                    </p>
                    <a
                      class="product-details__rating-link"
                      href="#reviews"
                      @click.prevent="toReviews"
                      ><span aria-hidden="true">★</span> {{ averageRating.toFixed(1) }} ·
                      {{ product.reviews.length }} reviews</a
                    >
                  </div>
                  <p class="product-details__description">
                    {{ product.fullDescription || product.description }}
                  </p>
                  <div class="product-details__actions">
                    <button
                      type="button"
                      class="product-details__add-to-cart-btn"
                      @click="addToCart(product)"
                    >
                      Add to cart
                    </button>
                    <router-link class="product-details__back" :to="{ name: 'ProductsView' }"
                      >← Catalogue</router-link
                    >
                  </div>
                  <dl class="product-details__glance">
                    <div
                      v-for="spec in glanceSpecs"
                      :key="spec.key"
                      class="product-details__glance-row"
                    >
                      <dt>{{ spec.label }}</dt>
                      <dd>{{ spec.value }}</dd>
                    </div>
                  </dl>
                </div>
              </div>
            </div>
          </section>

          <!-- 2. Spec plate -->
          <section class="product-details__specs ae-grain">
            <div class="product-details__wrap product-details__specs-grid">
              <div class="product-details__section-head">
                <p v-appear class="ae-eyebrow">02 — Specification</p>
                <h2 v-appear class="product-details__subtitle ae-display">
                  The <em>technical</em> sheet
                </h2>
                <p v-appear class="product-details__section-note">
                  Everything from the back panel and the manual, on one plate.
                </p>
              </div>

              <div v-appear="'fade'" class="product-details__plate">
                <span
                  v-for="corner in 4"
                  :key="corner"
                  class="product-details__screw"
                  :class="`product-details__screw--${corner}`"
                  aria-hidden="true"
                ></span>
                <div class="product-details__plate-head">
                  <span>Audio Electronics</span>
                  <span>Model AE-{{ catalogueNumber }}</span>
                </div>
                <p class="product-details__plate-name">{{ product.name }}</p>
                <dl class="product-details__specs-table">
                  <div
                    v-for="spec in specs"
                    :key="spec.key"
                    v-appear="'left'"
                    class="product-details__spec-row"
                  >
                    <dt>{{ spec.label }}</dt>
                    <dd>{{ spec.value }}</dd>
                  </div>
                </dl>
              </div>
            </div>
          </section>

          <!-- 3. Reviews -->
          <section id="reviews" ref="reviews" class="product-details__reviews">
            <div class="product-details__wrap product-details__reviews-grid">
              <div class="product-details__reviews-summary">
                <p v-appear class="ae-eyebrow">03 — Listening notes</p>
                <h2 v-appear class="product-details__subtitle ae-display">
                  What <em>listeners</em> say
                </h2>
                <div class="product-details__avg-rating">
                  <span class="product-details__avg-rating-value">{{
                    displayedRating.toFixed(1)
                  }}</span>
                  <div class="product-details__avg-rating-meta">
                    <div
                      v-appear="{ variant: 'none', onVisible: animateRating }"
                      class="product-details__stars"
                      :style="{ '--rating-fill': `${averageRating * 20}%` }"
                      :aria-label="`Rated ${averageRating.toFixed(1)} out of 5`"
                      role="img"
                    >
                      <div class="product-details__stars-filled" aria-hidden="true">★★★★★</div>
                      <div class="product-details__stars-empty" aria-hidden="true">★★★★★</div>
                    </div>
                    <span class="product-details__reviews-count"
                      >{{ pad(product.reviews.length) }} reviews</span
                    >
                  </div>
                </div>
                <!-- rating distribution, drawn like a row of level meters -->
                <ul
                  v-appear="'none'"
                  class="product-details__distribution"
                  aria-label="Rating distribution"
                >
                  <li v-for="row in ratingDistribution" :key="row.stars">
                    <span class="product-details__distribution-label">{{ row.stars }}★</span>
                    <span class="product-details__distribution-bar"
                      ><span :style="{ '--level': row.share }"></span
                    ></span>
                    <span class="product-details__distribution-count">{{ row.count }}</span>
                  </li>
                </ul>
              </div>

              <div class="product-details__reviews-list">
                <article
                  v-for="(review, index) in product.reviews"
                  :key="index"
                  v-appear
                  class="product-details__review"
                >
                  <h3 class="product-details__review-title">{{ review.title }}</h3>
                  <p class="product-details__review-text">{{ review.comment }}</p>
                  <div class="product-details__review-info">
                    <span class="product-details__review-author">— {{ review.author }}</span>
                    <div class="product-details__review-rating">
                      <div
                        v-appear="'none'"
                        class="product-details__stars"
                        :style="{ '--rating-fill': `${review.rating * 20}%` }"
                        :aria-label="`Rated ${review.rating} out of 5`"
                        role="img"
                      >
                        <div class="product-details__stars-filled" aria-hidden="true">★★★★★</div>
                        <div class="product-details__stars-empty" aria-hidden="true">★★★★★</div>
                      </div>
                    </div>
                  </div>
                </article>
              </div>
            </div>
          </section>

          <!-- 4. Related -->
          <section class="product-details__related">
            <StaffDividerComponent class="product-details__staff" tone="dark" />
            <div class="product-details__wrap">
              <div class="product-details__related-head">
                <div>
                  <p v-appear class="ae-eyebrow">04 — Also in the catalogue</p>
                  <h2 v-appear class="product-details__subtitle ae-display">
                    You might <em>also</em> like
                  </h2>
                </div>
                <router-link class="product-details__back" :to="{ name: 'ProductsView' }"
                  >All products →</router-link
                >
              </div>
              <div class="product-details__related-list">
                <ProductCardComponent
                  v-for="relatedProduct in relatedProducts"
                  :key="relatedProduct.id"
                  v-appear="'rise'"
                  :product="relatedProduct"
                  @add-to-cart="addRelatedToCart"
                />
              </div>
            </div>
          </section>
        </div>
      </Transition>
    </div>
  </div>
</template>

<script>
import ProductCardComponent from '@/components/ProductCardComponent.vue'
import StaffDividerComponent from '@/components/decor/StaffDividerComponent.vue'
import { useAddToCart } from '@/composables/useAddToCart'
import { appearDirective } from '@/composables/useAppear'
import { tweenNumber } from '@/composables/useAnimatedNumber'
import { hasFinePointer, prefersReducedMotion } from '@/composables/useMotionPreferences'
import { products, getProductById } from '@/data/products'
import { categoryOf, formatPrice, formatSpecKey, keySpecs, pad } from './catalogue'

const RELATED_PRODUCTS_COUNT = 3

export default {
  name: 'ProductDetailView',
  components: {
    ProductCardComponent,
    StaffDividerComponent,
  },
  directives: {
    appear: appearDirective,
  },
  data() {
    return {
      selectedImageIndex: 0,
      zooming: false,
      indicatorStyle: {},
      indicatorReady: false,
      // Average rating shown next to the stars: counts up from 0 when the summary scrolls into
      // view (with reduced motion the tween reports the final value immediately)
      displayedRating: 0,
    }
  },
  computed: {
    productId() {
      // Product ID comes from the route: /products/:id
      return Number(this.$route.params.id)
    },
    product() {
      // Unknown ids are redirected to the 404 page by the router (see router/index.js)
      return getProductById(this.productId)
    },
    selectedImage() {
      return this.product.images[this.selectedImageIndex] || this.product.imgSrc
    },
    relatedProducts() {
      // The next products in the catalogue (wrapping around), excluding the current one
      const index = products.findIndex((p) => p.id === this.productId)
      return Array.from(
        { length: RELATED_PRODUCTS_COUNT },
        (_, offset) => products[(index + offset + 1) % products.length],
      ).filter((p) => p.id !== this.productId)
    },
    catalogueNumber() {
      return pad(this.product.id)
    },
    category() {
      return categoryOf(this.product)
    },
    price() {
      return formatPrice(this.product.price)
    },
    specs() {
      return Object.entries(this.product.specifications || {}).map(([key, value]) => ({
        key,
        label: formatSpecKey(key),
        value,
      }))
    },
    glanceSpecs() {
      // three characteristic specs plus the warranty, right under the buy button
      const glance = keySpecs(this.product, 3)
      const warranty = this.product.specifications?.warranty
      return warranty
        ? [...glance, { key: 'warranty', label: 'Warranty', value: warranty }]
        : glance
    },
    ratingDistribution() {
      const total = this.product.reviews.length || 1
      return [5, 4, 3, 2, 1].map((stars) => {
        const count = this.product.reviews.filter((r) => Math.round(r.rating) === stars).length
        return { stars, count, share: (count / total).toFixed(3) }
      })
    },
    averageRating() {
      const sum = this.product.reviews.reduce((total, review) => total + review.rating, 0)
      return sum / this.product.reviews.length
    },
  },
  watch: {
    productId() {
      // The component is reused when navigating between products - reset the page state.
      // The keyed container re-mounts, so every entrance animation replays for the new product.
      this.selectedImageIndex = 0
      this.zooming = false
      this.indicatorReady = false
      this.cancelRatingTween?.()
      this.displayedRating = 0
    },
    selectedImageIndex() {
      this.$nextTick(this.updateIndicator)
    },
  },
  mounted() {
    this.updateIndicator()
    window.addEventListener('resize', this.updateIndicator, { passive: true })
  },
  beforeUnmount() {
    window.removeEventListener('resize', this.updateIndicator)
    if (this.zoomFrame) cancelAnimationFrame(this.zoomFrame)
    this.cancelRatingTween?.()
  },
  methods: {
    pad,
    selectImage(index) {
      this.selectedImageIndex = index
    },
    addToCart(product) {
      // The image flies from the main photo (the one currently displayed) into the cart
      useAddToCart().addToCart(product, this.$refs.mainImage, { imageSrc: this.selectedImage })
    },
    addRelatedToCart(product, imageEl) {
      useAddToCart().addToCart(product, imageEl)
    },
    toReviews() {
      this.$refs.reviews?.scrollIntoView({
        behavior: prefersReducedMotion() ? 'auto' : 'smooth',
      })
    },

    // --- product switch ---------------------------------------------------------------------
    onProductEnter() {
      // the new gallery is in the DOM now - place the thumbnail frame without sliding
      this.$nextTick(this.updateIndicator)
    },

    // --- thumbnail indicator ----------------------------------------------------------------
    updateIndicator() {
      const thumbnails = this.$refs.thumbnails?.querySelectorAll('.product-details__thumbnail')
      const active = thumbnails?.[this.selectedImageIndex]
      if (!active) return
      this.indicatorStyle = {
        width: `${active.offsetWidth}px`,
        height: `${active.offsetHeight}px`,
        transform: `translate(${active.offsetLeft}px, ${active.offsetTop}px)`,
      }
      if (!this.indicatorReady) {
        // enable the glide only after the first placement (no slide-in from the corner)
        requestAnimationFrame(() => {
          this.indicatorReady = true
        })
      }
    },

    // --- hover zoom (desktop only) ----------------------------------------------------------
    onZoomEnter(event) {
      if (event.pointerType === 'touch' || !hasFinePointer() || prefersReducedMotion()) return
      this.zooming = true
      this.onZoomMove(event)
    },
    onZoomMove(event) {
      if (!this.zooming) return
      const rect = this.$refs.mainImage.getBoundingClientRect()
      this.zoomOrigin = {
        x: ((event.clientX - rect.left) / rect.width) * 100,
        y: ((event.clientY - rect.top) / rect.height) * 100,
      }
      if (this.zoomFrame) return
      this.zoomFrame = requestAnimationFrame(() => {
        this.zoomFrame = 0
        const layer = this.$refs.zoomLayer
        if (layer && this.zoomOrigin) {
          layer.style.transformOrigin = `${this.zoomOrigin.x.toFixed(2)}% ${this.zoomOrigin.y.toFixed(2)}%`
        }
      })
    },
    onZoomLeave() {
      this.zooming = false
    },

    // --- rating count-up --------------------------------------------------------------------
    animateRating() {
      this.cancelRatingTween?.()
      this.cancelRatingTween = tweenNumber({
        from: 0,
        to: this.averageRating,
        duration: 1400,
        onUpdate: (value) => {
          this.displayedRating = value
        },
      })
    },
  },
}
</script>
<style lang="scss" src="./ProductDetails.scss"></style>
