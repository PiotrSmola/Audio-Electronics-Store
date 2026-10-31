import { prefersReducedMotion } from './useMotionPreferences'

// `v-appear`: reveals an element the first time it scrolls into view.
// Local to the product views (register with `directives: { appear: appearDirective }`).
//
//   v-appear                       -> rises from below
//   v-appear="'left'"              -> slides in from the left
//   v-appear="{ variant: 'rise', delay: 100, onVisible: (el) => {} }"
//
// Elements entering the viewport together are staggered automatically (in DOM order).
// The element always receives the `is-visible` class when revealed, so CSS can hook extra
// effects onto it (variant 'none' = class + callback only, no built-in animation).
// Uses the individual `translate`/`scale` properties, so it composes with any `transform`
// (e.g. the card tilt) instead of overriding it.

const VARIANTS = {
  up: { opacity: 0, translate: '0 32px' },
  rise: { opacity: 0, translate: '0 48px', scale: '0.94' },
  left: { opacity: 0, translate: '-24px 0' },
  scale: { opacity: 0, scale: '0.92' },
  fade: { opacity: 0 },
  none: null,
}

const STAGGER = 90
const DURATION = 800
const EASING = 'cubic-bezier(0.22, 1, 0.36, 1)'

const configs = new WeakMap()
let observer = null

function normalize(value) {
  const options = typeof value === 'string' ? { variant: value } : { ...(value || {}) }
  return {
    variant: options.variant in VARIANTS ? options.variant : 'up',
    delay: options.delay || 0,
    duration: options.duration || DURATION,
    onVisible: typeof options.onVisible === 'function' ? options.onVisible : null,
  }
}

function reveal(el, order = 0) {
  const config = configs.get(el)
  if (!config) return
  configs.delete(el)
  observer?.unobserve(el)

  el.style.opacity = config.initialOpacity
  el.classList.add('is-visible')

  const from = VARIANTS[config.variant]
  if (from && !prefersReducedMotion() && typeof el.animate === 'function') {
    try {
      // Only the start keyframe: the end is the element's own (CSS) state
      el.animate([{ ...from, offset: 0 }], {
        duration: config.duration,
        delay: config.delay + order * STAGGER,
        easing: EASING,
        fill: 'backwards',
      })
    } catch {
      // Older engines without implicit keyframes: the element is simply shown
    }
  }
  config.onVisible?.(el)
}

function getObserver() {
  if (observer) return observer
  observer = new IntersectionObserver(
    (entries) => {
      let order = 0
      for (const entry of entries) {
        if (entry.isIntersecting) reveal(entry.target, order++)
      }
    },
    { rootMargin: '0px 0px -6% 0px', threshold: 0.12 },
  )
  return observer
}

export const appearDirective = {
  mounted(el, binding) {
    const config = { ...normalize(binding.value), initialOpacity: el.style.opacity }
    configs.set(el, config)

    if (prefersReducedMotion() || typeof IntersectionObserver === 'undefined') {
      reveal(el)
      return
    }
    if (VARIANTS[config.variant]) el.style.opacity = '0'
    getObserver().observe(el)
  },
  unmounted(el) {
    configs.delete(el)
    observer?.unobserve(el)
  },
}

export function useAppear() {
  return { appearDirective }
}
