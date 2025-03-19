<template>
  <div>
    <NavbarComponent @toggle-cart="toggleCart" />

    <!-- Header Section -->
    <header class="header-about">
      <div class="header-about__bgc">
        <h1 class="header-about__heading">IT'S TIME TO KNOW US</h1>
      </div>
    </header>

    <main class="about">
      <v-container>
        <v-row justify="center">
          <v-col cols="12" md="10">
            <h2 class="about__main-title text-center mb-8">Our Story</h2>

            <!-- Story Section -->
            <v-row class="about__section">
              <v-col cols="12" md="6" order="md-2" order-sm="1">
                <v-card elevation="2" class="about__card">
                  <v-card-title class="about__title">The Audio Trio</v-card-title>
                  <v-card-text>
                    <p class="about__text">
                      Founded by three audio enthusiasts - Alex, Jamie, and Taylor - our journey
                      began in a small garage workshop where we spent countless hours perfecting our
                      first amplifier design. Each founder brought unique expertise: Alex mastered
                      acoustics engineering, Jamie specialized in electronic design, and Taylor
                      brought years of experience in premium audio retail.
                    </p>
                    <p class="about__text mt-4">
                      What started as a passion project quickly gained attention from audiophiles
                      seeking equipment that delivered exceptional sound quality without compromise.
                      Our dedication to acoustic perfection and meticulous attention to detail has
                      established us as a trusted name in premium audio solutions.
                    </p>
                  </v-card-text>
                </v-card>
              </v-col>
              <v-col cols="12" md="6" order="md-1" order-sm="2">
                <v-img
                  src="src/assets/img/aboutBackground.jpg"
                  alt="Our team"
                  class="about__image rounded-lg"
                  aspect-ratio="4/3"
                  cover
                ></v-img>
              </v-col>
            </v-row>

            <!-- Sourcing Section -->
            <v-row class="about__section">
              <v-col cols="12" md="6">
                <v-img
                  src="src/assets/img/about.jpg"
                  alt="Premium audio components"
                  class="about__image rounded-lg"
                  aspect-ratio="4/3"
                  cover
                ></v-img>
              </v-col>
              <v-col cols="12" md="6">
                <v-card elevation="2" class="about__card">
                  <v-card-title class="about__title">Our Component Story</v-card-title>
                  <v-card-text>
                    <p class="about__text">
                      We source electronic components from the most reputable manufacturers
                      worldwide. Our pursuit of audio excellence drives us to test and select only
                      parts that meet our stringent quality standards. Alex maintains relationships
                      with premium component makers in Japan, Jamie coordinates with European
                      precision electronics factories, and Taylor ensures we receive exclusive
                      American-engineered drivers.
                    </p>
                    <p class="about__text mt-4">
                      Our dedication extends beyond sound quality - we're committed to ethical
                      manufacturing and environmental responsibility. Each product represents
                      countless hours of design, testing, and refinement to deliver an unparalleled
                      listening experience.
                    </p>
                  </v-card-text>
                </v-card>
              </v-col>
            </v-row>

            <!-- Philosophy Section -->
            <v-row class="about__section">
              <v-col cols="12" md="6" order="md-2" order-sm="1">
                <v-card elevation="2" class="about__card">
                  <v-card-title class="about__title">Our Audio Philosophy</v-card-title>
                  <v-card-text>
                    <p class="about__text">
                      Through our partnership with renowned acoustic engineer Dr. Marcus Wei, we've
                      developed proprietary sound processing technologies that preserve the
                      authentic character of recordings while minimizing distortion and maximizing
                      clarity across the entire frequency spectrum.
                    </p>
                    <p class="about__text mt-4">
                      We believe that exceptional audio equipment should disappear between you and
                      your music, creating an intimate connection with the artist's vision. Every
                      product we create undergoes extensive listening tests in various acoustic
                      environments to ensure consistent performance regardless of your space.
                    </p>
                    <p class="about__text mt-4">
                      This obsessive attention to detail has earned our products recognition in
                      audiophile communities and professional recording studios alike, where
                      accuracy and reliability are non-negotiable requirements.
                    </p>
                  </v-card-text>
                </v-card>
              </v-col>
              <v-col cols="12" md="6" order="md-1" order-sm="2">
                <v-img
                  src="src/assets/img/about.jpg"
                  alt="Audio testing studio"
                  class="about__image rounded-lg"
                  aspect-ratio="4/3"
                  cover
                ></v-img>
              </v-col>
            </v-row>
          </v-col>
        </v-row>

        <!-- Team Section -->
        <v-row justify="center" class="my-12">
          <v-col cols="12">
            <h2 class="text-center mb-8">Meet Our Team</h2>
          </v-col>

          <v-col cols="12" sm="6" md="4">
            <v-card class="about__team-card">
              <v-img
                src="src/assets/img/about.jpg"
                height="300"
                cover
                class="about__team-img"
              ></v-img>
              <v-card-title class="text-center">Alex Martins</v-card-title>
              <v-card-subtitle class="text-center">Acoustic Engineer</v-card-subtitle>
              <v-card-text class="text-center">
                Specializes in speaker design and room acoustics. With 15 years of experience, Alex
                ensures our products deliver perfect sound in any environment.
              </v-card-text>
            </v-card>
          </v-col>

          <v-col cols="12" sm="6" md="4">
            <v-card class="about__team-card">
              <v-img
                src="src/assets/img/about.jpg"
                height="300"
                cover
                class="about__team-img"
              ></v-img>
              <v-card-title class="text-center">Jamie Chen</v-card-title>
              <v-card-subtitle class="text-center">Electronics Designer</v-card-subtitle>
              <v-card-text class="text-center">
                Creates innovative circuit designs that extract maximum performance from minimal
                components. Jamie's minimalist approach results in pure, transparent sound.
              </v-card-text>
            </v-card>
          </v-col>

          <v-col cols="12" sm="6" md="4">
            <v-card class="about__team-card">
              <v-img
                src="src/assets/img/about.jpg"
                height="300"
                cover
                class="about__team-img"
              ></v-img>
              <v-card-title class="text-center">Taylor Reed</v-card-title>
              <v-card-subtitle class="text-center">Customer Experience</v-card-subtitle>
              <v-card-text class="text-center">
                Ensures every customer receives personalized support and guidance. Taylor's
                extensive product knowledge helps customers find their perfect audio match.
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>

        <!-- Testimonials -->
        <v-row justify="center" class="my-12">
          <v-col cols="12">
            <h2 class="text-center mb-8">What Our Clients Say</h2>
          </v-col>

          <v-col cols="12">
            <v-carousel
              height="300"
              hide-delimiter-background
              show-arrows="hover"
              :continuous="false"
              :cycle="true"
              interval="5000"
            >
              <v-carousel-item v-for="(testimonial, i) in testimonials" :key="i">
                <v-sheet
                  color="grey-lighten-4"
                  height="100%"
                  class="d-flex align-center justify-center"
                >
                  <v-container>
                    <v-row justify="center">
                      <v-col cols="12" md="8">
                        <div class="text-center">
                          <v-rating
                            :model-value="5"
                            color="amber"
                            readonly
                            size="small"
                            class="mb-4"
                          ></v-rating>
                          <p class="testimonial-text font-italic mb-4">{{ testimonial.text }}</p>
                          <h4 class="font-weight-bold">{{ testimonial.name }}</h4>
                          <p class="text-subtitle-2">{{ testimonial.title }}</p>
                        </div>
                      </v-col>
                    </v-row>
                  </v-container>
                </v-sheet>
              </v-carousel-item>
            </v-carousel>
          </v-col>
        </v-row>
      </v-container>
    </main>

    <FooterComponent />
    <ShoppingCartComponent v-if="cartVisible" @close="cartVisible = false" />
  </div>
</template>

<script>
import NavbarComponent from '@/components/NavbarComponent.vue'
import FooterComponent from '@/components/FooterComponent.vue'
import ShoppingCartComponent from '@/components/ShoppingCartComponent.vue'

export default {
  name: 'AboutView',
  components: {
    NavbarComponent,
    FooterComponent,
    ShoppingCartComponent,
  },
  data() {
    return {
      cartVisible: false,
      testimonials: [
        {
          name: 'Michael J. Anderson',
          title: 'Professional Music Producer',
          text: "After trying countless audio setups over my 20-year career, I've finally found equipment that reproduces sound exactly as I hear it in the studio. The clarity and precision are unmatched.",
        },
        {
          name: 'Sarah Williams',
          title: 'Audiophile & Collector',
          text: "The level of detail in their amplifiers is extraordinary. I'm hearing nuances in my favorite albums that I never knew existed. Their customer service is equally impressive - personalized and knowledgeable.",
        },
        {
          name: 'Robert Chen',
          title: 'Home Theater Enthusiast',
          text: 'My living room has been transformed into an acoustic paradise. The immersive sound creates an experience that rivals any commercial theater. Friends are constantly asking about my setup.',
        },
      ],
    }
  },
  methods: {
    toggleCart() {
      this.cartVisible = !this.cartVisible
    },
  },
}
</script>

<style lang="scss" src="./About.scss"></style>
