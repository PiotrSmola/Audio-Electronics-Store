<template>
  <header
    class="navbar"
    :class="{ 'navbar--scrolled': scrolled, 'navbar--menu-open': menuActive }"
    :style="{ '--scroll-progress': scrollProgress }"
  >
    <div class="navbar__container container">
      <router-link to="/" class="navbar__logo" aria-label="Audio Electronics, home">
        <span class="navbar__mark" aria-hidden="true">
          <img src="@/assets/img/logo-audio.png" alt="" class="navbar__img" />
        </span>
        <span class="navbar__wordmark">
          <span id="store-name" class="navbar__name">Audio Electronics</span>
          <span class="navbar__tagline">Hi-Fi &amp; Studio · London</span>
        </span>
      </router-link>

      <!-- Menu for desktop -->
      <nav class="navbar__menu" aria-label="Main">
        <router-link
          v-for="link in links"
          :key="link.to"
          :to="link.to"
          class="navbar__link"
          :class="{ 'navbar__link--active': isActive(link) }"
          @click="closeMenu"
          >{{ link.label }}</router-link
        >
      </nav>

      <div class="navbar__icons">
        <button
          type="button"
          class="navbar__icon-btn navbar__search-btn"
          aria-label="Search products"
          @click="openSearch"
        >
          <v-icon size="20">mdi-magnify</v-icon>
        </button>
        <button
          type="button"
          class="navbar__icon-btn navbar__cart-btn"
          aria-label="Open shopping cart"
          :aria-expanded="cartOpen ? 'true' : 'false'"
          @click="toggleCart"
        >
          <v-icon size="20">mdi-shopping-outline</v-icon>
          <span
            ref="cartBadge"
            class="navbar__cart-quantity"
            :class="{ 'navbar__cart-quantity--empty': !cartQuantity }"
            >{{ cartQuantity }}</span
          >
        </button>
        <!-- Hamburger toggle button for mobile -->
        <button
          type="button"
          class="navbar__icon-btn navbar__toggle-btn"
          :aria-label="menuActive ? 'Close menu' : 'Open menu'"
          :aria-expanded="menuActive ? 'true' : 'false'"
          @click="toggleMenu"
        >
          <span class="navbar__burger" :class="{ 'navbar__burger--open': menuActive }">
            <span></span><span></span><span></span>
          </span>
        </button>
      </div>
    </div>

    <!-- hairline dial scale along the bottom edge -->
    <span class="navbar__scale" aria-hidden="true"></span>

    <!-- Modal menu for mobile -->
    <transition name="menu">
      <nav v-if="menuActive" class="navbar__menu-mobile" aria-label="Main" @click.self="closeMenu">
        <div class="navbar__menu-mobile-container">
          <p class="navbar__menu-mobile-eyebrow">Index</p>
          <router-link
            v-for="(link, index) in links"
            :key="link.to"
            :to="link.to"
            class="navbar__link"
            :class="{ 'navbar__link--active': isActive(link) }"
            :style="{ '--i': index }"
            @click="closeMenu"
          >
            <span class="navbar__link-number">{{ String(index + 1).padStart(2, '0') }}</span>
            <span class="navbar__link-label">{{ link.label }}</span>
          </router-link>
          <div class="navbar__menu-mobile-foot" :style="{ '--i': links.length }">
            <span>123 Oxford Street, London</span>
            <span>Mon–Fri 9:00–21:00</span>
          </div>
        </div>
      </nav>
    </transition>

    <!-- Search: full-screen "command palette" -->
    <v-dialog
      v-model="searchActive"
      fullscreen
      transition="fade-transition"
      content-class="navbar-search-dialog"
      @after-enter="focusSearch"
      @after-leave="resetSearch"
    >
      <div class="navbar-search ae-grain" role="search" @click.self="closeSearch">
        <div class="navbar-search__inner">
          <div class="navbar-search__top">
            <p class="ae-eyebrow navbar-search__eyebrow">Search the shop</p>
            <button type="button" class="navbar-search__close" @click="closeSearch">
              <kbd>Esc</kbd><span>Close</span>
            </button>
          </div>

          <label class="navbar-search__field">
            <v-icon class="navbar-search__field-icon" aria-hidden="true">mdi-magnify</v-icon>
            <input
              ref="searchInput"
              v-model="searchQuery"
              type="search"
              class="navbar-search__input"
              placeholder="Turntables, amplifiers…"
              aria-label="Search for audio equipment"
              autocomplete="off"
              spellcheck="false"
              @keydown.enter.prevent="goToFirstResult"
              @keydown.down.prevent="moveActive(1)"
              @keydown.up.prevent="moveActive(-1)"
              @keydown.esc="closeSearch"
            />
          </label>

          <p class="navbar-search__meta">
            <span v-if="trimmedQuery">
              {{ filteredSearchItems.length }}
              {{ filteredSearchItems.length === 1 ? 'result' : 'results' }}
            </span>
            <span v-else>On the shelf</span>
            <span class="navbar-search__hints" aria-hidden="true">
              <kbd>↑</kbd><kbd>↓</kbd> move · <kbd>Enter</kbd> open
            </span>
          </p>

          <div class="navbar-search__results">
            <ol v-if="displayedItems.length" class="navbar-search__list">
              <li
                v-for="(item, index) in displayedItems"
                :key="item.id"
                :style="{ '--i': index }"
                class="navbar-search__row"
              >
                <router-link
                  :to="{ name: 'ProductDetailView', params: { id: item.id } }"
                  class="navbar-search__item"
                  :class="{ 'navbar-search__item--active': index === activeIndex }"
                  @mouseenter="activeIndex = index"
                  @click="closeSearch"
                >
                  <span class="navbar-search__index">{{ String(index + 1).padStart(2, '0') }}</span>
                  <img :src="item.imgSrc" :alt="item.name" class="navbar-search__img" />
                  <span class="navbar-search__name">{{ item.name }}</span>
                  <span class="navbar-search__leader" aria-hidden="true"></span>
                  <span class="navbar-search__price">{{ formatPrice(item.price) }}</span>
                </router-link>
              </li>
            </ol>
            <div v-else class="navbar-search__empty">
              <p class="navbar-search__empty-title">
                Nothing on the shelf for “{{ trimmedQuery }}”.
              </p>
              <p class="navbar-search__empty-text">
                Try
                <button type="button" @click="setQuery('speaker')">speaker</button>,
                <button type="button" @click="setQuery('headphones')">headphones</button>
                or
                <button type="button" @click="setQuery('turntable')">turntable</button>.
              </p>
            </div>
          </div>
        </div>
      </div>
    </v-dialog>
  </header>
</template>

<script>
import { useCartStore } from '@/stores/cartStore'
import { products } from '@/data/products'

const SUGGESTION_COUNT = 5

export default {
  name: 'NavbarComponent',
  data() {
    return {
      menuActive: false,
      searchActive: false,
      searchQuery: '',
      activeIndex: 0,
      scrolled: false,
      scrollProgress: 0,
      links: [
        { to: '/', label: 'Home', exact: true },
        { to: '/about', label: 'About' },
        { to: '/products', label: 'Products' },
        { to: '/contact', label: 'Contact' },
      ],
    }
  },
  computed: {
    cartStore() {
      return useCartStore()
    },
    cartQuantity() {
      return this.cartStore.cartQuantity
    },
    cartOpen() {
      return this.cartStore.isOpen
    },
    trimmedQuery() {
      return (this.searchQuery || '').trim()
    },
    filteredSearchItems() {
      const query = this.trimmedQuery.toLowerCase()
      if (!query) return []
      return products.filter((item) => item.name.toLowerCase().includes(query))
    },
    // Without a query the palette shows a few products to browse
    displayedItems() {
      return this.trimmedQuery ? this.filteredSearchItems : products.slice(0, SUGGESTION_COUNT)
    },
  },
  watch: {
    // Small "pop" of the badge whenever the number of items changes
    cartQuantity(newValue, oldValue) {
      if (newValue === oldValue) return
      const badge = this.$refs.cartBadge
      if (!badge?.animate || window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return
      badge.animate(
        [
          { transform: 'scale(1)' },
          { transform: 'scale(1.45)', offset: 0.3 },
          { transform: 'scale(0.88)', offset: 0.55 },
          { transform: 'scale(1.08)', offset: 0.78 },
          { transform: 'scale(1)' },
        ],
        { duration: 600, easing: 'ease-out' },
      )
    },
    trimmedQuery(query) {
      // typing highlights the first match (Enter opens it); browsing starts with nothing selected
      this.activeIndex = query ? 0 : -1
    },
  },
  mounted() {
    window.addEventListener('scroll', this.onScroll, { passive: true })
    window.addEventListener('resize', this.onScroll, { passive: true })
    this.updateScrollState()
  },
  beforeUnmount() {
    window.removeEventListener('scroll', this.onScroll)
    window.removeEventListener('resize', this.onScroll)
    if (this.scrollFrame) cancelAnimationFrame(this.scrollFrame)
  },
  methods: {
    onScroll() {
      // One update per frame at most
      if (this.scrollFrame) return
      this.scrollFrame = requestAnimationFrame(() => {
        this.scrollFrame = null
        this.updateScrollState()
      })
    },
    updateScrollState() {
      const top = window.scrollY || document.documentElement.scrollTop
      const max = document.documentElement.scrollHeight - window.innerHeight
      this.scrolled = top > 8
      this.scrollProgress = max > 0 ? Math.min(1, Math.max(0, top / max)).toFixed(4) : 0
    },
    isActive(link) {
      const path = this.$route.path
      return link.exact ? path === link.to : path === link.to || path.startsWith(`${link.to}/`)
    },
    openSearch() {
      this.closeMenu()
      this.activeIndex = -1
      this.searchActive = true
    },
    closeSearch() {
      this.searchActive = false
    },
    focusSearch() {
      this.$refs.searchInput?.focus()
    },
    resetSearch() {
      this.searchQuery = ''
      this.activeIndex = -1
    },
    setQuery(query) {
      this.searchQuery = query
      this.focusSearch()
    },
    moveActive(step) {
      const count = this.displayedItems.length
      if (!count) return
      this.activeIndex = (this.activeIndex + step + count) % count
    },
    goToFirstResult() {
      // Enter opens the highlighted row - the first match while typing
      const item = this.displayedItems[this.activeIndex]
      if (!item) return
      this.$router.push({ name: 'ProductDetailView', params: { id: item.id } })
      this.closeSearch()
    },
    toggleCart() {
      this.cartStore.toggleCart()
    },
    toggleMenu() {
      this.menuActive = !this.menuActive
    },
    closeMenu() {
      this.menuActive = false
    },
    formatPrice(value) {
      return `$${value.toFixed(2)}`
    },
  },
}
</script>

<style lang="scss">
@use '@/assets/scss/tokens' as t;

.navbar {
  background-color: t.$ink;
  color: t.$text-on-dark;
  padding: 1.4rem 0;
  // Sticky: same look at the top of the page; once scrolled it turns into translucent glass.
  // Kept below the cart panel (z-index 1000) and Vuetify overlays.
  position: sticky;
  top: 0;
  z-index: 900;
  transition:
    background-color 0.4s ease,
    box-shadow 0.4s ease,
    padding 0.4s t.$ease-out;

  @media (max-width: 768px) {
    padding: 1rem 0;
  }

  // The glass lives on a pseudo-element: a backdrop-filter on the header itself would become
  // the containing block of the fixed mobile menu overlay.
  &::before {
    content: '';
    position: absolute;
    inset: 0;
    z-index: -1;
    background-color: rgba(16, 19, 17, 0.9);
    backdrop-filter: blur(14px) saturate(130%);
    -webkit-backdrop-filter: blur(14px) saturate(130%);
    opacity: 0;
    transition: opacity 0.4s ease;
    pointer-events: none;
  }

  // Thin brass reading-progress line along the bottom edge
  &::after {
    content: '';
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    height: 1px;
    background-color: t.$brass;
    transform-origin: 0 50%;
    transform: scaleX(var(--scroll-progress, 0));
    opacity: 0;
    transition: opacity 0.4s ease;
    pointer-events: none;
    z-index: 3;
  }

  &--scrolled {
    background-color: transparent;
    padding: 0.8rem 0;
    box-shadow: 0 10px 30px -18px rgba(0, 0, 0, 0.8);
    &::before,
    &::after {
      opacity: 1;
    }
    .navbar__tagline {
      opacity: 0;
      max-height: 0;
      margin-top: 0;
    }
  }

  &--menu-open .navbar__scale,
  &--menu-open::after {
    opacity: 0;
  }

  // Hairline + small dial ticks along the bottom edge (every 5th tick a little taller)
  &__scale {
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    height: 5px;
    pointer-events: none;
    border-bottom: 1px solid t.$line-on-dark;
    background-image:
      repeating-linear-gradient(90deg, rgba(190, 156, 121, 0.28) 0 1px, transparent 1px 60px),
      repeating-linear-gradient(90deg, rgba(190, 156, 121, 0.16) 0 1px, transparent 1px 12px);
    background-size:
      100% 5px,
      100% 3px;
    background-position:
      0 100%,
      0 100%;
    background-repeat: no-repeat;
  }

  .navbar__container {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 2rem;
    position: relative;
    // stays above the mobile menu overlay, so the logo and the close button remain usable
    z-index: 2;
    padding: 0 2rem;

    @media (max-width: 576px) {
      gap: 1rem;
      padding: 0 1.6rem;
    }
  }

  // --- wordmark ---------------------------------------------------------------------------
  .navbar__logo {
    display: flex;
    align-items: center;
    gap: 1.2rem;
    color: t.$text-on-dark;
    text-decoration: none;
    min-width: 0;

    @media (max-width: 768px) {
      flex: 1 1 0;
    }

    &:hover .navbar__mark,
    &:focus-visible .navbar__mark {
      box-shadow: 0 0 0 1px t.$brass;
    }
    &:hover .navbar__img {
      transform: scale(1.32) rotate(-8deg);
    }
  }

  // the logo is cropped into a small round "record label" with a brass hairline ring
  .navbar__mark {
    position: relative;
    flex-shrink: 0;
    width: 44px;
    height: 44px;
    border-radius: 50%;
    overflow: hidden;
    box-shadow: 0 0 0 1px t.$line-on-dark;
    outline: 1px solid rgba(190, 156, 121, 0.14);
    outline-offset: 4px;
    transition: box-shadow 0.3s ease;

    @media (max-width: 576px) {
      width: 38px;
      height: 38px;
    }
    // small phones: the serif name carries the brand on its own
    @media (max-width: 480px) {
      display: none;
    }
  }

  .navbar__img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transform: scale(1.32);
    transition: transform 0.6s t.$ease-out;
  }

  .navbar__wordmark {
    display: flex;
    flex-direction: column;
    line-height: 1.1;
    min-width: 0;
    overflow: hidden;

    // phones: the wordmark takes whatever room the icons leave and never widens the page
    @media (max-width: 768px) {
      flex: 1;
      contain: inline-size;
    }
  }

  .navbar__name {
    font-family: t.$font-display;
    font-size: 2.3rem;
    letter-spacing: -0.005em;
    white-space: nowrap;

    @media (max-width: 1024px) {
      font-size: 2rem;
    }
    @media (max-width: 576px) {
      font-size: 1.75rem;
    }
    @media (max-width: 400px) {
      font-size: 1.5rem;
    }
    @media (max-width: 360px) {
      font-size: 1.3rem;
    }
    // never let the name widen the page: it truncates instead
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .navbar__tagline {
    margin-top: 0.5rem;
    max-height: 2rem;
    overflow: hidden;
    font-family: t.$font-mono;
    font-size: 1rem;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    color: t.$brass;
    transition:
      opacity 0.3s ease,
      max-height 0.4s t.$ease-out,
      margin-top 0.4s t.$ease-out;

    white-space: nowrap;

    // hidden where it would crowd the links (tablet landscape) and on phones
    @media (min-width: 769px) and (max-width: 1100px) {
      display: none;
    }
    @media (max-width: 576px) {
      display: none;
    }
  }

  // --- links ------------------------------------------------------------------------------
  .navbar__menu {
    display: flex;
    gap: 3.6rem;

    @media (max-width: 1024px) {
      gap: 2.4rem;
    }
    @media (max-width: 768px) {
      display: none;
    }

    .navbar__link {
      position: relative;
      padding: 0.6rem 0;
      color: t.$text-on-dark;
      text-decoration: none;
      font-family: t.$font-mono;
      font-size: 1.2rem;
      font-weight: 500;
      letter-spacing: 0.16em;
      text-transform: uppercase;
      transition: color 0.3s;

      // Animated underline: grows from the left on hover, retracts to the right
      &::after {
        content: '';
        position: absolute;
        left: 0;
        right: 0.18em;
        bottom: 0;
        height: 1px;
        background-color: t.$brass;
        transform: scaleX(0);
        transform-origin: 100% 50%;
        transition: transform 0.45s t.$ease-out;
      }

      &:hover,
      &:focus-visible {
        color: t.$brass-light;
        &::after {
          transform: scaleX(1);
          transform-origin: 0 50%;
        }
      }

      &--active {
        color: t.$brass;
        &::after {
          transform: scaleX(1);
        }
      }
    }
  }

  // --- icon buttons -----------------------------------------------------------------------
  .navbar__icons {
    display: flex;
    align-items: center;
    gap: 0.8rem;
    position: relative;
    flex-shrink: 0;

    @media (max-width: 576px) {
      gap: 0.6rem;
    }
  }

  .navbar__icon-btn {
    position: relative;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 42px;
    height: 42px;
    border-radius: 50%;
    border: 1px solid t.$line-on-dark;
    background: transparent;
    color: t.$text-on-dark;
    cursor: pointer;
    transition:
      border-color 0.3s ease,
      color 0.3s ease,
      background-color 0.3s ease;

    &:hover,
    &:focus-visible {
      border-color: t.$brass;
      color: t.$brass;
      background-color: rgba(190, 156, 121, 0.08);
    }

    &:focus-visible {
      outline: 1px solid t.$brass;
      outline-offset: 3px;
    }

    @media (max-width: 576px) {
      width: 36px;
      height: 36px;
    }
  }

  .navbar__cart-quantity {
    position: absolute;
    pointer-events: none;
    top: -5px;
    right: -6px;
    min-width: 19px;
    height: 19px;
    padding: 0 0.5rem;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    border-radius: 10px;
    background-color: t.$brass;
    color: t.$ink;
    font-family: t.$font-mono;
    font-size: 1.05rem;
    font-weight: 500;
    line-height: 1;
    box-shadow: 0 0 0 2px t.$ink;
    transition:
      opacity 0.3s ease,
      scale 0.4s t.$ease-out;

    // nothing in the cart: the badge is tucked away (scale, so the pop animation can still use transform)
    &--empty {
      opacity: 0;
      scale: 0.4;
    }
  }

  .navbar__toggle-btn {
    display: none;
    @media (max-width: 768px) {
      display: inline-flex;
    }
  }

  // two-line burger that folds into a cross
  .navbar__burger {
    position: relative;
    width: 16px;
    height: 10px;

    span {
      position: absolute;
      left: 0;
      width: 100%;
      height: 1px;
      background-color: currentColor;
      transition:
        transform 0.4s t.$ease-out,
        opacity 0.2s ease,
        width 0.4s t.$ease-out;
    }
    span:nth-child(1) {
      top: 0;
    }
    span:nth-child(2) {
      top: 50%;
      width: 65%;
    }
    span:nth-child(3) {
      top: 100%;
    }

    &--open {
      span:nth-child(1) {
        transform: translateY(5px) rotate(45deg);
      }
      span:nth-child(2) {
        opacity: 0;
      }
      span:nth-child(3) {
        transform: translateY(-5px) rotate(-45deg);
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
  height: 100dvh;
  z-index: 1;
  background-color: t.$ink;
  background-image:
    repeating-radial-gradient(
      circle at 110% 105%,
      rgba(190, 156, 121, 0.05) 0 1px,
      transparent 1px 9px
    ),
    linear-gradient(180deg, t.$ink, t.$ink-2);
  display: flex;
  align-items: flex-end;
  padding: 10rem 2.4rem 4rem;

  .navbar__menu-mobile-container {
    width: 100%;
    display: flex;
    flex-direction: column;
  }

  .navbar__menu-mobile-eyebrow {
    font-family: t.$font-mono;
    font-size: 1.1rem;
    letter-spacing: 0.22em;
    text-transform: uppercase;
    color: t.$muted-on-dark;
    padding-bottom: 1.2rem;
    border-bottom: 1px solid t.$line-on-dark;
  }

  .navbar__link {
    display: flex;
    align-items: baseline;
    gap: 1.6rem;
    padding: 1.4rem 0;
    border-bottom: 1px solid t.$line-on-dark;
    color: t.$text-on-dark;
    text-decoration: none;
    transition: color 0.3s;
    // Links slide in one after another each time the menu opens
    animation: navbar-menu-link-in 0.6s t.$ease-out both;
    animation-delay: calc(0.08s + var(--i, 0) * 0.07s);

    &:hover,
    &:focus-visible {
      color: t.$brass-light;
    }

    &--active {
      color: t.$brass;
      .navbar__link-label {
        font-style: italic;
      }
    }
  }

  .navbar__link-number {
    font-family: t.$font-mono;
    font-size: 1.2rem;
    letter-spacing: 0.1em;
    color: t.$brass;
  }

  .navbar__link-label {
    font-family: t.$font-display;
    font-size: clamp(3.4rem, 11vw, 4.8rem);
    line-height: 1;
  }

  .navbar__menu-mobile-foot {
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: 0.6rem 1.6rem;
    margin-top: 2.4rem;
    font-family: t.$font-mono;
    font-size: 1.1rem;
    letter-spacing: 0.06em;
    color: t.$muted-on-dark;
    span {
      font-family: inherit;
    }
    animation: navbar-menu-link-in 0.6s t.$ease-out both;
    animation-delay: calc(0.08s + var(--i, 0) * 0.07s);
  }
}

@keyframes navbar-menu-link-in {
  from {
    opacity: 0;
    transform: translateY(18px);
  }
  to {
    opacity: 1;
    transform: none;
  }
}

/* Mobile menu overlay: fade */
.menu-enter-active,
.menu-leave-active {
  transition: opacity 0.35s ease;
}
.menu-enter-from,
.menu-leave-to {
  opacity: 0;
}

/* Search palette (rendered by Vuetify outside .navbar) */
.navbar-search-dialog {
  margin: 0 !important;
}

.navbar-search {
  position: relative;
  min-height: 100%;
  width: 100%;
  overflow-y: auto;
  background-color: t.$ink;
  background-image:
    radial-gradient(ellipse at 50% -20%, rgba(190, 156, 121, 0.1), transparent 60%),
    repeating-linear-gradient(0deg, transparent 0 79px, rgba(190, 156, 121, 0.035) 79px 80px);
  color: t.$text-on-dark;

  &__inner {
    position: relative;
    z-index: 1;
    width: min(100% - 3.2rem, 880px);
    margin: 0 auto;
    padding: clamp(3rem, 10vh, 9rem) 0 6rem;
  }

  &__top {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1.6rem;
    margin-bottom: 2.4rem;
  }

  &__eyebrow {
    font-size: 1.1rem;

    @media (max-width: 576px) {
      letter-spacing: 0.12em;
      &::before {
        width: 1.6rem;
      }
    }
  }

  &__close {
    display: inline-flex;
    align-items: center;
    gap: 0.8rem;
    background: none;
    border: none;
    color: t.$muted-on-dark;
    font-family: t.$font-mono;
    font-size: 1.15rem;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    cursor: pointer;
    transition: color 0.3s;

    &:hover,
    &:focus-visible {
      color: t.$brass;
    }
  }

  kbd {
    display: inline-block;
    min-width: 2.2rem;
    padding: 0.2rem 0.5rem;
    border: 1px solid t.$line-on-dark;
    border-radius: t.$radius-sm;
    font-family: t.$font-mono;
    font-size: 1rem;
    line-height: 1.4;
    text-align: center;
    letter-spacing: 0.04em;
    text-transform: none;
    color: inherit;
  }

  // no keyboard hints on phones (after the kbd rule: same specificity)
  &__close kbd {
    @media (max-width: 576px) {
      display: none;
    }
  }

  &__field {
    display: flex;
    align-items: center;
    gap: 1.4rem;
    padding-bottom: 1.4rem;
    border-bottom: 1px solid rgba(190, 156, 121, 0.45);
    transition: border-color 0.3s;

    &:focus-within {
      border-bottom-color: t.$brass;
    }
  }

  &__field-icon {
    color: t.$brass;
    font-size: 2.8rem !important;
    flex-shrink: 0;
  }

  &__input {
    flex: 1;
    min-width: 0;
    background: none;
    border: none;
    outline: none;
    color: t.$text-on-dark;
    font-family: t.$font-display;
    font-size: clamp(2.8rem, 6vw, 5.2rem);
    line-height: 1.15;
    caret-color: t.$brass;

    &::placeholder {
      color: rgba(239, 231, 220, 0.28);
      font-style: italic;
    }
    &::-webkit-search-cancel-button {
      display: none;
    }
  }

  &__meta {
    display: flex;
    justify-content: space-between;
    gap: 1.6rem;
    margin: 1.4rem 0 1.6rem;
    font-family: t.$font-mono;
    font-size: 1.1rem;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: t.$muted-on-dark;
  }

  // the global * reset sets Roboto on every element: inherit the mono face explicitly
  &__meta span,
  &__close span,
  &__empty-text button {
    font-family: inherit;
  }

  &__hints {
    letter-spacing: 0.06em;
    text-transform: none;
    kbd {
      margin-right: 0.3rem;
    }
    @media (max-width: 576px) {
      display: none;
    }
  }

  &__list {
    list-style: none;
    padding: 0;
  }

  &__row {
    border-bottom: 1px solid t.$line-on-dark;
    animation: navbar-search-row-in 0.5s t.$ease-out both;
    animation-delay: calc(var(--i, 0) * 40ms);
  }

  &__item {
    position: relative;
    display: flex;
    align-items: center;
    gap: 1.6rem;
    padding: 1.2rem 0.8rem;
    color: t.$text-on-dark;
    text-decoration: none;
    transition:
      background-color 0.25s ease,
      padding 0.4s t.$ease-out;

    // brass needle on the left of the highlighted row
    &::before {
      content: '';
      position: absolute;
      left: 0;
      top: 50%;
      width: 2px;
      height: 0;
      background-color: t.$brass;
      transform: translateY(-50%);
      transition: height 0.35s t.$ease-out;
    }

    &--active,
    &:focus-visible {
      outline: none;
      background-color: rgba(190, 156, 121, 0.07);
      padding-left: 1.6rem;
      &::before {
        height: 60%;
      }
      .navbar-search__name {
        color: t.$brass-light;
      }
      .navbar-search__img {
        filter: none;
      }
    }

    // phones: the price drops below the name
    @media (max-width: 576px) {
      display: grid;
      grid-template-columns: auto auto 1fr;
      column-gap: 1.2rem;
      row-gap: 0.4rem;

      .navbar-search__index,
      .navbar-search__img {
        grid-row: span 2;
      }
    }
  }

  &__index {
    width: 2.4rem;
    flex-shrink: 0;
    font-family: t.$font-mono;
    font-size: 1.1rem;
    color: t.$brass;
  }

  &__img {
    width: 52px;
    height: 52px;
    object-fit: cover;
    border-radius: t.$radius-sm;
    flex-shrink: 0;
    filter: saturate(0.75);
    transition: filter 0.3s ease;

    @media (max-width: 576px) {
      width: 44px;
      height: 44px;
    }
  }

  &__name {
    font-family: t.$font-display;
    font-size: 2.2rem;
    line-height: 1.1;
    transition: color 0.25s;
    min-width: 0;

    @media (max-width: 576px) {
      font-size: 1.9rem;
      align-self: end;
    }
  }

  // dotted leader between name and price, like a price list
  &__leader {
    flex: 1;
    min-width: 2rem;
    height: 1px;
    margin-top: 0.8rem;
    background-image: radial-gradient(circle, rgba(190, 156, 121, 0.45) 0.75px, transparent 1px);
    background-size: 6px 2px;
    background-repeat: repeat-x;

    @media (max-width: 576px) {
      display: none;
    }
  }

  &__price {
    font-family: t.$font-mono;
    font-size: 1.4rem;
    color: t.$brass;
    white-space: nowrap;

    @media (max-width: 576px) {
      font-size: 1.25rem;
    }
  }

  &__empty {
    padding: 3rem 0;
    border-top: 1px solid t.$line-on-dark;
  }

  &__empty-title {
    font-family: t.$font-display;
    font-size: 2.6rem;
    margin-bottom: 0.8rem;
  }

  &__empty-text {
    font-size: 1.5rem;
    color: t.$muted-on-dark;

    button {
      background: none;
      border: none;
      padding: 0;
      color: t.$brass;
      font: inherit;
      text-decoration: underline;
      text-decoration-thickness: 1px;
      text-underline-offset: 3px;
      cursor: pointer;
      &:hover {
        color: t.$brass-light;
      }
    }
  }
}

@keyframes navbar-search-row-in {
  from {
    opacity: 0;
    transform: translateY(8px);
  }
  to {
    opacity: 1;
    transform: none;
  }
}

@media (prefers-reduced-motion: reduce) {
  .navbar,
  .navbar::before,
  .navbar::after,
  .navbar .navbar__menu .navbar__link::after,
  .navbar .navbar__img,
  .navbar .navbar__burger span {
    transition: none;
  }
  .navbar__menu-mobile .navbar__link,
  .navbar__menu-mobile .navbar__menu-mobile-foot,
  .navbar-search__row {
    animation: none;
  }
}
</style>
