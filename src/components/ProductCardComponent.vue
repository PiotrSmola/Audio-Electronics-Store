<template>
  <div class="product-card">
    <img :src="product.imgSrc" :alt="product.name" class="product-card__image" />
    <div class="product-card__content">
      <h2 class="product-card__name">{{ product.name }}</h2>
      <p class="product-card__price">${{ product.price }}</p>
      <p class="product-card__description">{{ product.description }}</p>
      <div class="product-card__buttons">
        <button @click="viewDetails">Szczegóły</button>
        <button @click="addToCart">Dodaj do koszyka</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ProductCardComponent',
  props: {
    product: {
      type: Object,
      required: true,
    },
  },
  methods: {
    viewDetails() {
      window.location.href = `productDetail.html?id=${this.product.id}`
    },
    addToCart() {
      this.$emit('add-to-cart', this.product)
    },
  },
}
</script>

<style lang="scss">
.product-card {
  border: 1px solid #ddd;
  padding: 1rem;
  width: 300px;
  display: flex;
  flex-direction: column;
  align-items: center;

  &__image {
    width: 100%;
    height: auto;
    margin-bottom: 1rem;
  }

  &__content {
    text-align: center;
  }

  &__name {
    font-size: 1.8rem;
    margin-bottom: 0.5rem;
  }

  &__price {
    font-size: 1.6rem;
    color: #1976d2;
    margin-bottom: 0.5rem;
  }

  &__description {
    font-size: 1.4rem;
    margin-bottom: 1rem;
  }

  &__buttons {
    display: flex;
    gap: 1rem;

    button {
      padding: 0.5rem 1rem;
      border: none;
      background-color: #1976d2;
      color: #fff;
      border-radius: 3px;
      cursor: pointer;
      transition: background-color 0.3s;

      &:hover {
        background-color: #1565c0;
      }
    }
  }

  @media (max-width: 1024px) {
    width: 90%;
  }
}
</style>
