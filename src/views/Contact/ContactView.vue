<template>
  <div class="contact-body">
    <!-- Hero: dark, editorial, with an FM tuning dial along the bottom -->
    <header class="header-contact ae-grain">
      <MusicNotesComponent :count="7" tone="brass" :seed="23" :min-size="14" :max-size="28" />
      <div class="header-contact__body container">
        <p v-reveal="{ delay: 100 }" class="ae-eyebrow header-contact__eyebrow">
          Contact — London W1
        </p>
        <h1 v-reveal:words="{ delay: 200 }" class="ae-display header-contact__heading">
          Let's talk <em>sound.</em>
        </h1>
        <div v-reveal="{ delay: 500 }" class="header-contact__lede">
          <p class="header-contact__text">
            A question about a turntable, a pair of monitors or a whole listening room — our
            specialists answer every message personally.
          </p>
          <router-link class="header-contact__link" :to="{ hash: '#contact' }">
            Write to us
            <span class="header-contact__link-arrow" aria-hidden="true">↓</span>
          </router-link>
        </div>
      </div>

      <div class="dial container" aria-hidden="true">
        <div class="dial__scale">
          <span v-for="mark in dialMarks" :key="mark" class="dial__mark">{{ mark }}</span>
        </div>
        <span class="dial__needle"></span>
        <span class="dial__readout">FM 101.3 · tuned in</span>
      </div>
    </header>

    <main class="contact" id="contact">
      <!-- 01: the form -->
      <section class="contact-write">
        <div class="contact-write__grid container">
          <div class="contact-write__intro">
            <p v-reveal class="ae-eyebrow">01 — Write to us</p>
            <h2 v-reveal:words="{ delay: 100 }" class="ae-display contact-write__title">
              Tell us what you're <em>listening</em> to.
            </h2>
            <p v-reveal="{ delay: 250 }" class="contact-write__description">
              Fill out the form and our team will get back to you within 24 hours. Prefer a voice?
              Call the shop floor directly.
            </p>
            <dl v-reveal="{ delay: 350 }" class="contact-write__quick">
              <div class="contact-write__quick-row">
                <dt>Phone</dt>
                <dd><a href="tel:+48123456789">+48 123 456 789</a></dd>
              </div>
              <div class="contact-write__quick-row">
                <dt>Email</dt>
                <dd>
                  <a href="mailto:contact@audioelectronics.com">contact@audioelectronics.com</a>
                </dd>
              </div>
              <div class="contact-write__quick-row">
                <dt>Reply</dt>
                <dd>Usually within a working day</dd>
              </div>
            </dl>
          </div>

          <form
            v-reveal="{ delay: 150 }"
            class="contact__form"
            novalidate
            @submit.prevent="submitForm"
            @reset.prevent="resetForm"
          >
            <div
              v-for="(field, index) in fields"
              :key="field.id"
              class="contact__form-group"
              :class="{
                'contact__form-group--wide': field.wide,
                'contact__form-group--invalid': errors[field.id],
              }"
            >
              <span class="contact__form-index" aria-hidden="true">{{
                String(index + 1).padStart(2, '0')
              }}</span>
              <textarea
                v-if="field.multiline"
                v-model.trim="form[field.id]"
                :id="field.id"
                :name="field.id"
                class="contact__form-control contact__form-textarea"
                :class="{ 'contact__form-control--invalid': errors[field.id] }"
                placeholder=" "
                rows="5"
                :aria-invalid="errors[field.id] ? 'true' : 'false'"
                :aria-describedby="errors[field.id] ? `${field.id}-error` : null"
                @input="errors[field.id] = ''"
              ></textarea>
              <input
                v-else
                v-model.trim="form[field.id]"
                :type="field.type"
                :id="field.id"
                :name="field.id"
                class="contact__form-control"
                :class="{ 'contact__form-control--invalid': errors[field.id] }"
                placeholder=" "
                :autocomplete="field.autocomplete"
                :aria-invalid="errors[field.id] ? 'true' : 'false'"
                :aria-describedby="errors[field.id] ? `${field.id}-error` : null"
                @input="errors[field.id] = ''"
              />
              <label :for="field.id" class="contact__form-label">
                {{ field.label }}
                <span v-if="field.optional" class="contact__form-optional">optional</span>
              </label>
              <span class="contact__form-line" aria-hidden="true"></span>
              <p v-if="errors[field.id]" :id="`${field.id}-error`" class="contact__form-error">
                {{ errors[field.id] }}
              </p>
            </div>

            <div class="contact__form-buttons">
              <p class="contact__form-note">
                Your details stay with us. No mailing lists unless you ask.
              </p>
              <button type="reset" class="contact__form-button contact__form-button--secondary">
                Clear
              </button>
              <button
                type="submit"
                class="contact__form-button contact__form-button--primary"
                :disabled="isSubmitting"
              >
                {{ isSubmitting ? 'Sending...' : 'Send message' }}
                <svg
                  class="contact__form-button-note"
                  viewBox="0 0 24 32"
                  aria-hidden="true"
                  focusable="false"
                >
                  <path :d="noteGlyph" />
                </svg>
                <svg
                  v-if="flightKey"
                  :key="flightKey"
                  class="contact__form-flight"
                  viewBox="0 0 24 32"
                  aria-hidden="true"
                  focusable="false"
                >
                  <path :d="noteGlyph" />
                </svg>
              </button>
            </div>
          </form>
        </div>
        <StaffDividerComponent class="contact-write__staff" tone="brass" />
      </section>

      <!-- 02: visit — map and a typographic directory on a dark band -->
      <section class="contact-visit ae-grain">
        <MusicNotesComponent :count="6" tone="brass" :seed="41" :min-size="14" :max-size="26" />
        <div class="contact-visit__inner container">
          <div class="contact-visit__head">
            <div class="contact-visit__head-main">
              <p v-reveal class="ae-eyebrow">02 — Visit us</p>
              <h2 v-reveal:words="{ delay: 100 }" class="ae-display contact-visit__title">
                Come by and <em>hear</em> the difference.
              </h2>
            </div>
            <p v-reveal="{ delay: 250 }" class="contact-visit__lede">
              Bring a favourite record and try it on our reference systems. Nearest tube: Oxford
              Circus, a few minutes' walk.
            </p>
          </div>

          <div class="contact-visit__grid">
            <figure v-reveal:zoom class="contact__map">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2482.911852945211!2d-0.1427340842369643!3d51.51513481772717!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x48761ad554c335c1%3A0xda2164b934c67c1a!2s123%20Oxford%20St%2C%20London%20W1D%202HG%2C%20UK!5e0!3m2!1sen!2spl!4v1616164800000!5m2!1sen!2spl"
                width="100%"
                height="100%"
                style="border: 0"
                title="Audio Electronics Store location on Google Maps"
                allowfullscreen=""
                loading="lazy"
              >
              </iframe>
              <figcaption class="contact__map-pin">
                <span class="contact__map-dot" aria-hidden="true"></span>
                51.5151° N &nbsp;/&nbsp; 0.1427° W
              </figcaption>
            </figure>

            <div v-reveal.stagger="{ stagger: 120 }" class="contact__details">
              <div class="contact__detail">
                <h3 class="contact__detail-title">Address</h3>
                <address class="contact__detail-body">
                  Audio Electronics Store<br />
                  123 Oxford Street<br />
                  London, W1D 2HG<br />
                  United Kingdom
                </address>
              </div>

              <div class="contact__detail">
                <h3 class="contact__detail-title">Phone</h3>
                <dl class="contact__detail-list">
                  <div v-for="line in phones" :key="line.label" class="contact__detail-row">
                    <dt>{{ line.label }}</dt>
                    <dd>
                      <a :href="`tel:${line.value.replace(/\s/g, '')}`">{{ line.value }}</a>
                    </dd>
                  </div>
                </dl>
              </div>

              <div class="contact__detail">
                <h3 class="contact__detail-title">Email</h3>
                <dl class="contact__detail-list">
                  <div v-for="line in emails" :key="line.label" class="contact__detail-row">
                    <dt>{{ line.label }}</dt>
                    <dd>
                      <a :href="`mailto:${line.value}`">{{ line.value }}</a>
                    </dd>
                  </div>
                </dl>
              </div>

              <div class="contact__detail">
                <h3 class="contact__detail-title">Hours</h3>
                <dl class="contact__detail-list">
                  <div
                    v-for="line in hours"
                    :key="line.label"
                    class="contact__detail-row contact__detail-row--leader"
                  >
                    <dt>{{ line.label }}</dt>
                    <dd>{{ line.value }}</dd>
                  </div>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  </div>
</template>

<script>
import { useToast } from '@/composables/useToast'
import { isValidEmail } from '@/utils/validation'
import MusicNotesComponent from '@/components/decor/MusicNotesComponent.vue'
import StaffDividerComponent from '@/components/decor/StaffDividerComponent.vue'

const PHONE_PATTERN = /^[+()\d\s-]{6,20}$/

// Eighth note, same glyph family as the drifting notes
const NOTE_GLYPH = 'M10 3v19.2A5 5 0 1 0 12 26V9.5c3.4.8 6 3 6.8 6.5.9-5.2-2.6-9.2-8.8-13z'

const FIELDS = [
  { id: 'name', label: 'Full name', type: 'text', autocomplete: 'name' },
  { id: 'email', label: 'Email address', type: 'email', autocomplete: 'email' },
  { id: 'phone', label: 'Phone number', type: 'tel', autocomplete: 'tel', optional: true },
  { id: 'subject', label: 'Subject', type: 'text', autocomplete: 'off' },
  { id: 'message', label: 'Your message', multiline: true, wide: true },
]

function emptyForm() {
  return { name: '', email: '', phone: '', subject: '', message: '' }
}

export default {
  name: 'ContactView',
  components: { MusicNotesComponent, StaffDividerComponent },
  data() {
    return {
      form: emptyForm(),
      errors: emptyForm(),
      isSubmitting: false,
      flightKey: 0,
      fields: FIELDS,
      noteGlyph: NOTE_GLYPH,
      dialMarks: [88, 92, 96, 100, 104, 108],
      phones: [
        { label: 'Main', value: '+44 20 1234 5678' },
        { label: 'Support', value: '+44 20 8765 4321' },
        { label: 'Sales', value: '+44 20 2468 1357' },
      ],
      emails: [
        { label: 'General', value: 'contact@audioelectronics.com' },
        { label: 'Support', value: 'support@audioelectronics.com' },
        { label: 'Sales', value: 'sales@audioelectronics.com' },
      ],
      hours: [
        { label: 'Mon – Fri', value: '9:00 – 21:00' },
        { label: 'Saturday', value: '10:00 – 20:00' },
        { label: 'Sunday', value: '11:00 – 18:00' },
      ],
    }
  },
  beforeUnmount() {
    clearTimeout(this.flightTimer)
  },
  methods: {
    validate() {
      const errors = emptyForm()
      if (!this.form.name) errors.name = 'Please enter your name.'
      if (!this.form.email) errors.email = 'Please enter your email address.'
      else if (!isValidEmail(this.form.email)) errors.email = 'Please enter a valid email address.'
      if (this.form.phone && !PHONE_PATTERN.test(this.form.phone))
        errors.phone = 'Please enter a valid phone number.'
      if (!this.form.subject) errors.subject = 'Please enter a subject.'
      if (!this.form.message) errors.message = 'Please enter your message.'
      this.errors = errors
      return Object.values(errors).every((error) => !error)
    },
    async submitForm() {
      if (this.isSubmitting) return
      if (!this.validate()) {
        // Move focus to the first invalid field
        const firstInvalid = Object.keys(this.errors).find((key) => this.errors[key])
        document.getElementById(firstInvalid)?.focus()
        return
      }
      this.isSubmitting = true
      // No backend yet - simulate sending the message
      await new Promise((resolve) => setTimeout(resolve, 600))
      this.isSubmitting = false
      this.launchNote()
      useToast().showToast("Thank you! Your message has been sent. We'll reply within 24 hours.")
      this.resetForm()
    },
    // A small note flies off the send button after a successful submit
    launchNote() {
      this.flightKey += 1
      clearTimeout(this.flightTimer)
      this.flightTimer = setTimeout(() => {
        this.flightKey = 0
      }, 1400)
    },
    resetForm() {
      this.form = emptyForm()
      this.errors = emptyForm()
    },
  },
}
</script>
<style lang="scss" src="./Contact.scss"></style>
