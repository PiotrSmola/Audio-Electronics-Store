import { hasFinePointer, prefersReducedMotion } from './useMotionPreferences'

// Cursor-following 3D tilt with parallax layers and a moving light glare.
// - Only for mouse/pen on devices that can hover, never with prefers-reduced-motion.
// - One requestAnimationFrame loop eases the current values towards the pointer target,
//   so movement stays smooth at 60fps and the card glides back when the pointer leaves.
// - Writes `transform` (and the glare's opacity) only: composited, no layout work.

const SETTLE_EPSILON = 0.002

/**
 * @param {HTMLElement} el - element to tilt
 * @param {object} [options]
 * @param {number} [options.max=9] - max rotation in degrees
 * @param {number} [options.perspective=900] - perspective distance in px
 * @param {number} [options.hoverScale=1.02] - scale of the element while hovered
 * @param {number} [options.smoothing=0.14] - 0..1, share of the distance covered per 60fps frame
 * @param {Array<{el: HTMLElement, depth: number, scale?: number}>} [options.layers] - parallax
 *   layers; positive depth moves with the pointer (floats above), negative moves against it
 * @param {HTMLElement} [options.glare] - element translated with the pointer (light reflection)
 * @param {number} [options.glareTravel=25] - glare travel in % of its own size
 * @param {string} [options.activeClass='is-tilting'] - class set on `el` while animating
 * @returns {{ destroy: () => void }}
 */
export function useTilt(el, options = {}) {
  const {
    max = 9,
    perspective = 900,
    hoverScale = 1.02,
    smoothing = 0.14,
    layers = [],
    glare = null,
    glareTravel = 25,
    activeClass = 'is-tilting',
  } = options

  if (!el) return { destroy() {} }

  // x/y: pointer position in -1..1, lift: 0 (rest) .. 1 (hovered)
  const target = { x: 0, y: 0, lift: 0 }
  const current = { x: 0, y: 0, lift: 0 }
  let rect = null
  let rectScroll = { x: 0, y: 0 }
  let frame = 0
  let lastTime = 0
  let hovering = false

  const activeLayers = () => layers.filter((layer) => layer && layer.el)

  function measure() {
    // Measured once per hover (before the element is tilted) to avoid feedback from
    // the transformed bounding box; scrolling while hovering is compensated below.
    rect = el.getBoundingClientRect()
    rectScroll = { x: window.scrollX, y: window.scrollY }
  }

  function render() {
    const { x, y, lift } = current
    const rotateX = (-y * max).toFixed(3)
    const rotateY = (x * max).toFixed(3)
    const scale = (1 + (hoverScale - 1) * lift).toFixed(4)
    el.style.transform = `perspective(${perspective}px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(${scale})`

    for (const layer of activeLayers()) {
      const layerScale = 1 + ((layer.scale ?? 1) - 1) * lift
      layer.el.style.transform = `translate3d(${(x * layer.depth).toFixed(2)}px, ${(y * layer.depth).toFixed(2)}px, 0) scale(${layerScale.toFixed(4)})`
    }

    if (glare) {
      glare.style.transform = `translate3d(${(x * glareTravel).toFixed(2)}%, ${(y * glareTravel).toFixed(2)}%, 0)`
      glare.style.opacity = lift.toFixed(3)
    }
  }

  function reset() {
    el.classList.remove(activeClass)
    el.style.transform = ''
    for (const layer of activeLayers()) layer.el.style.transform = ''
    if (glare) {
      glare.style.transform = ''
      glare.style.opacity = ''
    }
  }

  function tick(time) {
    const dt = lastTime ? Math.min(time - lastTime, 64) : 16.7
    lastTime = time
    // Frame-rate independent easing (same feel at 60Hz and 120Hz)
    const factor = 1 - Math.pow(1 - smoothing, dt / 16.7)
    let settled = true
    for (const key of ['x', 'y', 'lift']) {
      const delta = target[key] - current[key]
      if (Math.abs(delta) > SETTLE_EPSILON) settled = false
      current[key] += delta * factor
    }

    if (settled && !hovering) {
      current.x = current.y = current.lift = 0
      frame = 0
      lastTime = 0
      reset()
      return
    }
    render()
    frame = requestAnimationFrame(tick)
  }

  function start() {
    if (!frame) frame = requestAnimationFrame(tick)
  }

  function enabledFor(event) {
    return event.pointerType !== 'touch' && hasFinePointer() && !prefersReducedMotion()
  }

  function onPointerEnter(event) {
    if (!enabledFor(event)) return
    hovering = true
    if (!frame) measure() // only when at rest - otherwise the box is already tilted
    el.classList.add(activeClass)
    target.lift = 1
    onPointerMove(event)
    start()
  }

  function onPointerMove(event) {
    if (!hovering || !rect) return
    const left = rect.left - (window.scrollX - rectScroll.x)
    const top = rect.top - (window.scrollY - rectScroll.y)
    const px = Math.min(Math.max((event.clientX - left) / rect.width, 0), 1)
    const py = Math.min(Math.max((event.clientY - top) / rect.height, 0), 1)
    target.x = px * 2 - 1
    target.y = py * 2 - 1
    start()
  }

  function onPointerLeave() {
    if (!hovering) return
    hovering = false
    target.x = target.y = target.lift = 0
    start()
  }

  el.addEventListener('pointerenter', onPointerEnter)
  el.addEventListener('pointermove', onPointerMove, { passive: true })
  el.addEventListener('pointerleave', onPointerLeave)
  el.addEventListener('pointercancel', onPointerLeave)

  return {
    destroy() {
      el.removeEventListener('pointerenter', onPointerEnter)
      el.removeEventListener('pointermove', onPointerMove)
      el.removeEventListener('pointerleave', onPointerLeave)
      el.removeEventListener('pointercancel', onPointerLeave)
      if (frame) cancelAnimationFrame(frame)
      frame = 0
      reset()
    },
  }
}
