// v-reveal: scroll-triggered entrance animations.
//
// Usage
//   v-reveal                         fade up (default)
//   v-reveal:left / :right / :down   slide in from that side
//   v-reveal:zoom                    scale up from slightly smaller, with a soft blur
//   v-reveal:fade                    opacity only
//   v-reveal:words                   heading reveal: every word rises out of a mask, staggered
//   v-reveal="150"                   delay in ms (shorthand for { delay: 150 })
//   v-reveal="{ delay, duration, distance, stagger, rootMargin }"
//   v-reveal.stagger                 animate the element's direct children one after another
//                                    (variant from the arg, step from `stagger`, default 110ms)
//
// The element is revealed once, when it scrolls into view. Without IntersectionObserver or with
// `prefers-reduced-motion: reduce` the content is shown immediately, without any movement.
// The hidden state lives in data attributes (not classes), so Vue re-rendering `class` never
// leaves an element stuck invisible. Styles: src/assets/scss/motion.scss.

const EASE_OUT = 'cubic-bezier(0.22, 1, 0.36, 1)'
const DEFAULT_ROOT_MARGIN = '0px 0px -10% 0px'
const MAX_STAGGER_STEPS = 8

const states = new WeakMap()
const observers = new Map()

const isBrowser = typeof window !== 'undefined'

function prefersReducedMotion() {
  return isBrowser && !!window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
}

function canAnimate(el) {
  return typeof el.animate === 'function' && !prefersReducedMotion()
}

function parseOptions(binding) {
  const value = binding.value
  const options = typeof value === 'number' ? { delay: value } : { ...(value || {}) }
  return {
    variant: binding.arg || options.variant || 'up',
    stagger: binding.modifiers.stagger || options.stagger != null,
    staggerStep: typeof options.stagger === 'number' ? options.stagger : 110,
    delay: options.delay || 0,
    duration: options.duration || (binding.arg === 'words' ? 900 : 800),
    distance: options.distance,
    rootMargin: options.rootMargin || DEFAULT_ROOT_MARGIN,
  }
}

function keyframesFor(variant, distance) {
  // Smaller offsets on narrow screens keep the motion calm and avoid overflow
  const d = distance ?? (isBrowser && window.innerWidth < 600 ? 24 : 48)
  switch (variant) {
    case 'left':
      return [
        { opacity: 0, translate: `${-d}px 0` },
        { opacity: 1, translate: '0 0' },
      ]
    case 'right':
      return [
        { opacity: 0, translate: `${d}px 0` },
        { opacity: 1, translate: '0 0' },
      ]
    case 'down':
      return [
        { opacity: 0, translate: `0 ${-d}px` },
        { opacity: 1, translate: '0 0' },
      ]
    case 'zoom':
      return [
        { opacity: 0, scale: '0.92', filter: 'blur(6px)' },
        { opacity: 1, scale: '1', filter: 'blur(0px)' },
      ]
    case 'fade':
      return [{ opacity: 0 }, { opacity: 1 }]
    default:
      return [
        { opacity: 0, translate: `0 ${d}px` },
        { opacity: 1, translate: '0 0' },
      ]
  }
}

// Wraps every word of the element's own text nodes in a mask (outer span) and a moving inner
// span. Element children such as <br> or icons are left untouched. Whitespace stays as text,
// so screen readers read the heading exactly as before.
function splitWords(el) {
  const inners = []
  Array.from(el.childNodes).forEach((node) => {
    if (node.nodeType !== Node.TEXT_NODE || !node.textContent.trim()) return
    const fragment = document.createDocumentFragment()
    node.textContent.split(/(\s+)/).forEach((token) => {
      if (!token) return
      if (/^\s+$/.test(token)) {
        fragment.appendChild(document.createTextNode(token))
        return
      }
      const mask = document.createElement('span')
      mask.className = 'reveal-word'
      const inner = document.createElement('span')
      inner.className = 'reveal-word__inner'
      inner.textContent = token
      mask.appendChild(inner)
      fragment.appendChild(mask)
      inners.push(inner)
    })
    node.replaceWith(fragment)
  })
  return inners
}

function play(targets, keyframes, { delay, duration, step }) {
  targets.forEach((target, index) => {
    target.animate(keyframes, {
      duration,
      delay: delay + Math.min(index, MAX_STAGGER_STEPS) * step,
      easing: EASE_OUT,
      // Hold the first frame during the delay; afterwards the element's own CSS (including hover
      // transforms) is fully back in control.
      fill: 'backwards',
    })
  })
}

function reveal(el, { animate = true } = {}) {
  const state = states.get(el)
  if (!state || state.revealed) return
  state.revealed = true
  unobserve(el)

  const { options } = state
  if (animate && canAnimate(el)) {
    if (options.variant === 'words') {
      const words = el.querySelectorAll('.reveal-word__inner')
      play(
        Array.from(words),
        [
          { translate: '0 105%', rotate: '4deg', opacity: 0 },
          { translate: '0 0', rotate: '0deg', opacity: 1 },
        ],
        { delay: options.delay, duration: options.duration, step: 70 },
      )
    } else if (options.stagger) {
      play(Array.from(el.children), keyframesFor(options.variant, options.distance), {
        delay: options.delay,
        duration: options.duration,
        step: options.staggerStep,
      })
    } else {
      play([el], keyframesFor(options.variant, options.distance), {
        delay: options.delay,
        duration: options.duration,
        step: 0,
      })
    }
  }
  // Removing the hidden state in the same frame as starting the animations: the animations hold
  // their first keyframe (fill: backwards), so nothing flashes.
  el.setAttribute('data-revealed', '')
}

function getObserver(rootMargin) {
  if (!observers.has(rootMargin)) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            reveal(entry.target)
          } else if (entry.boundingClientRect.bottom < 0) {
            // Already scrolled past (e.g. restored scroll position): show it without a show-off
            reveal(entry.target, { animate: false })
          }
        })
      },
      { rootMargin, threshold: 0 },
    )
    observers.set(rootMargin, observer)
  }
  return observers.get(rootMargin)
}

function unobserve(el) {
  const state = states.get(el)
  if (state?.observer) {
    state.observer.unobserve(el)
    state.observer = null
  }
}

export default {
  // SSR: render the content as-is (visible); the client takes over on mount
  getSSRProps() {
    return {}
  },

  beforeMount(el, binding) {
    const options = parseOptions(binding)
    states.set(el, { options, revealed: false, observer: null })
    el.setAttribute('data-reveal', options.variant)
    if (options.stagger) el.setAttribute('data-reveal-stagger', '')
  },

  mounted(el) {
    const state = states.get(el)
    if (!state) return
    if (state.options.variant === 'words' && !el.hasAttribute('data-reveal-split')) {
      splitWords(el)
      el.setAttribute('data-reveal-split', '')
    }
    if (!isBrowser || !('IntersectionObserver' in window) || prefersReducedMotion()) {
      reveal(el, { animate: false })
      return
    }
    state.observer = getObserver(state.options.rootMargin)
    state.observer.observe(el)
  },

  beforeUnmount(el) {
    unobserve(el)
    states.delete(el)
  },
}
