<template>
  <div>
    <!-- Header -->
    <header class="header">
      <div class="header__bgc">
        <HeroSceneComponent class="header__scene" />
        <div class="header__body container">
          <p class="header__text">Exclusive Deals on Premium Audio Equipment</p>
          <h1 class="header__heading">Experience Superior Sound</h1>
          <router-link class="header__link" to="/products">Shop Now</router-link>
        </div>
      </div>
    </header>

    <main>
      <!-- About Section: asymmetric split, large toned photo, VU-meter detail -->
      <section class="home-about" id="about">
        <div class="container home-about__grid">
          <figure v-reveal:left class="home-about__figure">
            <div class="home-about__frame">
              <img
                src="@/assets/img/homeAbout.jpg"
                alt="Hands adjusting a mixing desk in a dim studio"
                class="home-about__img"
                width="1200"
                height="800"
                loading="lazy"
                decoding="async"
              />
            </div>
            <figcaption class="home-about__caption">
              <span>Fig. 01</span>
              <span>Listening room, London</span>
            </figcaption>
          </figure>

          <div class="home-about__content">
            <p v-reveal="{ delay: 100 }" class="ae-eyebrow home-about__eyebrow">01 — About us</p>
            <h2 v-reveal="{ delay: 180 }" class="ae-display home-about__heading">
              Passion for <em>quality</em> sound
            </h2>
            <p v-reveal="{ delay: 260 }" class="home-about__text">
              We bring you the best in audio electronics – from high‑fidelity amplifiers to
              cutting‑edge wireless speakers. Our carefully selected range combines innovative
              technology with superior craftsmanship to deliver an unparalleled listening
              experience.
            </p>

            <!-- Decorative VU meter: the needle swings up once the meter is revealed -->
            <div v-reveal:fade="{ delay: 320 }" class="home-about__meter">
              <svg
                class="home-about__vu"
                viewBox="22 10 196 136"
                aria-hidden="true"
                focusable="false"
              >
                <path class="home-about__vu-arc" :d="vuMeter.arc" />
                <path class="home-about__vu-arc home-about__vu-arc--peak" :d="vuMeter.peakArc" />
                <line
                  v-for="tick in vuMeter.ticks"
                  :key="tick.value"
                  class="home-about__vu-tick"
                  :class="{ 'home-about__vu-tick--peak': tick.value > 0 }"
                  v-bind="tick.line"
                />
                <text
                  v-for="tick in vuMeter.labels"
                  :key="`l${tick.value}`"
                  class="home-about__vu-label"
                  :class="{ 'home-about__vu-label--peak': tick.value > 0 }"
                  :x="tick.labelPos.x"
                  :y="tick.labelPos.y"
                >
                  {{ tick.value > 0 ? `+${tick.value}` : tick.value }}
                </text>
                <text class="home-about__vu-unit" x="196" y="136">VU</text>
                <line class="home-about__vu-needle" x1="120" y1="138" x2="120" y2="30" />
                <circle class="home-about__vu-pivot" cx="120" cy="138" r="5" />
              </svg>
              <p class="home-about__meter-note">
                <span>Ref. 0 VU</span>
                Every system is auditioned on our floor before it leaves the shop.
              </p>
            </div>

            <div v-reveal="{ delay: 380 }" class="home-about__actions">
              <router-link class="home-btn home-btn--primary" to="/about">Our story</router-link>
              <router-link class="home-btn home-btn--ghost" to="/products">
                Browse the range
              </router-link>
            </div>
          </div>
        </div>
      </section>

      <!-- Services Section: numbered editorial list with a cross-fading photo panel -->
      <section class="home-services ae-grain" id="services">
        <div class="container">
          <div class="home-services__head">
            <div>
              <p v-reveal class="ae-eyebrow">02 — Services</p>
              <h2 v-reveal="{ delay: 100 }" class="ae-display home-services__heading">
                More than a <em>shop</em> counter
              </h2>
            </div>
            <p v-reveal="{ delay: 200 }" class="home-services__intro">
              A good system is only half the story. We set it up, voice it to your room and keep it
              running for years.
            </p>
          </div>

          <div class="home-services__body">
            <div v-reveal:zoom class="home-services__visual" aria-hidden="true">
              <img
                v-for="(service, index) in services"
                :key="service.title"
                :src="service.img"
                alt=""
                class="home-services__visual-img"
                :class="{ 'home-services__visual-img--active': index === activeService }"
                loading="lazy"
                decoding="async"
              />
              <span class="home-services__visual-tag">
                {{ services[activeService].number }} /
                {{ services.length.toString().padStart(2, '0') }}
              </span>
            </div>

            <ol v-reveal.stagger="{ stagger: 140 }" class="home-services__list">
              <li
                v-for="(service, index) in services"
                :key="service.title"
                class="home-services__item"
                :class="{ 'home-services__item--active': index === activeService }"
                @mouseenter="activeService = index"
              >
                <img
                  :src="service.img"
                  :alt="service.alt"
                  class="home-services__img"
                  loading="lazy"
                  decoding="async"
                />
                <span class="home-services__number">{{ service.number }}</span>
                <div class="home-services__copy">
                  <h3 class="home-services__title">{{ service.title }}</h3>
                  <p class="home-services__text">{{ service.text }}</p>
                  <p class="home-services__tags">{{ service.tags }}</p>
                </div>
              </li>
            </ol>
          </div>

          <div v-reveal class="home-services__foot">
            <p>Not sure what you need? Tell us about your room.</p>
            <router-link class="home-btn home-btn--ghost home-btn--on-dark" to="/contact">
              Book a consultation
            </router-link>
          </div>
        </div>
      </section>

      <!-- Opening Hours Section: hi-fi front panel with 24h timeline per row -->
      <section class="home-open" id="open">
        <StaffDividerComponent tone="dark" class="home-open__staff" />
        <div class="container home-open__grid">
          <div class="home-open__intro">
            <p v-reveal class="ae-eyebrow home-open__eyebrow">03 — Visit</p>
            <h2 v-reveal="{ delay: 100 }" class="ae-display home-open__heading">
              Opening <em>hours</em>
            </h2>
            <p v-reveal="{ delay: 180 }" class="home-open__lead">
              Drop in for a listening session — bring your own records if you like.
            </p>
            <p
              v-reveal="{ delay: 240 }"
              class="home-open__status"
              :class="storeStatus.isOpen ? 'home-open__status--open' : 'home-open__status--closed'"
            >
              <span class="home-open__status-dot" aria-hidden="true"></span>
              <span>{{ storeStatus.text }}</span>
            </p>
          </div>

          <div v-reveal:right="{ delay: 150 }" class="home-open__panel">
            <span class="home-open__screw home-open__screw--tl" aria-hidden="true"></span>
            <span class="home-open__screw home-open__screw--tr" aria-hidden="true"></span>
            <span class="home-open__screw home-open__screw--bl" aria-hidden="true"></span>
            <span class="home-open__screw home-open__screw--br" aria-hidden="true"></span>

            <div class="home-open__panel-head">
              <span>Store hours</span>
              <span>London time</span>
            </div>

            <div class="home-open__scale" aria-hidden="true">
              <span
                v-for="hour in scaleHours"
                :key="hour"
                :style="{ left: `${(hour / 24) * 100}%` }"
              >
                {{ hour.toString().padStart(2, '0') }}
              </span>
            </div>

            <div v-reveal.stagger="{ delay: 300, stagger: 120 }" class="home-open__days">
              <div
                v-for="(row, index) in openingHours"
                :key="row.label"
                class="home-open__day"
                :class="{ 'home-open__day--today': index === storeStatus.todayIndex }"
              >
                <span class="home-open__day-label">
                  <span class="home-open__day-name">{{ row.label }}</span>
                  <span class="home-open__day-short">{{ row.short }}</span>
                  <span v-if="index === storeStatus.todayIndex" class="home-open__today-tag"
                    >Today</span
                  >
                </span>
                <span class="home-open__bar" aria-hidden="true">
                  <span class="home-open__bar-fill" :style="barStyle(row)"></span>
                  <span
                    v-if="index === storeStatus.todayIndex"
                    class="home-open__bar-now"
                    :style="{ left: `${nowPercent}%` }"
                  ></span>
                </span>
                <span class="home-open__day-time">{{ row.open }} – {{ row.close }}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Newsletter Section: dark ink, drifting notes, inline form -->
      <section class="home-newsletter ae-grain" id="newsletter">
        <MusicNotesComponent :count="9" tone="brass" :seed="11" :min-size="14" :max-size="30" />
        <div class="container home-newsletter__grid">
          <div class="home-newsletter__content">
            <p v-reveal class="ae-eyebrow">04 — Newsletter</p>
            <h2 v-reveal="{ delay: 100 }" class="ae-display home-newsletter__title">
              Liner notes, <em>monthly</em>
            </h2>
            <p v-reveal="{ delay: 180 }" class="home-newsletter__text">
              New arrivals, listening tips and the odd in-store session. Subscribe and get
              <strong>10% off</strong> your first purchase.
            </p>
          </div>

          <form
            v-reveal="{ delay: 250 }"
            class="home-newsletter__form"
            novalidate
            @submit.prevent="subscribe"
          >
            <label for="newsletter-email" class="home-newsletter__label">Email address</label>
            <div
              class="home-newsletter__field"
              :class="{ 'home-newsletter__field--error': newsletterError }"
            >
              <input
                id="newsletter-email"
                v-model.trim="newsletterEmail"
                type="email"
                placeholder="Your email"
                class="home-newsletter__input"
                autocomplete="email"
                :aria-invalid="newsletterError ? 'true' : 'false'"
                :aria-describedby="newsletterError ? 'newsletter-error' : 'newsletter-hint'"
                @input="newsletterError = ''"
              />
              <button type="submit" class="home-newsletter__btn">Subscribe</button>
            </div>
            <p
              v-if="newsletterError"
              id="newsletter-error"
              class="home-newsletter__error"
              role="alert"
            >
              {{ newsletterError }}
            </p>
            <p v-else id="newsletter-hint" class="home-newsletter__hint">
              One letter a month. Unsubscribe any time.
            </p>
          </form>
        </div>
      </section>
    </main>
  </div>
</template>

<script>
import { useToast } from '@/composables/useToast'
import { isValidEmail } from '@/utils/validation'
import { defineAsyncComponent } from 'vue'
import MusicNotesComponent from '@/components/decor/MusicNotesComponent.vue'
import StaffDividerComponent from '@/components/decor/StaffDividerComponent.vue'
import service1 from '@/assets/img/service1.jpg'
import service2 from '@/assets/img/service2.jpg'
import service3 from '@/assets/img/service3.jpg'

// Decorative 3D hero layer, loaded lazily so three.js never blocks first paint
const HeroSceneComponent = defineAsyncComponent(() => import('@/components/HeroSceneComponent.vue'))

const SERVICES = [
  {
    number: '01',
    title: 'Professional Setup',
    text: 'Expert installation and calibration of your audio system — placement, cabling and a final listen with you in the room.',
    tags: 'Installation · Calibration',
    img: service1,
    alt: 'Headphones resting on a desk in warm light',
  },
  {
    number: '02',
    title: 'Custom Tuning',
    text: 'Tailored sound tuning to match your environment and taste, from room correction to cartridge alignment.',
    tags: 'Room EQ · Voicing',
    img: service2,
    alt: 'Turntable and headphones set up by a shop window',
  },
  {
    number: '03',
    title: 'Repair & Support',
    text: 'Dedicated technical support and maintenance services, so the system you love keeps sounding like the day you bought it.',
    tags: 'Servicing · Aftercare',
    img: service3,
    alt: 'Wireless earbuds on a wooden table',
  },
]

// Store hours. Times are the store's local time (the shop is in London - see Contact page).
const OPENING_HOURS = [
  {
    label: 'Monday - Friday',
    short: 'Mon – Fri',
    days: [1, 2, 3, 4, 5],
    open: '09:00',
    close: '21:00',
  },
  { label: 'Saturday', short: 'Sat', days: [6], open: '10:00', close: '20:00' },
  { label: 'Sunday', short: 'Sun', days: [0], open: '11:00', close: '18:00' },
]
const STORE_TIME_ZONE = 'Europe/London'
const WEEKDAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
const MINUTES_PER_DAY = 24 * 60

function toMinutes(time) {
  const [hours, minutes] = time.split(':').map(Number)
  return hours * 60 + minutes
}

// Day of week (0 = Sunday) and minutes since midnight in the store's time zone
function storeClock(timestamp) {
  const date = new Date(timestamp)
  try {
    const parts = new Intl.DateTimeFormat('en-US', {
      timeZone: STORE_TIME_ZONE,
      weekday: 'long',
      hour: '2-digit',
      minute: '2-digit',
      hourCycle: 'h23',
    }).formatToParts(date)
    const part = (type) => parts.find((item) => item.type === type)?.value
    return {
      day: WEEKDAYS.indexOf(part('weekday')),
      minutes: Number(part('hour')) * 60 + Number(part('minute')),
    }
  } catch {
    return { day: date.getDay(), minutes: date.getHours() * 60 + date.getMinutes() }
  }
}

// Decorative VU meter: scale value -> needle angle in degrees (0 = straight up)
const VU_PIVOT = { x: 120, y: 138 }
const VU_SCALE = [
  { value: -20, angle: -48, label: true },
  { value: -10, angle: -32, label: true },
  { value: -7, angle: -22, label: true },
  { value: -5, angle: -13, label: true },
  { value: -3, angle: -3, label: true },
  { value: -2, angle: 4 },
  { value: -1, angle: 12 },
  { value: 0, angle: 21, label: true },
  { value: 1, angle: 30 },
  { value: 2, angle: 39 },
  { value: 3, angle: 48, label: true },
]

function vuPoint(angle, radius) {
  const rad = (angle * Math.PI) / 180
  return {
    x: +(VU_PIVOT.x + radius * Math.sin(rad)).toFixed(2),
    y: +(VU_PIVOT.y - radius * Math.cos(rad)).toFixed(2),
  }
}

function vuArc(from, to, radius) {
  const start = vuPoint(from, radius)
  const end = vuPoint(to, radius)
  return `M ${start.x} ${start.y} A ${radius} ${radius} 0 0 1 ${end.x} ${end.y}`
}

function buildVuMeter() {
  const ticks = VU_SCALE.map((step) => {
    const inner = vuPoint(step.angle, step.label ? 92 : 95)
    const outer = vuPoint(step.angle, 102)
    return {
      ...step,
      line: { x1: inner.x, y1: inner.y, x2: outer.x, y2: outer.y },
      labelPos: vuPoint(step.angle, 116),
    }
  })
  return {
    arc: vuArc(-48, 21, 102),
    peakArc: vuArc(21, 48, 102),
    ticks,
    labels: ticks.filter((tick) => tick.label),
  }
}

function rowForDay(day) {
  return OPENING_HOURS.findIndex((row) => row.days.includes(day))
}

export default {
  name: 'HomeView',
  components: { HeroSceneComponent, MusicNotesComponent, StaffDividerComponent },
  data() {
    return {
      newsletterEmail: '',
      newsletterError: '',
      openingHours: OPENING_HOURS,
      services: SERVICES,
      activeService: 0,
      scaleHours: [0, 6, 12, 18, 24],
      now: Date.now(),
    }
  },
  computed: {
    // Geometry of the decorative VU meter (static, built once)
    vuMeter() {
      return buildVuMeter()
    },
    // Today's row and an "Open now" / "Closed" label, refreshed every 30 seconds
    storeStatus() {
      const { day, minutes } = storeClock(this.now)
      const todayIndex = rowForDay(day)
      const today = OPENING_HOURS[todayIndex]
      if (today && minutes >= toMinutes(today.open) && minutes < toMinutes(today.close)) {
        return { todayIndex, isOpen: true, text: `Open now · until ${today.close}` }
      }
      for (let offset = 0; offset < 7; offset += 1) {
        const row = OPENING_HOURS[rowForDay((day + offset) % 7)]
        if (!row || (offset === 0 && minutes >= toMinutes(row.open))) continue
        const when =
          offset === 0 ? 'today' : offset === 1 ? 'tomorrow' : `on ${WEEKDAYS[(day + offset) % 7]}`
        return { todayIndex, isOpen: false, text: `Closed · opens ${when} at ${row.open}` }
      }
      return { todayIndex, isOpen: false, text: 'Closed' }
    },
    // Current store time as a position on the 24h timeline (0-100)
    nowPercent() {
      return ((storeClock(this.now).minutes / MINUTES_PER_DAY) * 100).toFixed(2)
    },
  },
  mounted() {
    this.clockTimer = setInterval(() => {
      this.now = Date.now()
    }, 30000)
  },
  beforeUnmount() {
    clearInterval(this.clockTimer)
  },
  methods: {
    // Position of a day's opening window on the 24h timeline
    barStyle(row) {
      const start = toMinutes(row.open)
      const end = toMinutes(row.close)
      return {
        left: `${(start / MINUTES_PER_DAY) * 100}%`,
        width: `${((end - start) / MINUTES_PER_DAY) * 100}%`,
      }
    },
    subscribe() {
      if (!this.newsletterEmail) {
        this.newsletterError = 'Please enter your email address.'
        return
      }
      if (!isValidEmail(this.newsletterEmail)) {
        this.newsletterError = 'Please enter a valid email address.'
        return
      }
      // No backend yet - simulate a successful subscription
      useToast().showToast('Thanks for subscribing! Check your inbox for your 10% discount.')
      this.newsletterEmail = ''
      this.newsletterError = ''
    },
  },
}
</script>

<style lang="scss" src="./Home.scss"></style>
