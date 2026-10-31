import { prefersReducedMotion } from './useMotionPreferences'

// "Fly to cart": a copy of the product image detaches from the page, travels along an arc
// into the navbar cart button while shrinking and fading, and the button reacts on landing.
// Built on the Web Animations API - no dependencies, transform/opacity only.

const DEFAULT_TARGET = '.navbar__cart-btn'
const DEFAULT_DURATION = 850
const PATH_STEPS = 24
const LIFT_PHASE = 0.14 // share of the timeline spent "lifting" the image before it flies
const MAX_START_SIZE = 200
const END_SIZE = 26
const VIEWPORT_MARGIN = 14
const ACCENT = 'rgba(190, 156, 121, 0.9)' // #be9c79 - the site's accent colour

const easeInOutCubic = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2)

function quadraticBezier(p0, p1, p2, t) {
  const u = 1 - t
  return u * u * p0 + 2 * u * t * p1 + t * t * p2
}

function isRendered(rect) {
  return rect.width > 0 && rect.height > 0
}

function resolveElement(target) {
  if (!target) return null
  return typeof target === 'string' ? document.querySelector(target) : target
}

function resolveImageSource(source) {
  if (source instanceof HTMLImageElement) return source.currentSrc || source.src
  const img = source.querySelector?.('img')
  return img ? img.currentSrc || img.src : null
}

function createClone(src, left, top, size) {
  const clone = document.createElement('img')
  clone.src = src
  clone.alt = ''
  clone.setAttribute('aria-hidden', 'true')
  Object.assign(clone.style, {
    position: 'fixed',
    left: `${left}px`,
    top: `${top}px`,
    width: `${size}px`,
    height: `${size}px`,
    objectFit: 'cover',
    borderRadius: '18px',
    boxShadow: '0 18px 40px rgba(0, 0, 0, 0.35)',
    pointerEvents: 'none',
    zIndex: '10001',
    willChange: 'transform, opacity',
    margin: '0',
  })
  return clone
}

function buildFlightKeyframes(start, end, control, endScale) {
  const keyframes = [
    { offset: 0, transform: 'translate(0px, 0px) rotate(0deg) scale(1)', opacity: 1 },
    {
      offset: LIFT_PHASE,
      transform: 'translate(0px, -10px) rotate(-3deg) scale(1.08)',
      opacity: 1,
      boxShadow: '0 26px 50px rgba(0, 0, 0, 0.4)',
    },
  ]
  for (let i = 1; i <= PATH_STEPS; i++) {
    const t = i / PATH_STEPS
    const eased = easeInOutCubic(t)
    const x = quadraticBezier(start.x, control.x, end.x, eased) - start.x
    const y = quadraticBezier(start.y, control.y, end.y, eased) - start.y - 10 * (1 - eased)
    const scale = 1.08 + (endScale - 1.08) * Math.pow(eased, 0.9)
    const rotate = -3 - 12 * Math.sin(Math.PI * eased)
    keyframes.push({
      offset: LIFT_PHASE + (1 - LIFT_PHASE) * t,
      transform: `translate(${x.toFixed(2)}px, ${y.toFixed(2)}px) rotate(${rotate.toFixed(2)}deg) scale(${scale.toFixed(4)})`,
      opacity: t < 0.7 ? 1 : 1 - ((t - 0.7) / 0.3) * 0.8,
      borderRadius: t > 0.5 ? '50%' : '18px',
    })
  }
  return keyframes
}

function celebrateLanding(targetEl, point) {
  // a soft ring expanding from the cart + a small squash of the button
  const ring = document.createElement('span')
  ring.setAttribute('aria-hidden', 'true')
  Object.assign(ring.style, {
    position: 'fixed',
    left: `${point.x - 22}px`,
    top: `${point.y - 22}px`,
    width: '44px',
    height: '44px',
    borderRadius: '50%',
    border: `2px solid ${ACCENT}`,
    pointerEvents: 'none',
    zIndex: '10001',
  })
  document.body.appendChild(ring)
  const ringAnimation = ring.animate(
    [
      { transform: 'scale(0.4)', opacity: 0.9 },
      { transform: 'scale(1.7)', opacity: 0 },
    ],
    { duration: 520, easing: 'cubic-bezier(0.22, 1, 0.36, 1)' },
  )
  ringAnimation.onfinish = ringAnimation.oncancel = () => ring.remove()

  // `scale` (not `transform`) so it composes with whatever transform the navbar applies
  targetEl.animate([{ scale: '1' }, { scale: '1.18' }, { scale: '0.94' }, { scale: '1' }], {
    duration: 480,
    easing: 'ease-out',
  })
}

/**
 * Animate a product image into the cart button.
 *
 * @param {Element} source - the image (or an element containing it) to fly from
 * @param {object} [options]
 * @param {string} [options.imageSrc] - image to use (defaults to the source's <img>)
 * @param {string|Element} [options.target='.navbar__cart-btn'] - where the image lands
 * @param {number} [options.duration=850] - flight time in ms
 * @returns {Promise<boolean>} resolves when the image has landed (true) or immediately when the
 *   animation was skipped (false: reduced motion, missing/hidden target, no image, no WAAPI).
 *   It never rejects, so callers can always `await` it before updating the cart.
 */
export function flyToCart(source, options = {}) {
  const { imageSrc, target = DEFAULT_TARGET, duration = DEFAULT_DURATION } = options

  return new Promise((resolve) => {
    try {
      const targetEl = resolveElement(target)
      if (
        !source?.getBoundingClientRect ||
        !targetEl ||
        prefersReducedMotion() ||
        typeof Element.prototype.animate !== 'function'
      ) {
        resolve(false)
        return
      }

      const from = source.getBoundingClientRect()
      const to = targetEl.getBoundingClientRect()
      const src = imageSrc || resolveImageSource(source)
      if (!src || !isRendered(from) || !isRendered(to)) {
        resolve(false)
        return
      }

      const size = Math.min(from.width, from.height, MAX_START_SIZE)
      const start = { x: from.left + from.width / 2, y: from.top + from.height / 2 }
      // The navbar is not fixed: when it is scrolled away, aim at the top edge of the viewport
      // right below the cart, so the image visibly "goes up" to it.
      const end = {
        x: Math.min(
          Math.max(to.left + to.width / 2, VIEWPORT_MARGIN),
          window.innerWidth - VIEWPORT_MARGIN,
        ),
        y: Math.min(
          Math.max(to.top + to.height / 2, VIEWPORT_MARGIN),
          window.innerHeight - VIEWPORT_MARGIN,
        ),
      }
      const lift = Math.max(90, Math.hypot(end.x - start.x, end.y - start.y) * 0.28)
      const control = {
        x: start.x + (end.x - start.x) * 0.35,
        y: Math.max(Math.min(start.y, end.y) - lift, -40),
      }

      const clone = createClone(src, start.x - size / 2, start.y - size / 2, size)
      document.body.appendChild(clone)

      let settled = false
      const finish = (landed) => {
        if (settled) return
        settled = true
        clone.remove()
        if (landed) celebrateLanding(targetEl, end)
        resolve(landed)
      }

      const animation = clone.animate(buildFlightKeyframes(start, end, control, END_SIZE / size), {
        duration,
        easing: 'linear', // the easing is baked into the sampled path
        fill: 'forwards',
      })
      animation.onfinish = () => finish(true)
      animation.oncancel = () => finish(false)
      // Safety net: background tabs may pause the animation timeline
      setTimeout(() => finish(true), duration + 400)
    } catch {
      resolve(false)
    }
  })
}

export function useFlyToCart() {
  return { flyToCart }
}
