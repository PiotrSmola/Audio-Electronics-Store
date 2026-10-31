<template>
  <div
    ref="root"
    class="staff-divider"
    :class="[`staff-divider--${tone}`, { 'is-visible': visible }]"
    aria-hidden="true"
  >
    <svg
      class="staff-divider__svg"
      viewBox="0 0 600 40"
      preserveAspectRatio="none"
      focusable="false"
    >
      <line v-for="i in 5" :key="i" x1="0" x2="600" :y1="4 + (i - 1) * 8" :y2="4 + (i - 1) * 8" />
    </svg>
    <span
      v-for="(note, index) in notes"
      :key="index"
      class="staff-divider__note"
      :style="{ left: `${note.x}%`, top: `${note.y}px`, transitionDelay: `${index * 90}ms` }"
    ></span>
  </div>
</template>

<script>
// A five-line music staff used as a section divider. The note heads drop onto the staff
// one after another when the divider scrolls into view.
const NOTES = [
  { x: 12, y: 24 },
  { x: 24, y: 16 },
  { x: 36, y: 20 },
  { x: 48, y: 8 },
  { x: 60, y: 12 },
  { x: 72, y: 28 },
  { x: 84, y: 16 },
]

export default {
  name: 'StaffDividerComponent',
  props: {
    // brass | dark
    tone: { type: String, default: 'brass' },
  },
  data() {
    return { notes: NOTES, visible: false }
  },
  mounted() {
    if (typeof IntersectionObserver === 'undefined') {
      this.visible = true
      return
    }
    this.observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          this.visible = true
          this.observer.disconnect()
        }
      },
      { threshold: 0.6 },
    )
    this.observer.observe(this.$refs.root)
  },
  beforeUnmount() {
    if (this.observer) this.observer.disconnect()
  },
}
</script>

<style lang="scss" scoped>
.staff-divider {
  position: relative;
  width: min(100%, 420px);
  height: 40px;
  margin: 0 auto;

  &--brass {
    color: #be9c79;
  }
  &--dark {
    color: #3a2e24;
  }
}

.staff-divider__svg {
  width: 100%;
  height: 100%;
  stroke: currentColor;
  stroke-width: 1;
  opacity: 0.35;
  vector-effect: non-scaling-stroke;
}

.staff-divider__note {
  position: absolute;
  width: 10px;
  height: 7px;
  margin: -3.5px 0 0 -5px;
  border-radius: 50%;
  background: currentColor;
  transform: translateY(-14px) rotate(-20deg);
  opacity: 0;
  transition:
    transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1),
    opacity 0.4s ease;

  .is-visible & {
    transform: translateY(0) rotate(-20deg);
    opacity: 0.9;
  }
}

@media (prefers-reduced-motion: reduce) {
  .staff-divider__note {
    transition: none;
    transform: rotate(-20deg);
    opacity: 0.9;
  }
}
</style>
