<template>
  <footer class="footer ae-grain">
    <MusicNotesComponent :count="7" tone="brass" :seed="23" :min-size="12" :max-size="22" />

    <div class="footer__inner container">
      <!-- invitation -->
      <div class="footer__lead">
        <p class="ae-eyebrow">Visit the listening room</p>
        <h2 class="footer__headline ae-display">Come in and <em>listen</em> before you buy.</h2>
        <router-link to="/contact" class="footer__cta">
          Plan a visit
          <v-icon size="18" aria-hidden="true">mdi-arrow-right</v-icon>
        </router-link>
      </div>

      <!-- frequency dial: ticks, numbers and a slowly drifting needle -->
      <div class="footer__dial" aria-hidden="true">
        <span class="footer__dial-ticks"></span>
        <span class="footer__dial-needle"></span>
        <span class="footer__dial-labels">
          <span v-for="label in dialLabels" :key="label">{{ label }}</span>
        </span>
      </div>

      <div class="footer__grid">
        <div class="footer__brand">
          <router-link to="/" class="footer__wordmark">Audio Electronics</router-link>
          <p class="footer__about">
            Amplifiers, turntables and speakers, chosen by ear and set up properly. Independent
            since the first pressing.
          </p>
          <div class="footer__icons">
            <a
              v-for="social in socials"
              :key="social.label"
              :href="social.href"
              class="footer__icon"
              target="_blank"
              rel="noopener"
              :aria-label="social.label"
              ><v-icon size="18">{{ social.icon }}</v-icon></a
            >
          </div>
        </div>

        <nav
          v-for="column in columns"
          :key="column.title"
          class="footer__column"
          :aria-label="column.title"
        >
          <h3 class="footer__column-title">{{ column.title }}</h3>
          <ul class="footer__list">
            <li v-for="link in column.links" :key="link.label">
              <router-link :to="link.to" class="footer__link">{{ link.label }}</router-link>
            </li>
          </ul>
        </nav>

        <div class="footer__column footer__visit">
          <h3 class="footer__column-title">Visit</h3>
          <address class="footer__address">
            123 Oxford Street<br />
            London, W1D 2HG<br />
            United Kingdom
          </address>
          <dl class="footer__hours">
            <div v-for="row in hours" :key="row.day">
              <dt>{{ row.day }}</dt>
              <dd>{{ row.time }}</dd>
            </div>
          </dl>
          <p class="footer__contact">
            <a href="tel:+442012345678" class="footer__link">+44 20 1234 5678</a><br />
            <a href="mailto:contact@audioelectronics.com" class="footer__link"
              >contact@audioelectronics.com</a
            >
          </p>
        </div>
      </div>

      <div class="footer__bottom">
        <p class="footer__copy">
          © <span class="footer__date">{{ currentYear }}</span> Audio Electronics Store. All rights
          reserved.
        </p>
        <button type="button" class="footer__top" @click="scrollToTop">
          Back to top <v-icon size="16" aria-hidden="true">mdi-arrow-up</v-icon>
        </button>
      </div>
    </div>
  </footer>
</template>

<script>
import MusicNotesComponent from '@/components/decor/MusicNotesComponent.vue'

export default {
  name: 'FooterComponent',
  components: { MusicNotesComponent },
  data() {
    return {
      dialLabels: ['20', '50', '100', '200', '500', '1k', '2k', '5k', '10k', '20k'],
      socials: [
        { label: 'Facebook', href: 'https://facebook.com', icon: 'mdi-facebook' },
        { label: 'Instagram', href: 'https://instagram.com', icon: 'mdi-instagram' },
        { label: 'X (Twitter)', href: 'https://x.com', icon: 'mdi-twitter' },
      ],
      columns: [
        {
          title: 'Shop',
          links: [
            { label: 'All products', to: '/products' },
            { label: 'Amplifier X100', to: '/products/1' },
            { label: 'Turntable Classic', to: '/products/6' },
            { label: 'Studio Headphones', to: '/products/5' },
          ],
        },
        {
          title: 'Company',
          links: [
            { label: 'Home', to: '/' },
            { label: 'About us', to: '/about' },
            { label: 'Contact', to: '/contact' },
          ],
        },
      ],
      hours: [
        { day: 'Mon–Fri', time: '9:00–21:00' },
        { day: 'Sat', time: '10:00–20:00' },
        { day: 'Sun', time: '11:00–18:00' },
      ],
    }
  },
  computed: {
    currentYear() {
      return new Date().getFullYear()
    },
  },
  methods: {
    scrollToTop() {
      window.scrollTo({ top: 0 })
    },
  },
}
</script>

<style lang="scss">
@use '@/assets/scss/tokens' as t;

.footer {
  position: relative;
  overflow: hidden;
  background-color: t.$ink;
  color: t.$text-on-dark;
  border-top: 1px solid t.$line-on-dark;

  // the drifting notes stay a background whisper
  .music-notes {
    opacity: 0.45;
  }

  .footer__inner {
    position: relative;
    z-index: 1;
    padding: clamp(5rem, 8vw, 8rem) 2rem 2.4rem;

    @media (max-width: 576px) {
      padding: 5rem 1.6rem 2rem;
    }
  }

  // --- lead -------------------------------------------------------------------------------
  .footer__lead {
    display: grid;
    grid-template-columns: 1fr auto;
    grid-template-areas:
      'eyebrow eyebrow'
      'headline cta';
    align-items: end;
    gap: 1.6rem 4rem;

    .ae-eyebrow {
      grid-area: eyebrow;
    }

    @media (max-width: 768px) {
      grid-template-columns: 1fr;
      grid-template-areas:
        'eyebrow'
        'headline'
        'cta';
      align-items: start;
    }
  }

  .footer__headline {
    grid-area: headline;
    max-width: 16ch;
    font-size: clamp(3.4rem, 5.6vw, 6.4rem);
    color: t.$text-on-dark;

    em {
      font-family: inherit;
      font-style: italic;
      color: t.$brass;
    }
  }

  .footer__cta {
    grid-area: cta;
    justify-self: start;
    display: inline-flex;
    align-items: center;
    gap: 1rem;
    padding: 1.3rem 2.2rem;
    border-radius: t.$radius-sm;
    background-color: t.$brass;
    color: t.$ink;
    font-family: t.$font-mono;
    font-size: 1.25rem;
    font-weight: 500;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    white-space: nowrap;
    transition: background-color 0.3s ease;

    .v-icon {
      transition: transform 0.4s t.$ease-out;
    }

    &:hover,
    &:focus-visible {
      background-color: t.$brass-light;
      .v-icon {
        transform: translateX(4px);
      }
    }

    &:focus-visible {
      outline: 1px solid t.$brass;
      outline-offset: 3px;
    }

    @media (max-width: 576px) {
      padding: 1.2rem 1.8rem;
      font-size: 1.15rem;
      letter-spacing: 0.12em;
    }
  }

  // --- dial -------------------------------------------------------------------------------
  .footer__dial {
    position: relative;
    margin: clamp(4rem, 6vw, 6.4rem) 0 clamp(4rem, 5vw, 5.6rem);
    padding-top: 1.4rem;
  }

  .footer__dial-ticks {
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    height: 14px;
    border-bottom: 1px solid t.$line-on-dark;
    background-image:
      repeating-linear-gradient(90deg, rgba(190, 156, 121, 0.5) 0 1px, transparent 1px 10%),
      repeating-linear-gradient(90deg, rgba(190, 156, 121, 0.22) 0 1px, transparent 1px 2%);
    background-size:
      100% 14px,
      100% 6px;
    background-position:
      0 100%,
      0 100%;
    background-repeat: no-repeat;
  }

  .footer__dial-needle {
    position: absolute;
    top: -8px;
    left: 0;
    width: 1px;
    height: 24px;
    background-color: t.$brass;
    box-shadow: 0 0 0 0.5px rgba(190, 156, 121, 0.4);
    animation: footer-needle 26s ease-in-out infinite alternate;

    &::after {
      content: '';
      position: absolute;
      left: -3px;
      top: -6px;
      width: 7px;
      height: 7px;
      border-radius: 50%;
      background-color: t.$brass;
    }
  }

  .footer__dial-labels {
    display: flex;
    justify-content: space-between;
    margin-top: 0.8rem;

    span {
      font-family: t.$font-mono;
      font-size: 1rem;
      letter-spacing: 0.08em;
      color: t.$muted-on-dark;
    }

    // keep every other number on small screens
    @media (max-width: 576px) {
      span:nth-child(even) {
        display: none;
      }
    }
  }

  // --- columns ----------------------------------------------------------------------------
  .footer__grid {
    display: grid;
    grid-template-columns: minmax(0, 1.5fr) repeat(2, minmax(0, 0.75fr)) minmax(0, 1.35fr);
    gap: 4rem;

    @media (max-width: 1024px) {
      grid-template-columns: repeat(3, minmax(0, 1fr));
      .footer__brand {
        grid-column: 1 / -1;
      }
    }

    @media (max-width: 576px) {
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 3.6rem 2.4rem;
      .footer__visit {
        grid-column: 1 / -1;
      }
    }
  }

  .footer__wordmark {
    display: inline-block;
    font-family: t.$font-display;
    font-size: 2.6rem;
    line-height: 1;
    color: t.$text-on-dark;
  }

  .footer__about {
    max-width: 34ch;
    margin-top: 1.4rem;
    font-size: 1.45rem;
    line-height: 1.65;
    color: t.$muted-on-dark;
  }

  .footer__icons {
    display: flex;
    gap: 0.8rem;
    margin-top: 2.2rem;
  }

  .footer__icon {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 38px;
    height: 38px;
    border-radius: 50%;
    border: 1px solid t.$line-on-dark;
    color: t.$text-on-dark;
    transition:
      color 0.3s,
      border-color 0.3s,
      background-color 0.3s;

    &:hover,
    &:focus-visible {
      color: t.$brass;
      border-color: t.$brass;
      background-color: rgba(190, 156, 121, 0.08);
    }
  }

  .footer__column-title {
    margin-bottom: 1.6rem;
    padding-bottom: 1rem;
    border-bottom: 1px solid t.$line-on-dark;
    font-family: t.$font-mono;
    font-size: 1.1rem;
    font-weight: 500;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    color: t.$brass;
  }

  .footer__list {
    list-style: none;
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .footer__link {
    position: relative;
    color: t.$text-on-dark;
    font-size: 1.4rem;
    background-image: linear-gradient(t.$brass, t.$brass);
    background-size: 0 1px;
    background-position: 0 100%;
    background-repeat: no-repeat;
    padding-bottom: 2px;
    transition:
      color 0.3s,
      background-size 0.45s t.$ease-out;

    &:hover,
    &:focus-visible {
      color: t.$brass-light;
      background-size: 100% 1px;
    }
  }

  .footer__address {
    font-style: normal;
    font-size: 1.45rem;
    line-height: 1.6;
    color: t.$text-on-dark;
  }

  .footer__hours {
    margin: 1.4rem 0;

    div {
      display: flex;
      justify-content: space-between;
      gap: 1.6rem;
      max-width: 24rem;
      padding: 0.4rem 0;
      border-bottom: 1px dashed rgba(190, 156, 121, 0.16);
    }

    dt,
    dd {
      font-family: t.$font-mono;
      font-size: 1.15rem;
      letter-spacing: 0.04em;
    }
    dt {
      color: t.$muted-on-dark;
    }
    dd {
      color: t.$text-on-dark;
    }
  }

  .footer__contact {
    line-height: 2;
    overflow-wrap: anywhere;
    .footer__link {
      font-size: 1.35rem;
    }
  }

  // --- bottom line ------------------------------------------------------------------------
  .footer__bottom {
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: 1.2rem 2.4rem;
    margin-top: clamp(4.8rem, 7vw, 7.2rem);
    padding-top: 2rem;
    border-top: 1px solid t.$line-on-dark;
  }

  .footer__copy,
  .footer__copy span,
  .footer__top {
    font-family: t.$font-mono;
    font-size: 1.1rem;
    letter-spacing: 0.08em;
    color: t.$muted-on-dark;
  }

  .footer__top {
    display: inline-flex;
    align-items: center;
    gap: 0.6rem;
    background: none;
    border: none;
    cursor: pointer;
    text-transform: uppercase;
    letter-spacing: 0.16em;
    transition: color 0.3s;

    .v-icon {
      transition: transform 0.4s t.$ease-out;
    }

    &:hover,
    &:focus-visible {
      color: t.$brass;
      .v-icon {
        transform: translateY(-3px);
      }
    }
  }
}

@keyframes footer-needle {
  0% {
    left: 18%;
  }
  35% {
    left: 46%;
  }
  60% {
    left: 41%;
  }
  100% {
    left: 72%;
  }
}

@media (prefers-reduced-motion: reduce) {
  .footer .footer__dial-needle {
    animation: none;
    left: 46%;
  }
  .footer .footer__cta .v-icon,
  .footer .footer__top .v-icon,
  .footer .footer__link {
    transition: none;
  }
}
</style>
