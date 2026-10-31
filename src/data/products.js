// Single source of truth for all product data used across the store
// (product list, product details, navbar search and shopping cart).

import product1 from '@/assets/img/product1.jpg'
import product2 from '@/assets/img/product2.jpg'
import product3 from '@/assets/img/product3.jpg'
import product4 from '@/assets/img/product4.jpg'
import product5 from '@/assets/img/product5.jpg'
import product6 from '@/assets/img/product6.jpg'
import product7 from '@/assets/img/product7.jpg'
import product8 from '@/assets/img/product8.jpg'
import product9 from '@/assets/img/product9.jpg'

// Gallery images shown on the product details page (next to the product's own image)
const galleryImages = [product1, product2, product3, product4]

function buildGallery(mainImage) {
  return [mainImage, ...galleryImages.filter((image) => image !== mainImage)].slice(0, 4)
}

export const products = [
  {
    id: 1,
    name: 'Amplifier X100',
    price: 299.99,
    imgSrc: product1,
    images: buildGallery(product1),
    description:
      'High-end audio amplifier with crystal clear sound reproduction and powerful output for audiophiles.',
    fullDescription:
      'High-end audio amplifier with crystal clear sound reproduction and powerful output for audiophiles. The X100 delivers superior audio performance with its high-quality components and advanced circuitry. Perfect for music enthusiasts who demand nothing but the best sound quality.',
    specifications: {
      power: '100W per channel',
      impedance: '4-16 ohms',
      frequency: '20Hz - 20kHz',
      dimensions: '17.3" x 4.1" x 13.8"',
      weight: '22 lbs',
      inputs: '3 RCA, 1 XLR, 1 Digital Optical',
      outputs: '2 Speaker terminals, 1 Headphone jack',
      warranty: '3 years',
    },
    reviews: [
      {
        title: 'Excellent Sound Quality',
        author: 'AudioEnthusiast',
        rating: 5,
        comment:
          'This amplifier exceeded my expectations. The sound is incredibly detailed and the power handling is impressive. Works perfectly with my bookshelf speakers. Highly recommended!',
      },
      {
        title: 'Worth Every Penny',
        author: 'MusicLover42',
        rating: 4,
        comment:
          'Great amplifier that delivers clear and powerful sound. The build quality is excellent and it looks gorgeous in my setup. Only reason for 4 stars is that it runs a bit hot after long sessions.',
      },
      {
        title: 'Impressive Clarity',
        author: 'SoundEngineer',
        rating: 5,
        comment:
          "As a professional sound engineer, I'm very picky about my audio equipment. This amplifier provides exceptional clarity and detail. The dynamics are preserved beautifully and the soundstage is impressive.",
      },
    ],
  },
  {
    id: 2,
    name: 'Bluetooth Speaker',
    price: 149.99,
    imgSrc: product2,
    images: buildGallery(product2),
    description:
      'Portable speaker with excellent sound quality and long-lasting battery life for your outdoor adventures.',
    fullDescription:
      'Portable speaker with excellent sound quality and long-lasting battery life for your outdoor adventures. Take your music anywhere with this rugged, water-resistant speaker that delivers impressive sound in a compact package.',
    specifications: {
      power: '30W',
      batteryLife: 'Up to 20 hours',
      bluetooth: 'Bluetooth 5.0',
      waterResistance: 'IPX7',
      dimensions: '8.5" x 3.6" x 3.6"',
      weight: '2.5 lbs',
      inputs: 'Bluetooth, 3.5mm AUX',
      charging: 'USB-C',
      warranty: '2 years',
    },
    reviews: [
      {
        title: 'Great Sound for the Size',
        author: 'OutdoorFan',
        rating: 5,
        comment:
          'I take this speaker everywhere - camping, beach trips, backyard parties. The sound is impressive for its size and the battery lasts all day. The water resistance has saved it multiple times!',
      },
      {
        title: 'Solid Build, Good Sound',
        author: 'TechReviewer',
        rating: 4,
        comment:
          'This speaker packs a punch with solid bass and clear highs. Build quality is excellent and the controls are intuitive. Battery life is as advertised. Only giving 4 stars because the companion app is a bit buggy.',
      },
      {
        title: 'Perfect Travel Companion',
        author: 'FrequentTraveler',
        rating: 5,
        comment:
          "I've taken this speaker on multiple trips and it hasn't let me down. Sound quality is great for hotel rooms and small gatherings. The battery life is impressive, easily lasting through a weekend trip.",
      },
    ],
  },
  {
    id: 3,
    name: 'Wireless Headphones',
    price: 199.99,
    imgSrc: product3,
    images: buildGallery(product3),
    description:
      'Premium wireless headphones for professionals with noise cancellation and studio-quality sound.',
    fullDescription:
      'Premium wireless headphones for professionals with noise cancellation and studio-quality sound. Adaptive active noise cancellation shuts out the world around you, while plush memory-foam ear cushions keep you comfortable through long listening sessions and travel days.',
    specifications: {
      drivers: '40mm dynamic drivers',
      frequency: '10Hz - 30kHz',
      noiseCancellation: 'Adaptive ANC',
      batteryLife: 'Up to 35 hours',
      bluetooth: 'Bluetooth 5.2 (AAC, aptX HD)',
      charging: 'USB-C, 10 min = 5 hours',
      weight: '0.6 lbs',
      warranty: '2 years',
    },
    reviews: [
      {
        title: 'Silence on Demand',
        author: 'DailyCommuter',
        rating: 5,
        comment:
          'The noise cancellation is outstanding - the train noise simply disappears. Sound is warm and detailed, and the battery easily lasts my whole work week. Best headphones I have ever owned.',
      },
      {
        title: 'Comfortable All Day',
        author: 'RemoteWorker',
        rating: 4,
        comment:
          'I wear these for hours of video calls and music without any discomfort. Microphone quality is good and pairing is quick. Taking off one star because the case is a bit bulky.',
      },
      {
        title: 'Studio Sound Without Wires',
        author: 'BeatMaker',
        rating: 5,
        comment:
          'I was skeptical about wireless headphones for critical listening, but these surprised me. The bass is tight, the mids are natural and the highs never get harsh. Great for both production and travel.',
      },
    ],
  },
  {
    id: 4,
    name: 'Soundbar Pro',
    price: 249.99,
    imgSrc: product4,
    images: buildGallery(product4),
    description:
      'Sleek soundbar that delivers immersive audio experience for your home theater setup.',
    fullDescription:
      'Sleek soundbar that delivers immersive audio experience for your home theater setup. Virtual surround processing and a dedicated dialogue mode bring movies to life, while HDMI eARC makes setup with your TV a one-cable job.',
    specifications: {
      power: '200W total',
      channels: '3.1 with built-in subwoofer',
      frequency: '40Hz - 20kHz',
      surround: 'Dolby Atmos virtual surround',
      inputs: 'HDMI eARC, Digital Optical, Bluetooth 5.0',
      dimensions: '38.6" x 2.6" x 4.1"',
      weight: '7.9 lbs',
      warranty: '2 years',
    },
    reviews: [
      {
        title: 'Cinema in My Living Room',
        author: 'MovieNightFan',
        rating: 5,
        comment:
          'Setup took five minutes with the HDMI cable and the difference is night and day. Explosions have real weight and the dialogue mode makes every word crystal clear. My TV speakers are retired for good.',
      },
      {
        title: 'Great Value Upgrade',
        author: 'HomeTheaterNewbie',
        rating: 4,
        comment:
          'Huge improvement over built-in TV sound and it looks very elegant under the screen. The built-in subwoofer is decent, but a separate one would add more punch for action movies.',
      },
      {
        title: 'Clear Dialogue, Rich Music',
        author: 'SeriesBinger',
        rating: 5,
        comment:
          'I bought it mainly to stop turning the volume up and down during shows, and it solved that completely. Music over Bluetooth also sounds full and balanced. Very happy with this purchase.',
      },
    ],
  },
  {
    id: 5,
    name: 'Studio Headphones',
    price: 349.99,
    imgSrc: product5,
    images: buildGallery(product5),
    description:
      'Professional studio headphones with precise sound reproduction for music production.',
    fullDescription:
      'Professional studio headphones with precise sound reproduction for music production. A flat, neutral frequency response reveals every detail of your mix, and the closed-back design keeps bleed to a minimum when recording.',
    specifications: {
      type: 'Closed-back, over-ear',
      drivers: '45mm neodymium drivers',
      frequency: '5Hz - 40kHz',
      impedance: '38 ohms',
      sensitivity: '99 dB/mW',
      cable: 'Detachable, 3m coiled and 1.2m straight',
      weight: '0.7 lbs',
      warranty: '3 years',
    },
    reviews: [
      {
        title: 'Honest, Neutral Sound',
        author: 'MixEngineer',
        rating: 5,
        comment:
          'These headphones tell the truth about my mixes. Nothing is hyped, so what sounds good on them translates well to other systems. The detachable cables are a big plus in a busy studio.',
      },
      {
        title: 'Built Like a Tank',
        author: 'HomeStudioOwner',
        rating: 5,
        comment:
          'Solid construction, comfortable pads and excellent isolation for tracking vocals. They are not the most exciting headphones for casual listening, but for studio work they are perfect.',
      },
      {
        title: 'Excellent Detail',
        author: 'PodcastProducer',
        rating: 4,
        comment:
          'I can hear every mouth click and background noise, which makes editing much easier. The clamping force is a bit strong at first, but it loosened up after a couple of weeks.',
      },
    ],
  },
  {
    id: 6,
    name: 'Turntable Classic',
    price: 179.99,
    imgSrc: product6,
    images: buildGallery(product6),
    description:
      'Vintage-inspired turntable with modern technology for vinyl enthusiasts and collectors.',
    fullDescription:
      'Vintage-inspired turntable with modern technology for vinyl enthusiasts and collectors. A belt-driven platter and pre-mounted cartridge deliver warm, stable playback, while the built-in phono preamp and USB output let you connect it to any system or digitize your records.',
    specifications: {
      drive: 'Belt drive',
      speeds: '33 1/3, 45 RPM',
      cartridge: 'Moving magnet, pre-installed',
      phonoPreamp: 'Built-in, switchable',
      outputs: 'RCA line/phono, USB',
      dimensions: '16.5" x 5.5" x 14"',
      weight: '11 lbs',
      warranty: '2 years',
    },
    reviews: [
      {
        title: 'Beautiful and Warm Sound',
        author: 'VinylCollector',
        rating: 5,
        comment:
          'The wooden finish looks stunning on my shelf and the sound is warm and full of character. Setup was simple thanks to the pre-installed cartridge. My records have never sounded better.',
      },
      {
        title: 'Perfect First Turntable',
        author: 'RetroSoul',
        rating: 4,
        comment:
          'Great entry into vinyl. The built-in preamp means I could plug it straight into my powered speakers. I would like a slightly heavier platter, but for the price it is excellent.',
      },
      {
        title: 'Digitizing Made Easy',
        author: 'JazzArchivist',
        rating: 5,
        comment:
          'I used the USB output to digitize my old jazz collection and the results are clean and quiet. Speed stability is very good and the dust cover fits nicely. Highly recommended.',
      },
    ],
  },
  {
    id: 7,
    name: 'Digital Mixer',
    price: 399.99,
    imgSrc: product7,
    images: buildGallery(product7),
    description: 'Advanced digital mixer with multiple channels and effects for live performances.',
    fullDescription:
      'Advanced digital mixer with multiple channels and effects for live performances. Studio-grade preamps, built-in effects and scene recall make it easy to run a gig, rehearse or record a multitrack session straight to your computer.',
    specifications: {
      channels: '16 inputs, 8 outputs',
      preamps: '12 mic preamps with phantom power',
      effects: '4 FX engines, 100+ presets',
      eq: '4-band parametric on every channel',
      recording: '18x18 USB audio interface',
      display: '7" touchscreen',
      weight: '13 lbs',
      warranty: '3 years',
    },
    reviews: [
      {
        title: 'A Game Changer for Our Band',
        author: 'LiveSoundTech',
        rating: 5,
        comment:
          'Scene recall alone saves us so much time between venues. The preamps are quiet and the built-in effects are surprisingly good. We record every show over USB now.',
      },
      {
        title: 'Powerful but Takes Time to Learn',
        author: 'ChurchVolunteer',
        rating: 4,
        comment:
          'Sound quality is excellent and there is a huge amount of flexibility. The menus took some getting used to, but after a few rehearsals our whole team is comfortable with it.',
      },
      {
        title: 'Compact Powerhouse',
        author: 'EventProducer',
        rating: 5,
        comment:
          'It replaces a rack full of outboard gear and fits in a backpack-sized case. The touchscreen is responsive and the routing options are fantastic for small events.',
      },
    ],
  },
  {
    id: 8,
    name: 'Bass Speaker',
    price: 279.99,
    imgSrc: product8,
    images: buildGallery(product8),
    description:
      'Powerful bass speaker that adds depth to your music with clear low frequencies. Perfect for parties.',
    fullDescription:
      'Powerful bass speaker that adds depth to your music with clear low frequencies. Perfect for parties. A long-throw woofer and tuned bass port produce deep, controlled lows, and the adjustable crossover lets it blend seamlessly with your existing speakers.',
    specifications: {
      power: '300W RMS',
      woofer: '12" long-throw woofer',
      frequency: '25Hz - 200Hz',
      crossover: 'Adjustable 50Hz - 150Hz',
      inputs: 'RCA LFE, Speaker level, Wireless',
      dimensions: '15" x 15.7" x 16.5"',
      weight: '37 lbs',
      warranty: '3 years',
    },
    reviews: [
      {
        title: 'Bass You Can Feel',
        author: 'PartyHost',
        rating: 5,
        comment:
          'This speaker shakes the room in the best possible way. Even at high volume the bass stays tight and clean without any rattling. Every party at my place is better now.',
      },
      {
        title: 'Blends Perfectly',
        author: 'HiFiTinkerer',
        rating: 5,
        comment:
          'The adjustable crossover made it easy to integrate with my floor-standing speakers. Low notes in orchestral music now have real weight and texture. Excellent engineering.',
      },
      {
        title: 'Big Sound, Big Box',
        author: 'ApartmentListener',
        rating: 4,
        comment:
          'The sound quality is amazing, but it is larger and heavier than I expected, so measure your space first. Once placed, the wireless connection works flawlessly.',
      },
    ],
  },
  {
    id: 9,
    name: 'DJ Controller',
    price: 329.99,
    imgSrc: product9,
    images: buildGallery(product9),
    description:
      'Professional DJ controller with intuitive controls and seamless integration with popular DJ software.',
    fullDescription:
      'Professional DJ controller with intuitive controls and seamless integration with popular DJ software. Full-size jog wheels, performance pads and a built-in sound card give you everything you need to play clubs, weddings or your next livestream.',
    specifications: {
      decks: '2-channel, 4-deck control',
      jogWheels: '6" touch-sensitive jog wheels',
      pads: '16 RGB performance pads',
      soundCard: '24-bit / 48kHz built-in',
      outputs: 'XLR master, RCA booth, Headphone jack',
      software: 'Compatible with leading DJ software',
      weight: '9.5 lbs',
      warranty: '2 years',
    },
    reviews: [
      {
        title: 'Feels Like Club Gear',
        author: 'WeekendDJ',
        rating: 5,
        comment:
          'The jog wheels are responsive and the pads feel great under the fingers. It mapped to my software instantly with no configuration. I played my first wedding with it and everything went flawlessly.',
      },
      {
        title: 'Great for Learning and Gigging',
        author: 'BedroomMixer',
        rating: 5,
        comment:
          'I started learning to mix on this controller and it grows with me. The layout is logical, the built-in sound card is clean and the booth output is a nice professional touch.',
      },
      {
        title: 'Solid Controller',
        author: 'MobileDJ',
        rating: 4,
        comment:
          'Build quality and sound are excellent and it fits easily in my car with the rest of my gear. I only wish it had a dedicated microphone input with its own EQ.',
      },
    ],
  },
]

export function getProductById(id) {
  const numericId = Number(id)
  return products.find((product) => product.id === numericId) || null
}
