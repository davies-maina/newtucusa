export default defineNuxtConfig({
  typescript: {
    strict: true,
    typeCheck: true
  },

  modules: ['@nuxtjs/tailwindcss', '@pinia/nuxt', '@vee-validate/nuxt', 'nuxt-vuefire', '@vueuse/nuxt',],
  veeValidate: {
    autoImports: true,
  },
  pinia: {
    autoImports: [
      // automatically imports `defineStore`
      'defineStore', // import { defineStore } from 'pinia'
      ['defineStore', 'definePiniaStore'], // import { defineStore as definePiniaStore } from 'pinia'
    ],
  },

  vite: {
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: '@import "@/assets/scss/main.scss";'
        }
      }
    }
  },
  css: ['vuetify/lib/styles/main.sass'],

  build: {
    transpile: ['vuetify']
  },
  runtimeConfig: {

    public: {
      GOOGLE_ANALYTICS_MEASUREMENTID: process.env.GOOGLE_ANALYTICS_MEASUREMENTID,
      FIREBASE_API_KEY: process.env.FIREBASE_API_KEY,
      FIREBASE_AUTH_DOMAIN: process.env.FIREBASE_AUTH_DOMAIN,
      FIREBASE_PROJECT_ID: process.env.FIREBASE_PROJECT_ID,
      FIREBASE_APP_ID: process.env.FIREBASE_APP_ID,

    }
  },
ssr: false,
  vuefire: {
    auth: true,
    config: {
      apiKey: process.env.FIREBASE_API_KEY,
      authDomain: process.env.FIREBASE_AUTH_DOMAIN,
      projectId: process.env.FIREBASE_PROJECT_ID,
      appId: process.env.FIREBASE_APP_ID,
    },
  },
  nitro: {
    prerender: {
      routes: ['/', '/login', '/register']
    }
  }
})
