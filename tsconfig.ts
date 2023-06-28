
// https://v3.nuxtjs.org/api/configuration/nuxt.config
export default defineNuxtConfig({
  typescript: {
    strict: true,
    typeCheck: true,
  },
  modules: ['@nuxtjs/tailwindcss', '@pinia/nuxt'],
  vite: {
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: '@import "@/assets/scss/main.scss";',
        },
      },
    },
  },
  css: ['vuetify/lib/styles/main.sass'],

  build: {
    transpile: ['vuetify'],
  },

  // css: ['~assets/scss/_fonts.scss'],

  app: {
    head: {
      // meta: [
      //   // <meta name="viewport" content="width=device-width, initial-scale=1">
      //   { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      // ],
      // script: [
      //   // <script src="https://myawesome-lib.js"></script>
      //   { src: 'https://awesome-lib.js' },
      // ],
      title: 'Pilar Ramos',
      link: [
        // <link rel="stylesheet" href="https://myawesome-lib.css">
        { rel: 'icon', type: 'image/png', href: '/favicon.png' },
      ],
      // please note that this is an area that is likely to change
      style: [
        // <style type="text/css">:root { color: red }</style>
      ],
    },
  },
})
