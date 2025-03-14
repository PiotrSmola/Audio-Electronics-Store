<template>
  <div class="shopping-cart" :class="{ 'shopping-cart--active': active }">
    <h2 class="shopping-cart__title">Your Cart</h2>
    <ul class="shopping-cart__items">
      <li v-for="item in cart" :key="item.id" class="shopping-cart__item">
        <img :src="item.imgSrc" :alt="item.name" class="shopping-cart__img" />
        <span class="shopping-cart__name">{{ item.name }}</span>
        <div class="shopping-cart__quantity">
          <button @click="changeQuantity('minus', item)">-</button>
          <span>{{ item.quantity }}</span>
          <button @click="changeQuantity('plus', item)">+</button>
        </div>
        <span class="shopping-cart__price">{{ formatPrice(item.price * item.quantity) }}</span>
        <button class="shopping-cart__remove" @click="removeItem(item.id)">
          <i class="fa-solid fa-trash"></i>
        </button>
      </li>
    </ul>
    <div class="shopping-cart__subtotal">Total: {{ formatPrice(subtotal) }}</div>
    <button class="shopping-cart__checkout" @click="checkout">Checkout</button>
    <button class="shopping-cart__close" @click="toggleCart">Close</button>
  </div>
</template>

<script>
export default {
  name: 'ShoppingCartComponent',
  data() {
    return {
      active: true,
      cart: JSON.parse(localStorage.getItem('CART')) || [],
    }
  },
  computed: {
    subtotal() {
      return this.cart.reduce((sum, item) => sum + item.price * item.quantity, 0)
    },
  },
  methods: {
    toggleCart() {
      this.active = !this.active
      this.$emit('close')
    },
    changeQuantity(action, item) {
      if (action === 'plus') {
        item.quantity++
      } else if (action === 'minus' && item.quantity > 1) {
        item.quantity--
      }
      this.updateCart()
    },
    removeItem(id) {
      this.cart = this.cart.filter((item) => item.id !== id)
      this.updateCart()
    },
    updateCart() {
      localStorage.setItem('CART', JSON.stringify(this.cart))
    },
    formatPrice(value) {
      return `$${value.toFixed(2)}`
    },
    checkout() {
      alert('Proceeding to checkout!')
    },
  },
}
</script>

<style lang="scss">
@use '@/assets/scss/main.scss' as *;

.shopping-cart {
  position: fixed;
  top: 0;
  right: 0;
  width: 400px;
  background-color: #fff;
  box-shadow: -2px 0 5px rgba(0, 0, 0, 0.3);
  padding: 1rem;
  transform: translateX(100%);
  transition: transform 0.3s ease;

  &--active {
    transform: translateX(0);
  }

  &__title {
    font-size: 2rem;
    margin-bottom: 1rem;
  }

  &__items {
    list-style: none;
    max-height: 400px;
    overflow-y: auto;

    li {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 1rem;
    }
  }

  &__img {
    width: 50px;
    height: 50px;
    object-fit: cover;
  }

  &__name {
    flex: 1;
    margin: 0 1rem;
  }

  &__quantity {
    display: flex;
    align-items: center;
    button {
      background-color: #1976d2;
      color: #fff;
      border: none;
      padding: 0.2rem 0.5rem;
      cursor: pointer;
    }
  }

  &__price {
    font-size: 1.6rem;
    margin: 0 1rem;
  }

  &__remove {
    background: none;
    border: none;
    cursor: pointer;
    color: red;
  }

  &__subtotal {
    font-size: 1.8rem;
    text-align: right;
    margin-top: 1rem;
  }

  &__checkout,
  &__close {
    width: 100%;
    padding: 1rem;
    margin-top: 1rem;
    background-color: #1976d2;
    color: #fff;
    border: none;
    cursor: pointer;
    border-radius: 3px;
    transition: background-color 0.3s;

    &:hover {
      background-color: #1565c0;
    }
  }

  @media (max-width: 1024px) {
    width: 100%;
  }
}
</style>
