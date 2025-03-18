<template>
  <div class="wrapper">
    <div class="overviewInfo product-image">
      <img :src="product.imgSrc" :alt="product.name" />
      <div class="cartbutton neurobutton" @click.stop="addToCart(product)">
        <v-btn icon>
          <v-icon>mdi-cart</v-icon>
        </v-btn>
      </div>
    </div>

    <div class="productSpecifications">
      <h1>{{ product.name }}</h1>
      <p>{{ product.description }}</p>

      <div class="productFeatures">
        <div class="feature" v-for="(feature, index) in features" :key="index">
          <div class="featureIcon">
            <v-icon v-if="feature.icon">{{ feature.icon }}</v-icon>
          </div>
          <div class="featureText">
            <p>
              <strong>{{ feature.title }}</strong>
            </p>
            <p>{{ feature.description }}</p>
          </div>
        </div>
      </div>

      <div class="price-detailButton">
        <div class="priceTag"><span>$</span>{{ product.price }}</div>
        <button class="details" @click="goToDetails">
          <p>Details</p>
          <div class="buttonaction">
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M23.0677 11.9929L18.818 7.75739L17.4061 9.17398L19.2415 11.0032L0.932469 11.0012L0.932251 13.0012L19.2369 13.0032L17.4155 14.8308L18.8321 16.2426L23.0677 11.9929Z"
                fill="currentColor"
              />
            </svg>
          </div>
        </button>
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
  data() {
    return {
      features: [
        { title: 'Premium', description: 'Quality', icon: 'mdi-star' },
        { title: 'Wireless', description: 'Technology', icon: 'mdi-access-point' },
        { title: 'Modern', description: 'Design', icon: 'mdi-new-box' },
        { title: 'Portable', description: 'Device', icon: 'mdi-usb' },
      ],
    }
  },
  methods: {
    addToCart(product) {
      this.$emit('add-to-cart', product)
    },
    goToDetails() {
      this.$router.push({ name: 'ProductDetails', params: { id: this.product.id } })
    },
  },
}
</script>

<style lang="scss">
@import url('https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500&display=swap');

:root {
  --bg-shape-color: linear-gradient(140deg, #6e8dff, #000000);
  --lightblue: #3d9dea;
  --darkblue: #4a4eee;
  --text-color: #d5e1ef;
}

*,
button,
input {
  margin: 0px;
  padding: 0px;
  box-sizing: border-box;
  font-family: 'Roboto', sans-serif;
}

.wrapper {
  width: 400px;
  border-radius: 40px;
  background-image: var(--bg-shape-color);
  overflow: hidden;
}

.productSpecifications {
  padding: 1.9rem;
  display: flex;
  flex-direction: column;
}

.overviewInfo {
  position: relative;
  height: 300px;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.product-image {
  position: relative;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
}

.cartbutton {
  position: absolute;
  top: 10px;
  right: 20px;
  z-index: 10;
  cursor: pointer;
  color: black;
}

.neurobutton {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  box-shadow:
    inset 3px 4px 5px 0px rgba(197, 197, 197, 0.1),
    inset 3px 6px 6px 5px rgba(78, 77, 77, 0.1),
    -2px -2px 8px 2px rgba(255, 255, 255, 0.1),
    2px 2px 6px 3px rgba(0, 0, 0, 0.4);
}

h1 {
  font-family: 'Roboto', sans-serif;
  margin-bottom: 0.5rem;
  font-size: 32px;
  color: var(--text-color);
}

.featureIcon {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 40px;
  height: 40px;
  background-image: var(--bg-shape-color);
  border-radius: 8px;
  margin-right: 16px;
}

.productSpecifications {
  color: var(--text-color);

  p {
    opacity: 0.8;
    font-size: 1.1rem;
    line-height: 1.4;
  }

  .productFeatures {
    display: grid;
    grid-template-columns: 1fr 1fr;
    margin-top: 20px;
    grid-row-gap: 16px;

    .feature {
      display: flex;
    }
  }
}

.price-detailButton {
  display: flex;
  width: 100%;
  background-image: var(--bg-shape-color);
  border-radius: 12px;
  overflow: hidden;
  box-shadow:
    -2px -2px 2px 0px rgba(80, 80, 80, 0.1),
    2px 2px 3px 0px rgba(12, 12, 12, 0.3),
    inset 0px 0px 0px 2px rgba(80, 80, 80, 0.2);
  margin-top: 1rem;
  padding: 14px;
  justify-content: space-between;
  align-items: center;
}

.priceTag {
  display: flex;
  align-items: center;
  font-size: 2.2rem;
  font-weight: 500;
}

.priceTag span {
  color: #efefef;
  font-size: 1.5rem;
  margin-right: 5px;
  font-weight: 400;
}

button.details {
  outline: 0;
  border: 0;
  border-radius: 6px;
  display: flex;
  align-items: center;
  overflow: hidden;
  background-image: linear-gradient(85deg, #61c7ef, #4833fb);
  color: white;
  cursor: pointer;
}

.details p {
  padding: 8px 17px;
  border-right: 1px solid rgba(0, 0, 0, 0.4);
}

.buttonaction {
  border-left: 1px solid rgba(255, 255, 255, 0.2);
  padding: 5px 5px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: rgba(255, 255, 255, 0.7);
}
</style>
