<template>
  <article class="product-card">
    <header class="product-card__meta">
      <span class="product-card__index">No. {{ index }}</span>
      <span class="product-card__category">{{ category }}</span>
    </header>

    <router-link
      class="product-card__media"
      :to="detailsRoute"
      :aria-label="`View ${product.name}`"
      tabindex="-1"
    >
      <img
        ref="image"
        class="product-card__image"
        :src="product.imgSrc"
        :alt="product.name"
        loading="lazy"
        decoding="async"
      />
    </router-link>

    <div class="product-card__body">
      <h3 class="product-card__name">
        <router-link :to="detailsRoute">{{ product.name }}</router-link>
      </h3>
      <p class="product-card__description">{{ product.description }}</p>

      <dl class="product-card__specs">
        <div v-for="spec in specs" :key="spec.key" class="product-card__spec">
          <dt>{{ spec.label }}</dt>
          <dd>{{ spec.value }}</dd>
        </div>
      </dl>

      <footer class="product-card__footer">
        <p class="product-card__price"><span class="product-card__currency">$</span>{{ price }}</p>
        <div class="product-card__actions">
          <router-link class="product-card__details" :to="detailsRoute">
            Details<span class="product-card__arrow" aria-hidden="true">→</span>
          </router-link>
          <button
            ref="cartButton"
            type="button"
            class="product-card__cart"
            :aria-label="`Add ${product.name} to cart`"
            @click.stop="addToCart(product)"
          >
            <span ref="burst" class="product-card__burst" aria-hidden="true"></span>
            <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" focusable="false">
              <path
                d="M3 4h2.2l2.1 10.2a1.6 1.6 0 0 0 1.6 1.3h8.4a1.6 1.6 0 0 0 1.6-1.2L20.5 8H6.4"
                fill="none"
                stroke="currentColor"
                stroke-width="1.6"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <circle cx="9.5" cy="19.5" r="1.3" fill="currentColor" />
              <circle cx="17" cy="19.5" r="1.3" fill="currentColor" />
            </svg>
            <span class="product-card__cart-label">Add</span>
          </button>
        </div>
      </footer>
    </div>

    <!-- Light reflection that follows the cursor (desktop only, see useTilt) -->
    <div class="product-card__glare" aria-hidden="true">
      <span ref="glare" class="product-card__glare-light"></span>
    </div>
  </article>
</template>

<script>
import { useTilt } from '@/composables/useTilt'
import { prefersReducedMotion } from '@/composables/useMotionPreferences'
import { categoryOf, formatPrice, keySpecs, pad } from '@/views/Products/catalogue'

export default {
  name: 'ProductCardComponent',
  props: {
    product: {
      type: Object,
      required: true,
    },
  },
  // (product, imageElement) - the image lets the parent run the fly-to-cart animation
  emits: ['add-to-cart'],
  computed: {
    index() {
      return pad(this.product.id)
    },
    category() {
      return categoryOf(this.product)
    },
    specs() {
      // two real specs of this product instead of generic feature badges
      return keySpecs(this.product, 2)
    },
    price() {
      return formatPrice(this.product.price)
    },
    detailsRoute() {
      return { name: 'ProductDetailView', params: { id: this.product.id } }
    },
  },
  mounted() {
    // Not reactive on purpose - only needed for cleanup
    this.tilt = useTilt(this.$el, {
      max: 6,
      hoverScale: 1.015,
      layers: [
        // the photo drifts against the pointer and the cart button floats with it -> depth
        { el: this.$refs.image, depth: -8, scale: 1.06 },
        { el: this.$refs.cartButton, depth: 4 },
      ],
      glare: this.$refs.glare,
    })
  },
  beforeUnmount() {
    this.tilt?.destroy()
  },
  methods: {
    addToCart(product) {
      this.playPressFeedback()
      this.$emit('add-to-cart', product, this.$refs.image)
    },
    playPressFeedback() {
      const button = this.$refs.cartButton
      const burst = this.$refs.burst
      if (!button?.animate || prefersReducedMotion()) return
      // `scale` composes with the tilt's inline `transform` on the same element
      button.animate([{ scale: '1' }, { scale: '0.88' }, { scale: '1.06' }, { scale: '1' }], {
        duration: 460,
        easing: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
      })
      burst?.animate(
        [
          { transform: 'scale(0.9)', opacity: 0.8 },
          { transform: 'scale(1.6)', opacity: 0 },
        ],
        { duration: 600, easing: 'cubic-bezier(0.22, 1, 0.36, 1)' },
      )
    },
  },
}
</script>

<style lang="scss" scoped>
@use '@/assets/scss/tokens' as t;

$surface: #faf6f0;

// the global reset puts Roboto on every element (`*`); children inherit the serif/mono instead
.product-card * {
  font-family: inherit;
}

.product-card {
  position: relative;
  font-family: t.$font-body;
  display: flex;
  flex-direction: column;
  width: 100%;
  min-width: 0;
  padding: 1.1rem 1.1rem 1.25rem;
  background: $surface;
  border: 1px solid t.$line-on-light;
  border-radius: t.$radius-sm;
  color: t.$text-on-light;
  overflow: hidden;
  // keeps the clipping intact while children are transformed (Safari)
  isolation: isolate;
  transform-origin: center;
  transition:
    box-shadow 0.45s ease,
    border-color 0.45s ease;

  &.is-tilting {
    will-change: transform;
    border-color: rgba(t.$brass-dark, 0.35);
    box-shadow: t.$shadow-lift;

    .product-card__image,
    .product-card__cart {
      will-change: transform;
    }
  }

  &:focus-within {
    border-color: rgba(t.$brass-dark, 0.45);
  }
}

// --- top line: catalogue number + category ---------------------------------------------------
.product-card__meta {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  gap: 1rem;
  padding-bottom: 0.85rem;
  font-family: t.$font-mono;
  font-size: 0.72rem;
  letter-spacing: 0.14em;
  text-transform: uppercase;
}

.product-card__index {
  color: t.$brass-dark;
  font-weight: 500;
}

.product-card__category {
  color: t.$muted-on-light;
}

// --- photo ---------------------------------------------------------------------------------
.product-card__media {
  position: relative;
  display: block;
  aspect-ratio: 4 / 3;
  overflow: hidden;
  border-radius: 2px;
  background: t.$paper-2;
}

.product-card__image {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
  // a touch of warmth so very saturated photos sit better on paper
  filter: saturate(0.88) sepia(0.06);
  transition: filter 0.6s ease;

  .product-card:hover & {
    filter: none;
  }
}

// --- text ----------------------------------------------------------------------------------
.product-card__body {
  display: flex;
  flex: 1;
  flex-direction: column;
  padding-top: 1.25rem;
}

.product-card__name {
  font-family: t.$font-display;
  font-weight: 400;
  font-size: clamp(1.6rem, 1.3rem + 0.6vw, 1.95rem);
  line-height: 1.1;
  letter-spacing: -0.005em;

  a {
    font-family: inherit;
    color: inherit;
    text-decoration: none;
    background-image: linear-gradient(currentColor, currentColor);
    background-size: 0 1px;
    background-repeat: no-repeat;
    background-position: 0 100%;
    transition: background-size 0.5s t.$ease-out;

    &:hover,
    &:focus-visible {
      background-size: 100% 1px;
    }
  }
}

.product-card__description {
  margin-top: 0.6rem;
  font-size: 0.95rem;
  line-height: 1.55;
  color: t.$muted-on-light;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.product-card__specs {
  margin-top: 1.1rem;
  border-top: 1px solid t.$line-on-light;
}

.product-card__spec {
  display: grid;
  grid-template-columns: 7.5rem 1fr;
  gap: 0.75rem;
  padding: 0.5rem 0;
  border-bottom: 1px solid t.$line-on-light;
  font-family: t.$font-mono;
  font-size: 0.78rem;
  line-height: 1.4;

  dt {
    color: t.$muted-on-light;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    font-size: 0.68rem;
    padding-top: 0.1em;
  }

  dd {
    color: t.$text-on-light;
    min-width: 0;
  }
}

// --- price + actions -----------------------------------------------------------------------
.product-card__footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
  margin-top: auto;
  padding-top: 1.2rem;
}

.product-card__price {
  font-family: t.$font-mono;
  font-size: 1.35rem;
  font-weight: 500;
  letter-spacing: -0.01em;
  color: t.$text-on-light;
  white-space: nowrap;
}

.product-card__currency {
  font-size: 0.8em;
  margin-right: 0.15em;
  color: t.$brass-dark;
}

.product-card__actions {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.product-card__details {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  font-family: t.$font-mono;
  font-size: 0.78rem;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: t.$text-on-light;
  text-decoration: none;

  &:hover .product-card__arrow,
  &:focus-visible .product-card__arrow {
    translate: 4px 0;
  }
}

.product-card__arrow {
  display: inline-block;
  color: t.$brass-dark;
  transition: translate 0.35s t.$ease-out;
}

.product-card__cart {
  position: relative;
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  height: 2.5rem;
  padding: 0 0.9rem;
  border: 1px solid t.$brass;
  border-radius: t.$radius-sm;
  background: t.$brass;
  color: t.$ink;
  font-family: t.$font-mono;
  font-size: 0.76rem;
  font-weight: 500;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  cursor: pointer;
  transition:
    background-color 0.25s ease,
    border-color 0.25s ease;

  &:hover {
    background: t.$brass-light;
    border-color: t.$brass-light;
  }

  &:focus-visible {
    outline: 2px solid t.$brass-dark;
    outline-offset: 2px;
  }

  svg {
    flex-shrink: 0;
  }
}

// ring that bursts out when a product is added (played with the Web Animations API)
.product-card__burst {
  position: absolute;
  inset: -1px;
  border-radius: inherit;
  border: 1px solid t.$brass-dark;
  opacity: 0;
  pointer-events: none;
}

// --- glare ---------------------------------------------------------------------------------
.product-card__glare {
  position: absolute;
  inset: 0;
  border-radius: inherit;
  overflow: hidden;
  pointer-events: none;
  z-index: 5;
  mix-blend-mode: soft-light;
}

.product-card__glare-light {
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: radial-gradient(
    circle at center,
    rgba(255, 250, 240, 0.7) 0%,
    rgba(255, 250, 240, 0.2) 22%,
    rgba(255, 250, 240, 0) 45%
  );
  opacity: 0;
  will-change: transform, opacity;
}

@media (max-width: 420px) {
  .product-card__spec {
    grid-template-columns: 6.5rem 1fr;
  }
}

@media (prefers-reduced-motion: reduce) {
  .product-card,
  .product-card__image,
  .product-card__arrow,
  .product-card__cart,
  .product-card__name a {
    transition: none;
  }
}
</style>
