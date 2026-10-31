import { defineStore } from 'pinia'
import { getProductById } from '@/data/products'

const STORAGE_KEY = 'CART'

// Only `{ id, quantity }` is persisted. Product data (name, price, image) is always
// resolved from src/data/products.js, so it never goes stale after a rebuild.
function loadFromLocalStorage() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY))
    if (!Array.isArray(saved)) return []
    return saved
      .map((item) => ({ id: Number(item?.id), quantity: Math.floor(Number(item?.quantity)) }))
      .filter((item) => getProductById(item.id) && item.quantity > 0)
  } catch {
    return []
  }
}

export const useCartStore = defineStore('cart', {
  state: () => ({
    items: loadFromLocalStorage(),
    isOpen: false,
  }),
  getters: {
    cartQuantity(state) {
      return state.items.reduce((sum, item) => sum + item.quantity, 0)
    },
    detailedItems(state) {
      return state.items
        .map((item) => {
          const product = getProductById(item.id)
          return product ? { ...product, quantity: item.quantity } : null
        })
        .filter(Boolean)
    },
    subtotal() {
      return this.detailedItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
    },
  },
  actions: {
    addProduct(product) {
      if (!getProductById(product?.id)) return
      const index = this.items.findIndex((item) => item.id === product.id)
      if (index !== -1) {
        this.items[index].quantity++
      } else {
        this.items.push({ id: product.id, quantity: 1 })
      }
      this.saveToLocalStorage()
    },
    updateQuantity(productId, newQuantity) {
      const index = this.items.findIndex((item) => item.id === productId)
      if (index !== -1 && newQuantity > 0) {
        this.items[index].quantity = newQuantity
        this.saveToLocalStorage()
      }
    },
    removeItem(productId) {
      this.items = this.items.filter((item) => item.id !== productId)
      this.saveToLocalStorage()
    },
    clearCart() {
      this.items = []
      this.saveToLocalStorage()
    },
    saveToLocalStorage() {
      try {
        localStorage.setItem(
          STORAGE_KEY,
          JSON.stringify(this.items.map(({ id, quantity }) => ({ id, quantity }))),
        )
      } catch {
        // Storage can be unavailable (private mode, quota exceeded) - the cart still works in memory
      }
    },
    openCart() {
      this.isOpen = true
    },
    closeCart() {
      this.isOpen = false
    },
    toggleCart() {
      this.isOpen = !this.isOpen
    },
  },
})
