<template>
  <div class="about-page">
    <!-- Hero -->
    <header class="about-hero ae-grain">
      <div class="about-hero__photo" aria-hidden="true"></div>
      <MusicNotesComponent
        class="about-hero__notes"
        :count="7"
        tone="light"
        :seed="11"
        :max-size="28"
      />

      <div class="about-hero__inner">
        <p v-reveal:fade class="ae-eyebrow">About us</p>
        <h1 v-reveal:words class="about-hero__title ae-display">It's time to <em>know</em> us.</h1>
        <p v-reveal="200" class="about-hero__lede">
          Three friends, one garage workshop and a stubborn belief that good equipment should
          disappear between you and the music.
        </p>

        <nav
          v-reveal.stagger="{ delay: 350, stagger: 80 }"
          class="about-hero__index"
          aria-label="On this page"
        >
          <a
            v-for="item in index"
            :key="item.id"
            :href="`#${item.id}`"
            class="about-hero__index-link"
          >
            <span class="about-hero__index-num">{{ item.num }}</span>
            {{ item.label }}
          </a>
        </nav>
      </div>
    </header>

    <!-- Story -->
    <section class="about-story">
      <div class="about-story__intro">
        <p v-reveal:fade class="ae-eyebrow">01 — Our story</p>
        <h2 v-reveal:words class="about-story__heading ae-display">
          Built by ear, <em>one</em> circuit at a time.
        </h2>
      </div>

      <article id="chapter-trio" class="about-chapter about-chapter--portrait">
        <figure v-reveal:zoom class="about-chapter__figure">
          <img
            src="@/assets/img/about.jpg"
            alt="A DJ at the decks in a dark studio"
            loading="lazy"
          />
          <figcaption class="about-chapter__caption">Fig. 01 — Where it started</figcaption>
        </figure>
        <div v-reveal="120" class="about-chapter__body">
          <p class="about-chapter__label">Chapter 01</p>
          <h3 class="about-chapter__title ae-display">The audio <em>trio</em></h3>
          <p class="about-chapter__text about-chapter__text--lead">
            Founded by three audio enthusiasts, Alex, Jamie and Taylor, our journey began in a small
            garage workshop where we spent countless hours perfecting our first amplifier design.
          </p>
          <p class="about-chapter__text">
            Each founder brought something different to the bench: Alex mastered acoustics
            engineering, Jamie specialised in electronic design, and Taylor brought years of
            experience in premium audio retail.
          </p>
          <dl class="about-chapter__specs">
            <div v-for="founder in founders" :key="founder.name" class="about-chapter__spec">
              <dt>{{ founder.name }}</dt>
              <dd>{{ founder.field }}</dd>
            </div>
          </dl>
        </div>
      </article>

      <article id="chapter-components" class="about-chapter about-chapter--reverse">
        <figure v-reveal:zoom class="about-chapter__figure">
          <img
            src="@/assets/img/about2.jpg"
            alt="Vinyl records, instant photos and a paint set on a rug"
            loading="lazy"
          />
          <figcaption class="about-chapter__caption">Fig. 02 — Parts, picked by hand</figcaption>
        </figure>
        <div v-reveal="120" class="about-chapter__body">
          <p class="about-chapter__label">Chapter 02</p>
          <h3 class="about-chapter__title ae-display">Our component <em>story</em></h3>
          <p class="about-chapter__text about-chapter__text--lead">
            We source electronic components from the most reputable manufacturers worldwide, and
            only parts that pass our own listening and bench tests make it into a product.
          </p>
          <dl class="about-chapter__specs about-chapter__specs--table">
            <div v-for="source in sources" :key="source.region" class="about-chapter__spec">
              <dt>{{ source.region }}</dt>
              <dd>{{ source.parts }}</dd>
              <span class="about-chapter__spec-who">{{ source.who }}</span>
            </div>
          </dl>
        </div>
      </article>

      <figure v-reveal class="about-quote">
        <StaffDividerComponent tone="dark" class="about-quote__staff" />
        <blockquote class="about-quote__text ae-display">
          Exceptional audio equipment should <em>disappear</em> between you and your music.
        </blockquote>
        <figcaption class="about-quote__cite">— The founders’ first rule</figcaption>
      </figure>

      <article id="chapter-philosophy" class="about-chapter about-chapter--wide">
        <figure v-reveal:zoom class="about-chapter__figure">
          <img
            src="@/assets/img/about3.jpg"
            alt="A musician playing a lap steel guitar on a wooden box"
            loading="lazy"
          />
          <figcaption class="about-chapter__caption">Fig. 03 — Tested in real rooms</figcaption>
        </figure>
        <div v-reveal="120" class="about-chapter__body">
          <p class="about-chapter__label">Chapter 03</p>
          <h3 class="about-chapter__title ae-display">Our audio <em>philosophy</em></h3>
          <p class="about-chapter__text about-chapter__text--lead">
            Together with acoustic engineer Dr. Marcus Wei we developed sound processing that keeps
            the authentic character of a recording, with low distortion and clarity across the whole
            frequency range.
          </p>
          <p class="about-chapter__text">
            Every product goes through long listening sessions in different rooms, from a small flat
            to a treated studio, so it performs the same way in your space as it did in ours.
          </p>
        </div>
      </article>
    </section>

    <!-- Team -->
    <section id="team" class="about-team ae-grain">
      <div class="about-team__head">
        <div>
          <p v-reveal:fade class="ae-eyebrow">02 — The people</p>
          <h2 v-reveal:words class="about-team__heading ae-display">
            Three pairs of <em>ears</em>.
          </h2>
        </div>
        <p v-reveal="150" class="about-team__intro">
          The same three people who soldered the first amplifier still sign off on every product we
          sell, and still answer your questions.
        </p>
      </div>

      <ul v-reveal.stagger="{ stagger: 140 }" class="about-team__grid">
        <li v-for="(member, i) in team" :key="member.name" class="about-member">
          <div class="about-member__photo">
            <img :src="member.image" :alt="`Portrait of ${member.name}`" loading="lazy" />
            <span class="about-member__no">No. 0{{ i + 1 }}</span>
          </div>
          <p class="about-member__role">{{ member.role }}</p>
          <h3 class="about-member__name ae-display">{{ member.name }}</h3>
          <p class="about-member__bio">{{ member.bio }}</p>
        </li>
      </ul>
    </section>

    <!-- Testimonials -->
    <section id="listeners" class="about-voices">
      <MusicNotesComponent :count="9" tone="brass" :seed="23" :min-size="14" :max-size="26" />

      <div class="about-voices__inner">
        <p v-reveal:fade class="ae-eyebrow">03 — Listeners</p>

        <div class="about-voices__feature-wrap">
          <figure v-reveal class="about-voices__feature">
            <blockquote class="about-voices__feature-text ae-display">
              “{{ featured.text }}”
            </blockquote>
            <figcaption class="about-voices__person">
              <img :src="featured.image" alt="" class="about-voices__avatar" />
              <span>
                <span class="about-voices__name">{{ featured.name }}</span>
                <span class="about-voices__role">{{ featured.title }}</span>
              </span>
            </figcaption>
          </figure>
          <div v-reveal:zoom="150" class="about-voices__portrait" aria-hidden="true">
            <img :src="featured.image" alt="" loading="lazy" />
          </div>
        </div>

        <div v-reveal.stagger class="about-voices__grid">
          <figure v-for="item in others" :key="item.name" class="about-voice">
            <p class="about-voice__headline ae-display">{{ item.headline }}</p>
            <blockquote class="about-voice__text">{{ item.text }}</blockquote>
            <figcaption class="about-voices__person">
              <img :src="item.image" alt="" class="about-voices__avatar" />
              <span>
                <span class="about-voices__name">{{ item.name }}</span>
                <span class="about-voices__role">{{ item.title }}</span>
              </span>
            </figcaption>
          </figure>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import MusicNotesComponent from '@/components/decor/MusicNotesComponent.vue'
import StaffDividerComponent from '@/components/decor/StaffDividerComponent.vue'
import team1 from '@/assets/img/team1.jpg'
import team2 from '@/assets/img/team2.jpg'
import team3 from '@/assets/img/team3.jpg'
import testimonials1 from '@/assets/img/testimonials1.jpg'
import testimonials2 from '@/assets/img/testimonials2.jpg'
import testimonials3 from '@/assets/img/testimonials3.jpg'
import testimonials4 from '@/assets/img/testimonials4.jpg'
import testimonials5 from '@/assets/img/testimonials5.jpg'

export default {
  name: 'AboutView',
  components: { MusicNotesComponent, StaffDividerComponent },
  data() {
    return {
      index: [
        { id: 'chapter-trio', num: '01', label: 'Our story' },
        { id: 'team', num: '02', label: 'The people' },
        { id: 'listeners', num: '03', label: 'Listeners' },
      ],
      founders: [
        { name: 'Alex', field: 'Acoustics' },
        { name: 'Jamie', field: 'Electronics' },
        { name: 'Taylor', field: 'Retail' },
      ],
      sources: [
        { region: 'Japan', parts: 'Premium capacitors & components', who: 'Alex' },
        { region: 'Europe', parts: 'Precision electronics', who: 'Jamie' },
        { region: 'USA', parts: 'Exclusive drivers', who: 'Taylor' },
      ],
      team: [
        {
          name: 'Alex Martins',
          role: 'Acoustic engineer',
          image: team1,
          bio: 'Specialises in speaker design and room acoustics. With 15 years of experience, Alex makes sure our products sound right in any room.',
        },
        {
          name: 'Jamie Chen',
          role: 'Electronics designer',
          image: team3,
          bio: 'Draws circuits that get the most out of very few components. Jamie’s minimalist approach is why our amplifiers sound so transparent.',
        },
        {
          name: 'Taylor Reed',
          role: 'Customer experience',
          image: team2,
          bio: 'Makes sure every customer gets personal advice. Taylor knows the catalogue inside out and will help you find your match.',
        },
      ],
      testimonials: [
        {
          name: 'Danielle Clifford',
          title: 'Verified customer',
          image: testimonials1,
          text: 'I upgraded my home system with their speakers and amplifiers. It turned my living room into a concert hall: every note and nuance arrives with real precision.',
        },
        {
          name: 'Jonathan Walters',
          title: 'Verified customer',
          image: testimonials2,
          headline: 'Exceptional performance, sleek design.',
          text: 'My wireless speaker sounds crystal clear and looks great on the shelf. Customer service was top-notch too.',
        },
        {
          name: 'Kira Whittle',
          title: 'Verified customer',
          image: testimonials3,
          headline: 'A game changer for my listening.',
          text: 'I’m hearing details and textures in my favourite records I never noticed before. Every session feels like a front-row seat.',
        },
        {
          name: 'Jeanette Harmon',
          title: 'Verified customer',
          image: testimonials4,
          headline: 'Superior sound, stylish kit.',
          text: 'From the amplifier to the headphones, everything blends performance with style. I’m very happy with my purchase.',
        },
        {
          name: 'Patrick Abrams',
          title: 'Verified customer',
          image: testimonials5,
          headline: 'Clarity, and support that cares.',
          text: 'The engineering shows in every song, and the support team actually knows what they are talking about.',
        },
      ],
    }
  },
  computed: {
    featured() {
      return this.testimonials[0]
    },
    others() {
      return this.testimonials.slice(1)
    },
  },
}
</script>

<style lang="scss" src="./About.scss"></style>
