<template>
  <div class="products-body">
    <header class="header-products ae-grain">
      <MusicNotesComponent :count="7" tone="brass" :seed="23" :min-size="14" :max-size="28" />
      <div class="header-products__body">
        <p class="ae-eyebrow header-products__text">The catalogue · {{ countLabel }} pieces</p>
        <h1 class="header-products__heading ae-display">
          <!-- words rise one by one out of a mask (pure CSS, see Products.scss) -->
          <template v-for="(word, index) in headingWords" :key="word + index">
            <span
              class="header-products__word"
              :class="{ 'header-products__word--accent': index === headingWords.length - 1 }"
              :style="{ '--word-index': index }"
              ><span class="header-products__word-inner">{{ word }}</span></span
            >{{ index < headingWords.length - 1 ? ' ' : '' }}
          </template>
        </h1>
        <p class="header-products__lede">
          Amplifiers, speakers, headphones and studio gear, picked for how they sound rather than
          how they look on a spec sheet. Exclusive prices on every piece.
        </p>
        <router-link class="header-products__link" :to="{ hash: '#products' }">
          Browse the collection<span aria-hidden="true">↓</span>
        </router-link>
      </div>

      <!-- category index: jumps straight to the filtered catalogue -->
      <nav class="header-products__index" aria-label="Browse by category">
        <button
          v-for="(filter, index) in categoryFilters"
          :key="filter.label"
          type="button"
          class="header-products__index-item"
          @click="browseCategory(filter.value)"
        >
          <span class="header-products__index-number">{{ pad(index + 1) }}</span>
          <span class="header-products__index-label">{{ filter.label }}</span>
          <span class="header-products__index-count">{{ pad(filter.count) }}</span>
        </button>
      </nav>
    </header>

    <main class="products" id="products">
      <div class="products__container">
        <section class="products__header">
          <div class="products__header-lead">
            <p v-appear class="ae-eyebrow">01 — Collection</p>
            <h2 v-appear class="products__header__title ae-display">
              Gear for <em>careful</em> listening
            </h2>
          </div>
          <p v-appear class="products__header__subtitle">
            Find the perfect audio equipment for you. Our collection caters to every audiophile's
            needs, so you can find the right blend of performance and style for your own setup.
          </p>
        </section>

        <div class="products__toolbar">
          <div class="products__filters" role="group" aria-label="Filter by category">
            <button
              v-for="filter in filters"
              :key="filter.label"
              type="button"
              class="products__filter"
              :class="{ 'is-active': activeCategory === filter.value }"
              :aria-pressed="activeCategory === filter.value ? 'true' : 'false'"
              @click="setCategory(filter.value)"
            >
              {{ filter.label }}<span class="products__filter-count">{{ filter.count }}</span>
            </button>
          </div>
          <div class="products__sort" role="group" aria-label="Sort products">
            <span class="products__sort-label">Sort</span>
            <button
              v-for="option in sortOptions"
              :key="option.value"
              type="button"
              class="products__sort-option"
              :class="{ 'is-active': sort === option.value }"
              :aria-pressed="sort === option.value ? 'true' : 'false'"
              @click="sort = option.value"
            >
              {{ option.label }}
            </button>
          </div>
        </div>

        <p class="products__count" aria-live="polite">
          Showing {{ pad(displayedProducts.length) }} / {{ pad(filteredProducts.length) }}
        </p>

        <!-- re-keyed on filter/sort so the cards deal themselves in again -->
        <section :key="listKey" class="products__list">
          <!-- v-appear: cards rise in (staggered) as they scroll into view, incl. "See All" -->
          <ProductCardComponent
            v-for="product in displayedProducts"
            :key="product.id"
            v-appear="'rise'"
            :product="product"
            @add-to-cart="addToCart"
          />
        </section>

        <Transition name="load-more">
          <div v-if="hasMore" class="products__load-more">
            <button class="see-all-button" @click="showAllProducts = true">
              See all {{ pad(filteredProducts.length) }} products
            </button>
          </div>
        </Transition>
      </div>
    </main>
  </div>
</template>

<script>
import ProductCardComponent from '@/components/ProductCardComponent.vue'
import MusicNotesComponent from '@/components/decor/MusicNotesComponent.vue'
import { useAddToCart } from '@/composables/useAddToCart'
import { appearDirective } from '@/composables/useAppear'
import { prefersReducedMotion } from '@/composables/useMotionPreferences'
import { products } from '@/data/products'
import { categoriesOf, categoryOf, pad } from './catalogue'

const SORTERS = {
  featured: null,
  'price-asc': (a, b) => a.price - b.price,
  'price-desc': (a, b) => b.price - a.price,
}

export default {
  name: 'ProductsView',
  components: {
    ProductCardComponent,
    MusicNotesComponent,
  },
  directives: {
    appear: appearDirective,
  },
  data() {
    return {
      headingWords: ['Experience', 'superior', 'sound.'],
      initialProductCount: 6,
      showAllProducts: false,
      activeCategory: null,
      sort: 'featured',
      sortOptions: [
        { value: 'featured', label: 'Featured' },
        { value: 'price-asc', label: 'Price ↑' },
        { value: 'price-desc', label: 'Price ↓' },
      ],
      products,
    }
  },
  computed: {
    countLabel() {
      return pad(this.products.length)
    },
    filters() {
      return [
        { label: 'All', value: null, count: this.products.length },
        ...categoriesOf(this.products).map((c) => ({ ...c, value: c.label })),
      ]
    },
    categoryFilters() {
      return this.filters.slice(1)
    },
    filteredProducts() {
      const list = this.activeCategory
        ? this.products.filter((p) => categoryOf(p) === this.activeCategory)
        : [...this.products]
      const sorter = SORTERS[this.sort]
      return sorter ? list.sort(sorter) : list
    },
    displayedProducts() {
      if (this.showAllProducts) return this.filteredProducts
      return this.filteredProducts.slice(0, this.initialProductCount)
    },
    hasMore() {
      return !this.showAllProducts && this.filteredProducts.length > this.initialProductCount
    },
    listKey() {
      return `${this.activeCategory || 'all'}-${this.sort}`
    },
  },
  methods: {
    pad,
    setCategory(value) {
      this.activeCategory = value
    },
    browseCategory(value) {
      this.setCategory(value)
      document.getElementById('products')?.scrollIntoView({
        behavior: prefersReducedMotion() ? 'auto' : 'smooth',
      })
    },
    addToCart(product, imageEl) {
      useAddToCart().addToCart(product, imageEl)
    },
  },
}
</script>

<style lang="scss" src="./Products.scss"></style>
