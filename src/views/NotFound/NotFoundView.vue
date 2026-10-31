<template>
  <main class="not-found ae-grain">
    <MusicNotesComponent :count="8" tone="brass" :seed="404" :min-size="14" :max-size="30" />

    <div class="not-found__body container">
      <p v-reveal:fade class="ae-eyebrow not-found__eyebrow">Error 404 — No signal</p>

      <!-- "404" with the zero pressed as a record; the tonearm is lifted off -->
      <div v-reveal:zoom="{ delay: 100 }" class="not-found__code" role="img" aria-label="404">
        <span class="not-found__digit" aria-hidden="true">4</span>
        <span class="record" aria-hidden="true">
          <svg class="record__disc" viewBox="0 0 200 200" focusable="false">
            <circle cx="100" cy="100" r="98" class="record__vinyl" />
            <circle
              v-for="ring in grooves"
              :key="ring"
              cx="100"
              cy="100"
              :r="ring"
              class="record__groove"
            />
            <circle cx="100" cy="100" r="30" class="record__label" />
            <text x="100" y="96" class="record__label-text">SIDE B</text>
            <text x="100" y="110" class="record__label-text">33⅓</text>
            <circle cx="100" cy="100" r="3" class="record__spindle" />
          </svg>
          <svg class="record__arm" viewBox="0 0 60 160" focusable="false">
            <circle cx="44" cy="14" r="11" class="record__arm-base" />
            <circle cx="44" cy="14" r="4" class="record__arm-pivot" />
            <path d="M44 14 L40 112 L26 138" class="record__arm-tube" />
            <rect x="16" y="134" width="16" height="10" rx="1.5" class="record__arm-head" />
          </svg>
        </span>
        <span class="not-found__digit" aria-hidden="true">4</span>
      </div>

      <!-- Flatline: the signal is gone, only a faint blip runs along the line -->
      <div v-reveal:fade="{ delay: 250 }" class="flatline" aria-hidden="true">
        <span class="flatline__label">Input</span>
        <svg class="flatline__trace" viewBox="0 0 600 40" preserveAspectRatio="none">
          <path d="M0 20 H600" class="flatline__base" />
          <path
            d="M0 20 H270 L278 12 L286 28 L294 16 L300 20 H600"
            class="flatline__blip"
            pathLength="100"
          />
        </svg>
        <span class="flatline__label flatline__label--unit">−∞ dB</span>
      </div>

      <div class="not-found__copy">
        <h1 v-reveal:words="{ delay: 300 }" class="ae-display not-found__heading">
          This track isn't on the <em>record.</em>
        </h1>
        <div v-reveal="{ delay: 450 }" class="not-found__aside">
          <p class="not-found__text">
            The page you were looking for doesn't exist or has been moved. Lift the needle and try
            another side.
          </p>
          <div class="not-found__links">
            <router-link to="/" class="not-found__link not-found__link--primary"
              >Back to home</router-link
            >
            <router-link to="/products" class="not-found__link">Browse products</router-link>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

<script>
import MusicNotesComponent from '@/components/decor/MusicNotesComponent.vue'

export default {
  name: 'NotFoundView',
  components: { MusicNotesComponent },
  data() {
    // Groove radii between the label and the outer lead-in
    return { grooves: [38, 44, 49, 55, 61, 66, 72, 78, 83, 89, 94] }
  },
}
</script>

<style lang="scss" src="./NotFound.scss"></style>
