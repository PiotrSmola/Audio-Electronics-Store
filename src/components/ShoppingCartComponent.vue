<template>
  <div class="shopping-cart" :class="{ 'shopping-cart--active': active }">
    <h2 class="shopping-cart__title">Your Cart</h2>
    <ul class="shopping-cart__items">
      <li v-for="item in cartItems" :key="item.id" class="shopping-cart__item">
        <img :src="item.imgSrc" :alt="item.name" class="shopping-cart__img" />
        <span class="shopping-cart__name">{{ item.name }}</span>
        <div class="shopping-cart__quantity">
          <button class="changeQuantity" @click="changeQuantity('minus', item)">-</button>
          <span class="item_quantity">{{ item.quantity }}</span>
          <button class="changeQuantity" @click="changeQuantity('plus', item)">+</button>
        </div>
        <span class="shopping-cart__price">{{ formatPrice(item.price * item.quantity) }}</span>
        <button class="shopping-cart__remove" @click="removeItem(item.id)">
          <v-icon>mdi-trash-can</v-icon>
        </button>
      </li>
    </ul>
    <div class="shopping-cart__subtotal">Total: {{ formatPrice(subtotal) }}</div>
    <button class="shopping-cart__checkout" @click="checkout">Checkout</button>
    <button class="shopping-cart__close" @click="toggleCart">Close</button>
  </div>
</template>

<script>
import { useCartStore } from '@/stores/cartStore'

export default {
  name: 'ShoppingCartComponent',
  data() {
    return {
      active: true,
    }
  },
  computed: {
    cartStore() {
      return useCartStore()
    },
    cartItems() {
      return this.cartStore.items
    },
    subtotal() {
      return this.cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
    },
  },
  methods: {
    toggleCart() {
      this.active = !this.active
      this.$emit('close')
    },
    changeQuantity(action, item) {
      const cartStore = useCartStore()
      if (action === 'plus') {
        cartStore.updateQuantity(item.id, item.quantity + 1)
      } else if (action === 'minus' && item.quantity > 1) {
        cartStore.updateQuantity(item.id, item.quantity - 1)
      }
    },
    removeItem(id) {
      const cartStore = useCartStore()
      cartStore.removeItem(id)
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
  width: 500px;
  background-color: #fff;
  box-shadow: -2px 0 5px rgba(0, 0, 0, 0.3);
  padding: 1.2rem;
  transform: translateX(100%);
  transition: transform 0.3s ease;
  overflow-y: auto;

  @media (max-width: 1024px) {
    padding: 1rem;
    width: 400px;
  }

  @media (max-width: 768px) {
    width: 100%;
    padding: 0.8rem;
  }

  @media (max-width: 480px) {
    padding: 0.6rem;
  }

  &--active {
    transform: translateX(0);
  }

  &__title {
    font-size: 2rem;
    margin-bottom: 1rem;
    color: #000;

    @media (max-width: 768px) {
      font-size: 1.8rem;
      text-align: center;
    }

    @media (max-width: 480px) {
      font-size: 1.5rem;
      margin-bottom: 0.8rem;
    }
  }

  &__items {
    list-style: none;
    max-height: 400px;
    overflow-y: auto;
    width: 100%;

    @media (max-width: 768px) {
      max-height: calc(100vh - 250px);
    }

    @media (max-width: 480px) {
      max-height: calc(100vh - 200px);
    }

    li {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 1rem;

      @media (max-width: 480px) {
        margin-bottom: 0.8rem;
        flex-wrap: wrap;
      }
    }
  }

  &__item {
    display: flex;
    align-items: center;
    font-size: 1.1rem;
    width: 100%;

    @media (max-width: 768px) {
      font-size: 1rem;
    }

    @media (max-width: 480px) {
      font-size: 0.9rem;
      flex-wrap: wrap;
    }
  }

  &__img {
    width: 50px;
    height: 50px;
    object-fit: cover;

    @media (max-width: 480px) {
      width: 40px;
      height: 40px;
    }
  }

  &__name {
    flex: 1;
    margin: 0 1rem;

    @media (max-width: 480px) {
      margin: 0 0.5rem;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
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

      @media (max-width: 480px) {
        padding: 0.15rem 0.4rem;
      }
    }
  }

  .item_quantity {
    margin: 0 0.5rem;

    @media (max-width: 480px) {
      margin: 0 0.3rem;
    }
  }

  .changeQuantity {
    font-size: 1rem;
    width: 30px;
    height: 30px;

    @media (max-width: 480px) {
      font-size: 0.9rem;
      width: 25px;
      height: 25px;
    }
  }

  &__price {
    font-size: 1.2rem;
    margin-left: 1rem;

    @media (max-width: 768px) {
      font-size: 1.1rem;
      margin-left: 0.8rem;
    }

    @media (max-width: 480px) {
      font-size: 1rem;
      margin-left: 1.5rem;
    }
  }

  &__remove {
    background: none;
    border: none;
    cursor: pointer;
    color: red;
    font-size: 1.5rem;
    margin-left: 0.8rem;

    @media (max-width: 768px) {
      font-size: 1.3rem;
      margin-left: 0.6rem;
    }

    @media (max-width: 480px) {
      font-size: 1.2rem;
      margin-left: 0.5rem;
    }
  }

  &__subtotal {
    font-size: 1.6rem;
    text-align: right;
    margin-top: 1rem;
    font-weight: bold;

    @media (max-width: 768px) {
      font-size: 1.4rem;
    }

    @media (max-width: 480px) {
      font-size: 1.2rem;
      text-align: center;
    }
  }

  &__checkout,
  &__close {
    width: 100%;
    padding: 0.7rem;
    margin-top: 1rem;
    background-color: #1976d2;
    font-size: 1.5rem;
    color: #fff;
    border: none;
    cursor: pointer;
    border-radius: 3px;
    transition: background-color 0.3s;

    @media (max-width: 768px) {
      padding: 0.6rem;
      font-size: 1.3rem;
    }

    @media (max-width: 480px) {
      padding: 0.5rem;
      font-size: 1.1rem;
      margin-top: 0.8rem;
    }

    &:hover {
      background-color: #1565c0;
    }
  }
}
</style>
