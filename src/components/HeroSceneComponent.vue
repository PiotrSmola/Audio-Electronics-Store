<template>
  <div
    ref="stage"
    class="hero-scene"
    :class="{ 'hero-scene--ready': ready }"
    aria-hidden="true"
  ></div>
</template>

<script>
// Decorative WebGL layer for the Home hero. This component itself is tiny: three.js and the
// scene code are fetched with a dynamic import (separate chunk) after first paint, and never
// fetched at all when WebGL is unavailable.

function isWebGLAvailable() {
  try {
    const canvas = document.createElement('canvas')
    return !!(
      window.WebGLRenderingContext &&
      (canvas.getContext('webgl2') || canvas.getContext('webgl'))
    )
  } catch {
    return false
  }
}

function whenIdle(callback) {
  if ('requestIdleCallback' in window) {
    return window.requestIdleCallback(callback, { timeout: 1200 })
  }
  return window.setTimeout(callback, 200)
}

function cancelIdle(id) {
  if ('cancelIdleCallback' in window) window.cancelIdleCallback(id)
  else window.clearTimeout(id)
}

export default {
  name: 'HeroSceneComponent',
  data() {
    return {
      ready: false,
    }
  },
  mounted() {
    // Plain instance properties (not reactive): three.js objects must stay out of Vue's proxies
    this.scene = null
    this.destroyed = false
    this.onScreen = true

    if (!isWebGLAvailable()) return
    this.idleId = whenIdle(() => this.init())
  },
  beforeUnmount() {
    this.destroyed = true
    if (this.idleId) cancelIdle(this.idleId)
    if (this.observer) this.observer.disconnect()
    document.removeEventListener('visibilitychange', this.onVisibilityChange)
    if (this.scene) {
      this.scene.dispose()
      this.scene = null
    }
  },
  methods: {
    async init() {
      this.idleId = null
      let createHeroScene
      try {
        ;({ createHeroScene } = await import('./hero/createHeroScene'))
      } catch {
        return // chunk failed to load: the static hero stays as it is
      }
      if (this.destroyed || !this.$refs.stage) return

      const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      try {
        this.scene = createHeroScene(this.$refs.stage, {
          lite: window.innerWidth < 768,
          reducedMotion,
          onFirstFrame: () => {
            this.ready = true
          },
        })
      } catch {
        this.scene = null // WebGL context creation failed: keep the plain hero
        return
      }
      if (reducedMotion) {
        this.ready = true
        return
      }

      this.scene.canvas.addEventListener('webglcontextlost', () => this.scene && this.scene.stop())

      // Only animate while the hero is on screen and the tab is visible
      this.observer = new IntersectionObserver(
        ([entry]) => {
          this.onScreen = entry.isIntersecting
          this.updateRunning()
        },
        { threshold: 0 },
      )
      this.observer.observe(this.$refs.stage)
      this.onVisibilityChange = () => this.updateRunning()
      document.addEventListener('visibilitychange', this.onVisibilityChange)
      this.updateRunning()
    },
    updateRunning() {
      if (!this.scene) return
      if (this.onScreen && !document.hidden) this.scene.start()
      else this.scene.stop()
    },
  },
}
</script>

<style lang="scss">
.hero-scene {
  position: absolute;
  inset: 0;
  overflow: hidden;
  pointer-events: none;
  opacity: 0;
  transition: opacity 1.6s ease;

  &--ready {
    opacity: 1;
  }

  canvas {
    display: block;
    width: 100%;
    height: 100%;
  }
}
</style>
