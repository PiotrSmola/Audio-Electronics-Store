// vue.config.js
export default {
  pages: {
    home: {
      entry: 'src/views/Home/main.js',
      template: 'public/index.html',
      filename: 'index.html',
      title: 'Audio Electronics Store - Home',
    },
    about: {
      entry: 'src/views/About/main.js',
      template: 'public/index.html',
      filename: 'about.html',
      title: 'Audio Electronics Store - About',
    },
    products: {
      entry: 'src/views/Products/main.js',
      template: 'public/index.html',
      filename: 'products.html',
      title: 'Audio Electronics Store - Products',
    },
    contact: {
      entry: 'src/views/Contact/main.js',
      template: 'public/index.html',
      filename: 'contact.html',
      title: 'Audio Electronics Store - Contact',
    },
  },
}
