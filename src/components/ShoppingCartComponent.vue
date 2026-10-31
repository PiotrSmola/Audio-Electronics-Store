<template>
  <!-- Dimmed, blurred page behind the open cart; clicking it closes the cart -->
  <div
    class="shopping-cart-backdrop"
    :class="{ 'shopping-cart-backdrop--active': isOpen }"
    aria-hidden="true"
    @click="closeCart"
  ></div>
  <!-- Always mounted: the slide-in/out transition is driven by the --active class -->
  <aside
    class="shopping-cart"
    :class="{ 'shopping-cart--active': isOpen }"
    :aria-hidden="isOpen ? 'false' : 'true'"
    aria-label="Shopping cart"
  >
    <header class="shopping-cart__header">
      <div>
        <p class="shopping-cart__eyebrow">
          {{ String(itemCount).padStart(2, '0') }} {{ itemCount === 1 ? 'item' : 'items' }}
        </p>
        <h2 class="shopping-cart__title">Your cart</h2>
      </div>
      <button
        type="button"
        class="shopping-cart__dismiss"
        aria-label="Close cart"
        @click="closeCart"
      >
        <v-icon size="20">mdi-close</v-icon>
      </button>
    </header>

    <div class="shopping-cart__body">
      <TransitionGroup
        ref="itemList"
        tag="ul"
        name="cart-item"
        class="shopping-cart__items"
        @leave="onItemLeave"
      >
        <li v-for="item in cartItems" :key="item.id" :data-id="item.id" class="shopping-cart__item">
          <img :src="item.imgSrc" :alt="item.name" class="shopping-cart__img" />
          <div class="shopping-cart__info">
            <span class="shopping-cart__name">{{ item.name }}</span>
            <span class="shopping-cart__unit">{{ formatPrice(item.price) }} each</span>
            <div class="shopping-cart__quantity">
              <button
                type="button"
                class="changeQuantity"
                :aria-label="`Decrease quantity of ${item.name}`"
                @click="changeQuantity('minus', item)"
              >
                <v-icon size="14">mdi-minus</v-icon>
              </button>
              <!-- keyed by the quantity: every change re-mounts the number and plays a pop -->
              <span
                :key="item.quantity"
                class="item_quantity"
                :class="quantityPopClass(item.id)"
                aria-live="polite"
                >{{ item.quantity }}</span
              >
              <button
                type="button"
                class="changeQuantity"
                :aria-label="`Increase quantity of ${item.name}`"
                @click="changeQuantity('plus', item)"
              >
                <v-icon size="14">mdi-plus</v-icon>
              </button>
            </div>
          </div>
          <div class="shopping-cart__side">
            <span class="shopping-cart__price">{{ formatPrice(item.price * item.quantity) }}</span>
            <button
              type="button"
              class="shopping-cart__remove"
              :aria-label="`Remove ${item.name} from cart`"
              @click="removeItem(item.id)"
            >
              <v-icon size="15">mdi-trash-can-outline</v-icon>
              <span>Remove</span>
            </button>
          </div>
        </li>
      </TransitionGroup>

      <Transition name="cart-empty">
        <div v-if="!cartItems.length" class="shopping-cart__empty">
          <!-- a small record that turns slowly while the drawer is open -->
          <svg class="shopping-cart__empty-icon" viewBox="0 0 64 64" aria-hidden="true">
            <circle cx="32" cy="32" r="30" class="shopping-cart__disc" />
            <circle cx="32" cy="32" r="24" class="shopping-cart__groove" />
            <circle cx="32" cy="32" r="19" class="shopping-cart__groove" />
            <circle cx="32" cy="32" r="14.5" class="shopping-cart__groove" />
            <circle cx="32" cy="32" r="9" class="shopping-cart__label" />
            <path d="M32 23a9 9 0 0 1 9 9" class="shopping-cart__label-mark" />
            <circle cx="32" cy="32" r="1.6" class="shopping-cart__spindle" />
          </svg>
          <p class="shopping-cart__empty-title">Your cart is quiet.</p>
          <p class="shopping-cart__empty-text">
            Nothing on the platter yet. Have a listen through the catalogue.
          </p>
          <router-link to="/products" class="shopping-cart__browse" @click="closeCart">
            Browse products
            <v-icon size="16" aria-hidden="true">mdi-arrow-right</v-icon>
          </router-link>
        </div>
      </Transition>
    </div>

    <footer class="shopping-cart__footer">
      <div class="shopping-cart__subtotal">
        <span class="shopping-cart__subtotal-label">Subtotal</span>
        <span class="shopping-cart__subtotal-value">{{ formatPrice(displayedSubtotal) }}</span>
      </div>
      <p class="shopping-cart__note">Shipping and taxes calculated at checkout.</p>
      <button
        type="button"
        class="shopping-cart__checkout"
        :class="{ 'shopping-cart__checkout--muted': !cartItems.length }"
        @click="checkout"
      >
        Checkout
        <v-icon size="18" aria-hidden="true">mdi-arrow-right</v-icon>
      </button>
      <button type="button" class="shopping-cart__close" @click="closeCart">
        Continue shopping
      </button>
    </footer>
  </aside>
</template>

<script>
import { useCartStore } from '@/stores/cartStore'
import { useToast } from '@/composables/useToast'
import { tweenNumber } from '@/composables/useAnimatedNumber'
import { prefersReducedMotion } from '@/composables/useMotionPreferences'

const EASE_OUT = 'cubic-bezier(0.22, 1, 0.36, 1)'

export default {
  name: 'ShoppingCartComponent',
  data() {
    return {
      // subtotal shown in the footer - counts towards the real value whenever it changes
      displayedSubtotal: useCartStore().subtotal,
      // direction of the last quantity change per item id ('up' | 'down'), picks the pop
      quantityChanges: {},
    }
  },
  computed: {
    cartStore() {
      return useCartStore()
    },
    isOpen() {
      return this.cartStore.isOpen
    },
    cartItems() {
      return this.cartStore.detailedItems
    },
    subtotal() {
      return this.cartStore.subtotal
    },
    itemCount() {
      return this.cartStore.cartQuantity
    },
  },
  watch: {
    subtotal(value) {
      this.cancelSubtotalTween?.()
      this.cancelSubtotalTween = tweenNumber({
        from: this.displayedSubtotal,
        to: value,
        duration: 650,
        onUpdate: (current) => {
          this.displayedSubtotal = current
        },
      })
    },
    isOpen(open) {
      if (open) this.$nextTick(this.cascadeItems)
    },
  },
  mounted() {
    document.addEventListener('keydown', this.onKeydown)
  },
  beforeUnmount() {
    document.removeEventListener('keydown', this.onKeydown)
    this.cancelSubtotalTween?.()
  },
  methods: {
    closeCart() {
      this.cartStore.closeCart()
    },
    onKeydown(event) {
      if (event.key === 'Escape' && this.isOpen) this.closeCart()
    },
    changeQuantity(action, item) {
      if (action === 'plus') {
        this.quantityChanges[item.id] = 'up'
        this.cartStore.updateQuantity(item.id, item.quantity + 1)
      } else if (action === 'minus' && item.quantity > 1) {
        this.quantityChanges[item.id] = 'down'
        this.cartStore.updateQuantity(item.id, item.quantity - 1)
      } else if (action === 'minus') {
        this.nudge(item.id)
      }
    },
    quantityPopClass(id) {
      const change = this.quantityChanges[id]
      return change ? `item_quantity--pop item_quantity--${change}` : ''
    },
    removeItem(id) {
      this.cartStore.removeItem(id)
      delete this.quantityChanges[id]
    },
    formatPrice(value) {
      return `$${value.toFixed(2)}`
    },
    checkout() {
      const { showToast } = useToast()
      if (!this.cartItems.length) {
        showToast('Your cart is empty.', 'info')
        return
      }
      showToast('Proceeding to checkout!', 'success')
    },

    // --- animations -------------------------------------------------------------------------
    rows() {
      return Array.from(this.$refs.itemList?.$el?.children || [])
    },
    cascadeItems() {
      // the items slide in one after another each time the drawer opens
      if (prefersReducedMotion()) return
      this.rows().forEach((row, index) => {
        row.animate?.(
          [
            { opacity: 0, translate: '40px 0' },
            { opacity: 1, translate: '0 0' },
          ],
          {
            duration: 520,
            delay: 120 + index * 60,
            easing: EASE_OUT,
            fill: 'backwards',
          },
        )
      })
    },
    nudge(id) {
      // the quantity can't go below 1: a small "no" shake instead of silently ignoring the click
      const row = this.rows().find((el) => el.dataset.id === String(id))
      const quantity = row?.querySelector('.shopping-cart__quantity')
      if (!quantity?.animate || prefersReducedMotion()) return
      quantity.animate(
        [
          { translate: '0 0' },
          { translate: '-4px 0' },
          { translate: '4px 0' },
          { translate: '-2px 0' },
          { translate: '0 0' },
        ],
        { duration: 320, easing: 'ease-out' },
      )
    },
    onItemLeave(el, done) {
      // slide out to the right, then collapse the row so the list closes the gap smoothly
      if (prefersReducedMotion() || !el.animate) {
        done()
        return
      }
      const { marginBottom } = getComputedStyle(el)
      el.style.overflow = 'hidden'
      const animation = el.animate(
        [
          {
            opacity: 1,
            transform: 'translateX(0)',
            height: `${el.offsetHeight}px`,
            marginBottom,
          },
          {
            opacity: 0,
            transform: 'translateX(60px)',
            height: `${el.offsetHeight}px`,
            marginBottom,
            offset: 0.5,
          },
          { opacity: 0, transform: 'translateX(60px)', height: '0px', marginBottom: '0px' },
        ],
        { duration: 560, easing: EASE_OUT },
      )
      animation.onfinish = done
      animation.oncancel = done
    },
  },
}
</script>

<style lang="scss">
@use '@/assets/scss/tokens' as t;

$cart-ease-out: t.$ease-out;

.shopping-cart {
  position: fixed;
  top: 0;
  right: 0;
  height: 100vh;
  height: 100dvh;
  width: 460px;
  display: flex;
  flex-direction: column;
  background-color: t.$paper;
  color: t.$text-on-light;
  border-left: 1px solid t.$line-on-light;
  box-shadow: -30px 0 60px -30px rgba(16, 19, 17, 0.55);
  transform: translateX(100%);
  /* visibility keeps the closed panel out of the tab order; it switches after the slide-out */
  visibility: hidden;
  /* closing: a quick ease-in; opening (below): a long, soft ease-out */
  transition:
    transform 0.38s cubic-bezier(0.55, 0, 0.75, 0.2),
    visibility 0s linear 0.38s;
  /* items slide horizontally when added/removed - never show a horizontal scrollbar for it */
  overflow: hidden;
  /* keeps the panel above positioned page elements (e.g. product card cart buttons) */
  z-index: 1000;

  @media (max-width: 1024px) {
    width: 420px;
  }

  @media (max-width: 576px) {
    width: 100%;
    border-left: none;
  }

  &--active {
    transform: translateX(0);
    visibility: visible;
    transition:
      transform 0.6s $cart-ease-out,
      visibility 0s linear 0s;
  }

  // --- header -----------------------------------------------------------------------------
  &__header {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 1.6rem;
    padding: 2.8rem 2.8rem 2rem;
    border-bottom: 1px solid t.$line-on-light;

    @media (max-width: 576px) {
      padding: 2rem 1.6rem 1.6rem;
    }
  }

  &__eyebrow {
    font-family: t.$font-mono;
    font-size: 1.1rem;
    font-weight: 500;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    color: t.$brass-dark;
  }

  &__title {
    margin-top: 0.6rem;
    font-family: t.$font-display;
    font-weight: 400;
    font-size: 3.6rem;
    line-height: 1;
    color: t.$text-on-light;

    @media (max-width: 576px) {
      font-size: 3rem;
    }
  }

  &__dismiss {
    flex-shrink: 0;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    border: 1px solid t.$line-on-light;
    background: transparent;
    color: t.$text-on-light;
    cursor: pointer;
    transition:
      border-color 0.3s,
      color 0.3s,
      transform 0.5s $cart-ease-out;

    &:hover,
    &:focus-visible {
      border-color: t.$brass-dark;
      color: t.$brass-dark;
      transform: rotate(90deg);
    }
  }

  // --- items ------------------------------------------------------------------------------
  &__body {
    flex: 1;
    min-height: 0;
    overflow-y: auto;
    overflow-x: hidden;
    padding: 0 2.8rem;

    @media (max-width: 576px) {
      padding: 0 1.6rem;
    }
  }

  &__items {
    list-style: none;
    width: 100%;
  }

  &__item {
    display: grid;
    grid-template-columns: auto minmax(0, 1fr) auto;
    align-items: start;
    gap: 1.6rem;
    padding: 2rem 0;
    border-bottom: 1px solid t.$line-on-light;
    background-color: t.$paper;

    @media (max-width: 400px) {
      gap: 1.2rem;
    }
  }

  &__img {
    width: 72px;
    height: 72px;
    object-fit: cover;
    border-radius: t.$radius-sm;

    @media (max-width: 400px) {
      width: 60px;
      height: 60px;
    }
  }

  &__info {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    min-width: 0;
  }

  &__name {
    font-family: t.$font-display;
    font-size: 1.9rem;
    line-height: 1.15;
    color: t.$text-on-light;
  }

  &__unit {
    margin-top: 0.4rem;
    font-family: t.$font-mono;
    font-size: 1.1rem;
    letter-spacing: 0.04em;
    color: t.$muted-on-light;
  }

  // hairline stepper
  &__quantity {
    display: inline-flex;
    align-items: center;
    margin-top: 1.2rem;
    border: 1px solid rgba(29, 23, 18, 0.2);
    border-radius: t.$radius-sm;

    button {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 32px;
      height: 32px;
      background: transparent;
      border: none;
      color: t.$text-on-light;
      cursor: pointer;
      transition:
        background-color 0.25s,
        color 0.25s;

      &:hover,
      &:focus-visible {
        background-color: t.$paper-2;
        color: t.$brass-dark;
      }
    }
  }

  .item_quantity {
    display: inline-block;
    min-width: 3.2rem;
    text-align: center;
    font-family: t.$font-mono;
    font-size: 1.3rem;
    font-weight: 500;
    line-height: 32px;
    border-left: 1px solid t.$line-on-light;
    border-right: 1px solid t.$line-on-light;

    &--pop {
      animation: cart-quantity-pop-up 0.42s cubic-bezier(0.34, 1.56, 0.64, 1);
    }

    &--down {
      animation-name: cart-quantity-pop-down;
    }
  }

  &__side {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    justify-content: space-between;
    align-self: stretch;
    gap: 1rem;
  }

  &__price {
    font-family: t.$font-mono;
    font-size: 1.45rem;
    font-weight: 500;
    color: t.$text-on-light;
    white-space: nowrap;
    font-variant-numeric: tabular-nums;
  }

  &__remove {
    display: inline-flex;
    align-items: center;
    gap: 0.4rem;
    background: none;
    border: none;
    padding: 0.2rem 0;
    cursor: pointer;
    color: t.$muted-on-light;
    transition: color 0.3s;

    span {
      font-family: t.$font-mono;
      font-size: 1.05rem;
      letter-spacing: 0.12em;
      text-transform: uppercase;
    }

    &:hover,
    &:focus-visible {
      color: t.$oxblood;
    }

    &:hover .v-icon {
      animation: cart-trash-wiggle 0.5s ease-in-out;
    }
  }

  // --- empty state ------------------------------------------------------------------------
  &__empty {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    padding: 3.6rem 1rem 3rem;
  }

  &__empty-icon {
    width: 76px;
    height: 76px;
    margin-bottom: 2rem;
  }

  &__disc {
    fill: t.$ink;
  }
  &__groove {
    fill: none;
    stroke: rgba(239, 231, 220, 0.12);
    stroke-width: 0.6;
  }
  &__label {
    fill: t.$brass;
  }
  &__label-mark {
    fill: none;
    stroke: t.$brass-dark;
    stroke-width: 1.2;
  }
  &__spindle {
    fill: t.$paper;
  }

  .shopping-cart--active &__empty-icon {
    animation: cart-record-spin 5.4s linear infinite;
  }

  &__empty-title {
    font-family: t.$font-display;
    font-size: 2.6rem;
    line-height: 1.1;
    color: t.$text-on-light;
  }

  &__empty-text {
    max-width: 26ch;
    margin-top: 0.8rem;
    font-size: 1.4rem;
    line-height: 1.6;
    color: t.$muted-on-light;
  }

  &__browse {
    display: inline-flex;
    align-items: center;
    gap: 0.6rem;
    margin-top: 2rem;
    padding-bottom: 0.3rem;
    border-bottom: 1px solid t.$brass-dark;
    font-family: t.$font-mono;
    font-size: 1.15rem;
    font-weight: 500;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: t.$text-on-light;
    transition: color 0.3s;

    .v-icon {
      transition: transform 0.4s $cart-ease-out;
    }

    &:hover,
    &:focus-visible {
      color: t.$brass-dark;
      .v-icon {
        transform: translateX(4px);
      }
    }
  }

  // --- footer -----------------------------------------------------------------------------
  &__footer {
    padding: 1.8rem 2.8rem 1.8rem;
    border-top: 1px solid t.$line-on-light;
    background-color: t.$paper-2;

    @media (max-width: 576px) {
      padding: 1.6rem 1.6rem 2rem;
    }
  }

  &__subtotal {
    display: flex;
    align-items: baseline;
    justify-content: space-between;
    gap: 1.6rem;
  }

  &__subtotal-label {
    font-family: t.$font-mono;
    font-size: 1.15rem;
    font-weight: 500;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    color: t.$muted-on-light;
  }

  &__subtotal-value {
    font-family: t.$font-display;
    font-size: 2.8rem;
    line-height: 1;
    color: t.$text-on-light;
    font-variant-numeric: tabular-nums;
  }

  &__note {
    margin-top: 0.6rem;
    font-size: 1.2rem;
    color: t.$muted-on-light;
  }

  &__checkout {
    width: 100%;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 1rem;
    margin-top: 1.6rem;
    padding: 1.4rem 2rem;
    border: none;
    border-radius: t.$radius-sm;
    background-color: t.$brass;
    color: t.$ink;
    font-family: t.$font-mono;
    font-size: 1.3rem;
    font-weight: 500;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    cursor: pointer;
    transition:
      background-color 0.3s,
      color 0.3s;

    .v-icon {
      transition: transform 0.4s $cart-ease-out;
    }

    &:hover,
    &:focus-visible {
      background-color: t.$brass-light;
      .v-icon {
        transform: translateX(4px);
      }
    }

    &:active {
      scale: 0.99;
    }

    &--muted {
      opacity: 0.45;
    }
  }

  &__close {
    width: 100%;
    margin-top: 0.6rem;
    padding: 0.8rem;
    background: none;
    border: none;
    cursor: pointer;
    font-family: t.$font-mono;
    font-size: 1.15rem;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: t.$muted-on-light;
    transition: color 0.3s;

    &:hover,
    &:focus-visible {
      color: t.$text-on-light;
      text-decoration: underline;
      text-underline-offset: 4px;
    }
  }

  button:focus-visible,
  a:focus-visible {
    outline: 1px solid t.$brass-dark;
    outline-offset: 2px;
  }
}

/* Backdrop: dims and blurs the page while the cart is open */
.shopping-cart-backdrop {
  position: fixed;
  inset: 0;
  z-index: 999;
  background-color: rgba(16, 19, 17, 0.55);
  backdrop-filter: blur(3px);
  -webkit-backdrop-filter: blur(3px);
  opacity: 0;
  visibility: hidden;
  transition:
    opacity 0.4s ease,
    visibility 0s linear 0.4s;

  &--active {
    opacity: 1;
    visibility: visible;
    transition:
      opacity 0.5s ease,
      visibility 0s linear 0s;
  }
}

/* Item enter / move (the leave + collapse runs in JS, see onItemLeave) */
.cart-item-enter-active {
  transition:
    opacity 0.45s ease,
    transform 0.55s $cart-ease-out;
}

.cart-item-enter-from {
  opacity: 0;
  transform: translateX(40px) scale(0.96);
}

.cart-item-move {
  transition: transform 0.5s $cart-ease-out;
}

/* Empty state appears after the last item has collapsed */
.cart-empty-enter-active {
  transition:
    opacity 0.5s ease 0.35s,
    transform 0.6s $cart-ease-out 0.35s;
}

.cart-empty-enter-from {
  opacity: 0;
  transform: translateY(10px);
}

@keyframes cart-record-spin {
  to {
    transform: rotate(360deg);
  }
}

@keyframes cart-quantity-pop-up {
  0% {
    opacity: 0;
    transform: translateY(60%) scale(0.6);
  }
  60% {
    opacity: 1;
    transform: translateY(-8%) scale(1.25);
  }
  100% {
    transform: none;
  }
}

@keyframes cart-quantity-pop-down {
  0% {
    opacity: 0;
    transform: translateY(-60%) scale(0.6);
  }
  60% {
    opacity: 1;
    transform: translateY(8%) scale(1.25);
  }
  100% {
    transform: none;
  }
}

@keyframes cart-trash-wiggle {
  0%,
  100% {
    transform: rotate(0deg);
  }
  25% {
    transform: rotate(-12deg);
  }
  50% {
    transform: rotate(10deg);
  }
  75% {
    transform: rotate(-6deg);
  }
}

@media (prefers-reduced-motion: reduce) {
  .shopping-cart,
  .shopping-cart--active,
  .shopping-cart-backdrop,
  .shopping-cart-backdrop--active {
    transition-duration: 0s;
    transition-delay: 0s;
  }

  .cart-item-enter-active,
  .cart-item-move,
  .cart-empty-enter-active {
    transition: none;
  }

  .shopping-cart--active .shopping-cart__empty-icon,
  .shopping-cart .item_quantity--pop,
  .shopping-cart__remove:hover .v-icon {
    animation: none;
  }

  .shopping-cart__dismiss:hover,
  .shopping-cart__dismiss:focus-visible {
    transform: none;
  }
}
</style>
