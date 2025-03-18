import { defineStore } from 'pinia'

export const useCartStore = defineStore('cart', {
  state: () => ({
    items: JSON.parse(localStorage.getItem('CART')) || [],
  }),
  getters: {
    cartQuantity(state) {
      return state.items.reduce((sum, item) => sum + item.quantity, 0)
    },
  },
  actions: {
    addProduct(product) {
      const index = this.items.findIndex((item) => item.id === product.id)
      if (index !== -1) {
        this.items[index].quantity++
      } else {
        this.items.push({ ...product, quantity: 1 })
      }
      this.saveToLocalStorage()
    },
    updateQuantity(productId, newQuantity) {
      const index = this.items.findIndex((item) => item.id === productId)
      if (index !== -1) {
        this.items[index].quantity = newQuantity
        this.saveToLocalStorage()
      }
    },
    removeItem(productId) {
      this.items = this.items.filter((item) => item.id !== productId)
      this.saveToLocalStorage()
    },
    saveToLocalStorage() {
      localStorage.setItem('CART', JSON.stringify(this.items))
    },
  },
})
