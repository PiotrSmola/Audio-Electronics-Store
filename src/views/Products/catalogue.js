// Small presentation helpers shared by the product list, the product card and the details page.
// Everything is derived from src/data/products.js - no extra product data lives here.

// Category is derived from the product name (first matching keyword wins)
const CATEGORY_RULES = [
  { label: 'Headphones', test: /headphone/i },
  { label: 'Speakers', test: /speaker|soundbar/i },
  { label: 'Amplification', test: /amplifier/i },
  { label: 'Vinyl', test: /turntable/i },
  { label: 'Studio & DJ', test: /mixer|dj/i },
]

export function categoryOf(product) {
  return CATEGORY_RULES.find((rule) => rule.test.test(product.name))?.label || 'Audio'
}

/** Categories in catalogue order with their product counts: [{ label, count }] */
export function categoriesOf(products) {
  const counts = new Map()
  for (const product of products) {
    const label = categoryOf(product)
    counts.set(label, (counts.get(label) || 0) + 1)
  }
  return CATEGORY_RULES.map((rule) => rule.label)
    .filter((label) => counts.has(label))
    .map((label) => ({ label, count: counts.get(label) }))
}

/** 3 -> "03" */
export function pad(number) {
  return String(number).padStart(2, '0')
}

/** "batteryLife" -> "Battery life" */
export function formatSpecKey(key) {
  const words = key.replace(/([A-Z])/g, ' $1').toLowerCase()
  return words.charAt(0).toUpperCase() + words.slice(1)
}

// Specs that say little on a card (they are still listed on the details page)
const CARD_SKIPPED_SPECS = ['dimensions', 'weight', 'warranty', 'software']

/** The first `count` characteristic specs of a product: [{ key, label, value }] */
export function keySpecs(product, count = 2) {
  return Object.entries(product.specifications || {})
    .filter(([key]) => !CARD_SKIPPED_SPECS.includes(key))
    .slice(0, count)
    .map(([key, value]) => ({ key, label: formatSpecKey(key), value }))
}

/** 299.99 -> "299.99" with a fixed two decimals */
export function formatPrice(price) {
  return Number(price).toFixed(2)
}
