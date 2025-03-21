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
  //#46fbce8e
  --bg-shape-color: linear-gradient(145deg, #75c1ffaa, #000000);
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

  @media (max-width: 1024px) {
    width: 350px;
    border-radius: 30px;
  }

  @media (max-width: 768px) {
    width: 320px;
  }

  @media (max-width: 480px) {
    width: 85%;
    border-radius: 25px;
  }
}
.productSpecifications {
  padding: 1.9rem;
  display: flex;
  flex-direction: column;

  @media (max-width: 768px) {
    padding: 1.5rem;
  }

  @media (max-width: 480px) {
    padding: 1.2rem;
  }
}
.overviewInfo {
  position: relative;
  height: 300px;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;

  @media (max-width: 1024px) {
    height: 260px;
  }

  @media (max-width: 768px) {
    height: 240px;
  }

  @media (max-width: 480px) {
    height: 220px;
  }
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

  @media (max-width: 480px) {
    top: 15px;
    right: 15px;
  }
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

  @media (max-width: 768px) {
    width: 45px;
    height: 45px;
  }

  @media (max-width: 480px) {
    width: 50px;
    height: 40px;
  }
}
h1 {
  font-family: 'Roboto', sans-serif;
  margin-bottom: 0.5rem;
  font-size: 32px;
  color: var(--text-color);

  @media (max-width: 1024px) {
    font-size: 28px;
  }

  @media (max-width: 768px) {
    font-size: 24px;
  }

  @media (max-width: 480px) {
    font-size: 22px;
    margin-bottom: 0.3rem;
  }
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

  @media (max-width: 768px) {
    width: 35px;
    height: 35px;
    margin-right: 12px;
  }

  @media (max-width: 480px) {
    width: 30px;
    height: 30px;
    margin-right: 10px;
    border-radius: 6px;
  }
}
.productSpecifications {
  color: var(--text-color);
  p {
    opacity: 0.8;
    font-size: 1.1rem;
    line-height: 1.4;

    @media (max-width: 1024px) {
      font-size: 1rem;
    }

    @media (max-width: 768px) {
      line-height: 1.3;
    }

    @media (max-width: 480px) {
      line-height: 1.2;
    }
  }
  .productFeatures {
    display: grid;
    grid-template-columns: 1fr 1fr;
    margin-top: 20px;
    grid-row-gap: 16px;

    @media (max-width: 768px) {
      margin-top: 15px;
      grid-row-gap: 12px;
      grid-column-gap: 5px;
    }

    @media (max-width: 480px) {
      margin-top: 12px;
      grid-row-gap: 10px;
      grid-column-gap: 3px;
      grid-template-columns: 1fr 1fr;
    }

    .feature {
      display: flex;

      @media (max-width: 480px) {
        margin-bottom: 3px;
      }
    }

    .featureText {
      @media (max-width: 480px) {
        width: calc(100% - 40px);

        p {
          font-size: 0.9rem;
          line-height: 1.1;
          margin-bottom: 2px;
        }
      }
    }
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

    @media (max-width: 768px) {
      width: 35px;
      height: 35px;
      margin-right: 12px;
    }

    @media (max-width: 480px) {
      margin-right: 8px;
      border-radius: 6px;
      flex-shrink: 0;
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

    @media (max-width: 768px) {
      margin-top: 0.8rem;
      padding: 12px;
      border-radius: 10px;
    }

    @media (max-width: 480px) {
      margin-top: 0.7rem;
      padding: 10px;
      border-radius: 8px;
    }
  }
}
.priceTag {
  display: flex;
  align-items: center;
  font-size: 2.2rem;
  font-weight: 500;

  @media (max-width: 1024px) {
    font-size: 2rem;
  }

  @media (max-width: 768px) {
    font-size: 1.8rem;
  }

  @media (max-width: 480px) {
    font-size: 1.6rem;
  }
}
.priceTag span {
  color: #efefef;
  font-size: 1.5rem;
  margin-right: 5px;
  font-weight: 400;

  @media (max-width: 1024px) {
    font-size: 1.4rem;
  }

  @media (max-width: 768px) {
    font-size: 1.2rem;
  }

  @media (max-width: 480px) {
    font-size: 1.1rem;
    margin-right: 3px;
  }
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

  @media (max-width: 480px) {
    border-radius: 5px;
  }
}
.details p {
  padding: 8px 17px;
  border-right: 1px solid rgba(0, 0, 0, 0.4);

  @media (max-width: 768px) {
    padding: 7px 15px;
  }

  @media (max-width: 480px) {
    padding: 6px 12px;
    font-size: 0.9rem;
  }
}
.buttonaction {
  border-left: 1px solid rgba(255, 255, 255, 0.2);
  padding: 5px 5px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: rgba(255, 255, 255, 0.7);

  @media (max-width: 480px) {
    padding: 4px;

    svg {
      width: 20px;
      height: 20px;
    }
  }
}
</style>
