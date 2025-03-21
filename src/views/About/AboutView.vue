<template>
  <div>
    <NavbarComponent @toggle-cart="toggleCart" />

    <!-- Header Section -->
    <header class="header-about">
      <div class="header-about__bgc">
        <h1 class="header-about__heading">IT'S TIME TO KNOW US</h1>
      </div>
    </header>

    <main class="subpage_about">
      <div class="">
        <v-container class="story">
          <v-row justify="center" class="our-story">
            <v-col cols="11" md="8" lg="6">
              <h2 class="about__main-title text-center mb-8">Our Story</h2>

              <!-- Story Section -->
              <v-row class="subpage_about__section__story">
                <v-col cols="12" md="6" order="md-1" order-sm="1" class="d-flex">
                  <div class="h-100 w-100">
                    <v-card elevation="2" class="subpage_about__card h-100">
                      <div class="d-flex flex-column h-100">
                        <v-card-title class="subpage_about__title">The Audio Trio</v-card-title>
                        <v-card-text class="flex-grow-0">
                          <p class="subpage_about__text">
                            Founded by three audio enthusiasts - Alex, Jamie, and Taylor - our
                            journey began in a small garage workshop where we spent countless hours
                            perfecting our first amplifier design. Each founder brought unique
                            expertise: Alex mastered acoustics engineering, Jamie specialized in
                            electronic design, and Taylor brought years of experience in premium
                            audio retail.
                          </p>
                        </v-card-text>
                      </div>
                    </v-card>
                  </div>
                </v-col>
                <v-col cols="12" md="6" order="md-1" order-sm="2" class="d-flex">
                  <div class="h-100 w-100">
                    <v-img
                      src="src/assets/img/about.jpg"
                      alt="Our team"
                      class="subpage_about__image__story rounded-lg"
                      cover
                    ></v-img>
                  </div>
                </v-col>
              </v-row>

              <!-- Sourcing Section -->
              <v-row class="subpage_about__section__sourcing">
                <v-col cols="12" md="6" class="d-flex">
                  <div class="h-100 w-100">
                    <v-img
                      src="src/assets/img/about.jpg"
                      alt="Premium audio components"
                      class="subpage_about__image__sourcing rounded-lg"
                      cover
                    ></v-img>
                  </div>
                </v-col>
                <v-col cols="12" md="6" class="d-flex">
                  <div class="h-100 w-100">
                    <v-card elevation="2" class="subpage_about__card h-100">
                      <div class="d-flex flex-column h-100">
                        <v-card-title class="subpage_about__title"
                          >Our Component Story</v-card-title
                        >
                        <v-card-text class="flex-grow-0">
                          <p class="subpage_about__text">
                            We source electronic components from the most reputable manufacturers
                            worldwide. Our pursuit of audio excellence drives us to test and select
                            only parts that meet our stringent quality standards. Alex maintains
                            relationships with premium component makers in Japan, Jamie coordinates
                            with European precision electronics factories, and Taylor ensures we
                            receive exclusive American-engineered drivers.
                          </p>
                        </v-card-text>
                      </div>
                    </v-card>
                  </div>
                </v-col>
              </v-row>

              <!-- Philosophy Section -->
              <v-row class="subpage_about__section__philosophy">
                <v-col cols="12" md="6" order="md-1" order-sm="1" class="d-flex">
                  <div class="h-100 w-100">
                    <v-card elevation="2" class="subpage_about__card h-100">
                      <div class="d-flex flex-column h-100">
                        <v-card-title class="subpage_about__title"
                          >Our Audio Philosophy</v-card-title
                        >
                        <v-card-text class="flex-grow-0">
                          <p class="subpage_about__text">
                            Through our partnership with renowned acoustic engineer Dr. Marcus Wei,
                            we've developed proprietary sound processing technologies that preserve
                            the authentic character of recordings while minimizing distortion and
                            maximizing clarity across the entire frequency spectrum.
                          </p>
                          <p class="subpage_about__text mt-4">
                            We believe that exceptional audio equipment should disappear between you
                            and your music, creating an intimate connection with the artist's
                            vision. Every product we create undergoes extensive listening tests in
                            various acoustic environments to ensure consistent performance
                            regardless of your space.
                          </p>
                        </v-card-text>
                      </div>
                    </v-card>
                  </div>
                </v-col>
                <v-col cols="12" md="6" order="md-1" order-sm="2" class="d-flex">
                  <div class="h-100 w-100">
                    <v-img
                      src="src/assets/img/about.jpg"
                      alt="Audio testing studio"
                      class="subpage_about__image__philosophy rounded-lg"
                      cover
                    ></v-img>
                  </div>
                </v-col>
              </v-row>
            </v-col>
          </v-row>
        </v-container>

        <v-container class="team">
          <!-- Team Section -->
          <v-col cols="12" md="10" lg="12">
            <v-row justify="center" class="my-12">
              <v-col cols="12">
                <h2 class="text-center mb-8">Meet Our Team</h2>
              </v-col>
              <v-col cols="12" sm="8" md="4" lg="3">
                <v-card class="subpage_about__team-card">
                  <v-img
                    src="src/assets/img/about.jpg"
                    height="300"
                    cover
                    class="subpage_about__team-img"
                  ></v-img>
                  <v-card-title class="team-tittle">Alex Martins</v-card-title>
                  <v-card-subtitle class="team-subtittle">Acoustic Engineer</v-card-subtitle>
                  <v-card-text class="team-text">
                    Specializes in speaker design and room acoustics. With 15 years of experience,
                    Alex ensures our products deliver perfect sound in any environment.
                  </v-card-text>
                </v-card>
              </v-col>

              <v-col cols="12" sm="8" md="4" lg="3">
                <v-card class="subpage_about__team-card">
                  <v-img
                    src="src/assets/img/about.jpg"
                    height="300"
                    cover
                    class="subpage_about__team-img"
                  ></v-img>
                  <v-card-title class="team-tittle">Jamie Chen</v-card-title>
                  <v-card-subtitle class="team-subtittle">Electronics Designer</v-card-subtitle>
                  <v-card-text class="team-text">
                    Creates innovative circuit designs that extract maximum performance from minimal
                    components. Jamie's minimalist approach results in pure, transparent sound.
                  </v-card-text>
                </v-card>
              </v-col>

              <v-col cols="12" sm="8" md="4" lg="3">
                <v-card class="subpage_about__team-card">
                  <v-img
                    src="src/assets/img/about.jpg"
                    height="300"
                    cover
                    class="subpage_about__team-img"
                  ></v-img>
                  <v-card-title class="team-tittle">Taylor Reed</v-card-title>
                  <v-card-subtitle class="team-subtittle">Customer Experience</v-card-subtitle>
                  <v-card-text class="team-text">
                    Ensures every customer receives personalized support and guidance. Taylor's
                    extensive product knowledge helps customers find their perfect audio match.
                  </v-card-text>
                </v-card>
              </v-col>
            </v-row>
          </v-col>
        </v-container>

        <v-container class="testimonials">
          <v-col cols="12" md="10" lg="12">
            <!-- Testimonials -->
            <v-row justify="center" class="my-12">
              <v-col cols="12">
                <h2 class="text-center mb-8">What Our Customers Say</h2>
              </v-col>

              <v-col cols="12" sm="10" md="8" lg="10">
                <v-container>
                  <div class="testimonials-grid">
                    <!-- Testimonial 1 -->
                    <div class="testimonial-card purple-bg">
                      <div class="testimonial-header">
                        <div class="testimonial-img">
                          <v-img
                            src="src/assets/img/testimonials.jpg"
                            width="50"
                            height="50"
                            class="rounded-circle border"
                          ></v-img>
                        </div>
                        <div class="testimonial-user">
                          <h4 class="testimonial-name">Daniel Clifford</h4>
                          <p class="testimonial-title">Verified Customer</p>
                        </div>
                      </div>
                      <h3 class="testimonial-headline">
                        The sound quality exceeded my expectations! Every note comes through with
                        remarkable clarity and power, transforming even the simplest track into an
                        immersive experience.!
                      </h3>
                      <p class="testimonial-text light-text">
                        " I upgraded my home audio system with their premium speakers and
                        amplifiers. The clarity, depth, and richness of the sound are phenomenal –
                        it truly transforms any room into a concert hall. Every note and nuance is
                        delivered with such precision that listening becomes an immersive, almost
                        cinematic experience. The robust build and sleek design not only enhance
                        performance but also add a modern touch to my living space. "
                      </p>
                    </div>

                    <!-- Testimonial 2 -->
                    <div class="testimonial-card dark-grey-bg">
                      <div class="testimonial-header">
                        <div class="testimonial-img">
                          <v-img
                            src="src/assets/img/testimonials.jpg"
                            width="50"
                            height="50"
                            class="rounded-circle border"
                          ></v-img>
                        </div>
                        <div class="testimonial-user">
                          <h4 class="testimonial-name">Jonathan Walters</h4>
                          <p class="testimonial-title">Verified Customer</p>
                        </div>
                      </div>
                      <h3 class="testimonial-headline">
                        Exceptional performance and sleek design!
                      </h3>
                      <p class="testimonial-text light-text">
                        " I recently purchased a state-of-the-art wireless speaker from Audio
                        Electronics. The audio performance is crystal clear and the design is both
                        modern and elegant. Customer service was top-notch too. "
                      </p>
                    </div>

                    <!-- Testimonial 3 -->
                    <div class="testimonial-card white-bg tall-card">
                      <div class="testimonial-header">
                        <div class="testimonial-img">
                          <v-img
                            src="src/assets/img/testimonials.jpg"
                            width="50"
                            height="50"
                            class="rounded-circle border"
                          ></v-img>
                        </div>
                        <div class="testimonial-user">
                          <h4 class="testimonial-name dark-text">Kira Whittle</h4>
                          <p class="testimonial-title dark-text">Verified Customer</p>
                        </div>
                      </div>
                      <h3 class="testimonial-headline dark-text">
                        A game changer for my music experience.
                      </h3>
                      <p class="testimonial-text dark-text">
                        " I was searching for audio equipment that delivers true-to-life sound and
                        found it here. The products perfectly capture every nuance, rendering each
                        beat and note with exceptional precision. This has completely transformed my
                        listening experience, making every moment feel as if I were in the front row
                        of a live performance. The immersive quality of the sound elevates my
                        favorite tracks to an entirely new level, revealing details and textures I
                        never noticed before. Now, every listening session feels like a personal
                        concert, with every instrument and vocal delivered with stunning clarity and
                        emotion. "
                      </p>
                    </div>

                    <!-- Testimonial 4 -->
                    <div class="testimonial-card white-bg">
                      <div class="testimonial-header">
                        <div class="testimonial-img">
                          <v-img
                            src="src/assets/img/testimonials.jpg"
                            width="50"
                            height="50"
                            class="rounded-circle border"
                          ></v-img>
                        </div>
                        <div class="testimonial-user">
                          <h4 class="testimonial-name dark-text">Jeanette Harmon</h4>
                          <p class="testimonial-title dark-text">Verified Customer</p>
                        </div>
                      </div>
                      <h3 class="testimonial-headline dark-text">
                        Superior sound and stylish equipment.
                      </h3>
                      <p class="testimonial-text dark-text">
                        " From high-fidelity amplifiers to elegantly designed wireless headphones,
                        Audio Electronics provides products that blend performance with style
                        perfectly. I’m extremely happy with my purchase. "
                      </p>
                    </div>

                    <!-- Testimonial 5 -->
                    <div class="testimonial-card dark-blue-bg">
                      <div class="testimonial-header">
                        <div class="testimonial-img">
                          <v-img
                            src="src/assets/img/testimonials.jpg"
                            width="50"
                            height="50"
                            class="rounded-circle border"
                          ></v-img>
                        </div>
                        <div class="testimonial-user">
                          <h4 class="testimonial-name">Patrick Abrams</h4>
                          <p class="testimonial-title">Verified Customer</p>
                        </div>
                      </div>
                      <h3 class="testimonial-headline">
                        Unmatched clarity and exceptional support. The audio is so crisp and
                        detailed that it elevates every track to a new level of enjoyment, while the
                        customer service is responsive and knowledgeable. Their commitment to
                        quality really sets them apart from the competition.
                      </h3>
                      <p class="testimonial-text light-text">
                        " Their range of audio equipment has completely transformed my listening
                        experience, bringing an incredible level of detail and emotion to every
                        song. The engineering behind each product is evident in the flawless
                        performance, and the support team truly cares about ensuring a seamless
                        experience for every customer. This combination of top-notch technology and
                        dedicated service makes all the difference. "
                      </p>
                    </div>
                  </div>
                </v-container>
              </v-col>
            </v-row>
          </v-col>
        </v-container>
      </div>
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
