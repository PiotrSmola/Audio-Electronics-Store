<template>
  <div class="music-notes" :class="`music-notes--${tone}`" aria-hidden="true">
    <svg
      v-for="note in notes"
      :key="note.id"
      class="music-notes__note"
      :style="note.style"
      viewBox="0 0 24 32"
      focusable="false"
    >
      <path :d="glyphs[note.glyph]" />
    </svg>
  </div>
</template>

<script>
// Decorative music notes drifting slowly upwards behind a section.
// Place inside a positioned parent: <MusicNotesComponent :count="8" tone="brass" />
const GLYPHS = [
  // eighth note
  'M10 3v19.2A5 5 0 1 0 12 26V9.5c3.4.8 6 3 6.8 6.5.9-5.2-2.6-9.2-8.8-13z',
  // quarter note
  'M13 2v20.2A5 5 0 1 0 15 26V2z',
  // two beamed eighth notes
  'M7 6v15.2A4 4 0 1 0 9 24.5V11l11-3v10.2a4 4 0 1 0 2 3.3V2z',
  // half note
  'M15 2v20.2A5.2 5.2 0 1 0 17 26V2zm-5 26.2c-2 0-3.2-1-3-2.2.3-1.6 2.4-2.9 4.6-2.9 2 0 3.2 1 3 2.2-.3 1.6-2.4 2.9-4.6 2.9z',
]

// Small deterministic PRNG so the layout is stable between renders
function seeded(seed) {
  let s = seed
  return () => {
    s = (s * 9301 + 49297) % 233280
    return s / 233280
  }
}

export default {
  name: 'MusicNotesComponent',
  props: {
    count: { type: Number, default: 8 },
    // brass | light | dark — colour of the notes
    tone: { type: String, default: 'brass' },
    seed: { type: Number, default: 7 },
    // Size range in px
    minSize: { type: Number, default: 16 },
    maxSize: { type: Number, default: 34 },
  },
  data() {
    return { glyphs: GLYPHS }
  },
  computed: {
    notes() {
      const rand = seeded(this.seed)
      return Array.from({ length: this.count }, (_, id) => {
        const size = this.minSize + rand() * (this.maxSize - this.minSize)
        const duration = 14 + rand() * 12
        return {
          id,
          glyph: Math.floor(rand() * GLYPHS.length),
          style: {
            left: `${4 + rand() * 92}%`,
            width: `${size}px`,
            height: `${(size * 32) / 24}px`,
            '--drift': `${(rand() - 0.5) * 80}px`,
            '--tilt': `${(rand() - 0.5) * 40}deg`,
            '--peak': (0.25 + rand() * 0.35).toFixed(2),
            animationDuration: `${duration.toFixed(1)}s`,
            animationDelay: `${(-rand() * duration).toFixed(1)}s`,
          },
        }
      })
    },
  },
}
</script>

<style lang="scss" scoped>
.music-notes {
  position: absolute;
  inset: 0;
  overflow: hidden;
  pointer-events: none;
  z-index: 0;

  &--brass {
    color: #be9c79;
  }
  &--light {
    color: #efe7dc;
  }
  &--dark {
    color: #3a2e24;
  }
}

.music-notes__note {
  position: absolute;
  bottom: -40px;
  fill: currentColor;
  opacity: 0;
  animation: note-float linear infinite;
  will-change: transform, opacity;
}

@keyframes note-float {
  0% {
    transform: translate3d(0, 0, 0) rotate(0deg);
    opacity: 0;
  }
  15% {
    opacity: var(--peak);
  }
  50% {
    transform: translate3d(var(--drift), -55vh, 0) rotate(var(--tilt));
  }
  85% {
    opacity: var(--peak);
  }
  100% {
    transform: translate3d(calc(var(--drift) * -0.4), -110vh, 0) rotate(calc(var(--tilt) * -1));
    opacity: 0;
  }
}

@media (prefers-reduced-motion: reduce) {
  .music-notes__note {
    animation: none;
    opacity: calc(var(--peak) * 0.6);
    bottom: auto;
    top: calc(var(--peak) * 160%);
  }
}
</style>
