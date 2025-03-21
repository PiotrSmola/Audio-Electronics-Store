<template>
  <div>
    <NavbarComponent @toggle-cart="toggleCart" />
    <div class="contact-body">
      <header class="header-contact">
        <div class="header-contact__bgc">
          <div class="header-contact__body container">
            <p class="header-contact__text">Have Questions About Premium Audio Products?</p>
            <h1 class="header-contact__heading">Get In Touch With Our Experts</h1>
            <a class="header-contact__link" href="#contact">Contact Us Now</a>
          </div>
        </div>
      </header>
      <main class="contact" id="contact">
        <section class="contact__section container">
          <h1 class="contact__title">Contact Us</h1>

          <!-- Contact Form Section -->
          <div class="contact__form-container">
            <div class="contact__form-info">
              <h2 class="contact__subtitle">Get In Touch</h2>
              <p class="contact__description">
                Have questions about our products or services? Fill out the form and our team will
                get back to you within 24 hours.
              </p>
              <div class="contact__quick-info">
                <v-icon color="primary" class="contact__icon">mdi-phone</v-icon>
                <span>+48 123 456 789</span>
              </div>
              <div class="contact__quick-info">
                <v-icon color="primary" class="contact__icon">mdi-email</v-icon>
                <span>contact@audioelectronics.com</span>
              </div>
            </div>

            <div class="contact__form">
              <div class="contact__form-group">
                <label for="name">Full Name</label>
                <input
                  type="text"
                  id="name"
                  class="contact__form-control"
                  placeholder="Your name"
                />
              </div>
              <div class="contact__form-group">
                <label for="email">Email Address</label>
                <input
                  type="email"
                  id="email"
                  class="contact__form-control"
                  placeholder="Your email address"
                />
              </div>
              <div class="contact__form-group">
                <label for="phone">Phone Number</label>
                <input
                  type="tel"
                  id="phone"
                  class="contact__form-control"
                  placeholder="Your phone number"
                />
              </div>
              <div class="contact__form-group">
                <label for="subject">Subject</label>
                <input
                  type="text"
                  id="subject"
                  class="contact__form-control"
                  placeholder="Message subject"
                />
              </div>
              <div class="contact__form-group">
                <label for="message">Message</label>
                <textarea
                  id="message"
                  class="contact__form-control contact__form-textarea"
                  placeholder="Your message"
                ></textarea>
              </div>
              <div class="contact__form-buttons">
                <button type="reset" class="contact__form-button contact__form-button--secondary">
                  Clear
                </button>
                <button type="submit" class="contact__form-button contact__form-button--primary">
                  Send Message
                </button>
              </div>
            </div>
          </div>

          <!-- Map Section -->
          <div class="contact__map">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2482.911852945211!2d-0.1427340842369643!3d51.51513481772717!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x48761ad554c335c1%3A0xda2164b934c67c1a!2s123%20Oxford%20St%2C%20London%20W1D%202HG%2C%20UK!5e0!3m2!1sen!2spl!4v1616164800000!5m2!1sen!2spl"
              width="100%"
              height="100%"
              style="border: 0"
              allowfullscreen=""
              loading="lazy"
            >
            </iframe>
          </div>

          <!-- Contact Details Section -->
          <div class="contact__details-container">
            <h2 class="contact__subtitle-details">Contact Details</h2>
            <div class="contact__details">
              <div class="contact__detail-card">
                <v-icon size="large" color="primary" class="contact__detail-icon"
                  >mdi-map-marker</v-icon
                >
                <h3 class="contact__detail-title">Our Address</h3>
                <p class="contact__detail-text">Audio Electronics Store</p>
                <p class="contact__detail-text">123 Oxford Street</p>
                <p class="contact__detail-text">London, W1D 2HG</p>
                <p class="contact__detail-text">United Kingdom</p>
              </div>

              <div class="contact__detail-card">
                <v-icon size="large" color="primary" class="contact__detail-icon">mdi-phone</v-icon>
                <h3 class="contact__detail-title">Phone Numbers</h3>
                <p class="contact__detail-text"><strong>Main:</strong> &nbsp; +44 20 1234 5678</p>
                <p class="contact__detail-text">
                  <strong>Support:</strong> &nbsp; +44 20 8765 4321
                </p>
                <p class="contact__detail-text"><strong>Sales:</strong> &nbsp; +44 20 2468 1357</p>
              </div>

              <div class="contact__detail-card">
                <v-icon size="large" color="primary" class="contact__detail-icon">mdi-email</v-icon>
                <h3 class="contact__detail-title">Email Addresses</h3>
                <p class="contact__detail-text">
                  <strong>General:</strong><br />
                  contact@audioelectronics.com
                </p>
                <p class="contact__detail-text">
                  <strong>Support:</strong><br />
                  support@audioelectronics.com
                </p>
                <p class="contact__detail-text">
                  <strong>Sales:</strong><br />
                  sales@audioelectronics.com
                </p>
              </div>

              <div class="contact__detail-card">
                <v-icon size="large" color="primary" class="contact__detail-icon">mdi-clock</v-icon>
                <h3 class="contact__detail-title">Opening Hours</h3>
                <p class="contact__detail-text">Monday - Friday: 9:00 - 21:00</p>
                <p class="contact__detail-text">Saturday: 10:00 - 20:00</p>
                <p class="contact__detail-text">Sunday: 11:00 - 18:00</p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <FooterComponent />
      <ShoppingCartComponent v-if="cartVisible" @close="cartVisible = false" />
    </div>
  </div>
</template>

<script>
import NavbarComponent from '@/components/NavbarComponent.vue'
import FooterComponent from '@/components/FooterComponent.vue'
import ShoppingCartComponent from '@/components/ShoppingCartComponent.vue'

export default {
  name: 'ContactView',
  components: {
    NavbarComponent,
    FooterComponent,
    ShoppingCartComponent,
  },
  data() {
    return {
      cartVisible: false,
    }
  },
  methods: {
    toggleCart() {
      this.cartVisible = !this.cartVisible
    },
  },
}
</script>
<style lang="scss" src="./Contact.scss"></style>
