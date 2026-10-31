import { useCartStore } from '@/stores/cartStore'
import { useToast } from './useToast'
import { flyToCart } from './useFlyToCart'

/**
 * Shared "add to cart" flow used by product cards and the product details page:
 * the product image flies into the navbar cart, then the cart is updated (so the badge reacts
 * when the image lands) and a toast confirms it. Without motion it all happens immediately.
 */
export function useAddToCart() {
  /**
   * @param {object} product - product from src/data/products.js
   * @param {Element} [sourceEl] - image (or its container) the flight starts from
   * @param {object} [flightOptions] - forwarded to flyToCart (e.g. { imageSrc })
   * @returns {Promise<void>}
   */
  async function addToCart(product, sourceEl, flightOptions = {}) {
    if (sourceEl) await flyToCart(sourceEl, { imageSrc: product?.imgSrc, ...flightOptions })
    useCartStore().addProduct(product)
    useToast().showToast(`Added ${product.name} to cart!`, 'success')
  }

  return { addToCart }
}
