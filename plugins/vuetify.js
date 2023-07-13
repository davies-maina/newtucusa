import '@mdi/font/css/materialdesignicons.css'
import 'vuetify/styles'
import { createVuetify } from 'vuetify'
// import { aliases, mdi } from 'vuetify/lib/iconsets/mdi-svg'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import { LightTheme } from '~/themes/LightTheme'

export default defineNuxtPlugin((nuxtApp) => {
  const vuetify = createVuetify({

    ssr: true,
    components,
    directives,
    theme: {
      themes: {
        light: LightTheme
      }
    }

  })
  nuxtApp.vueApp.use(vuetify)
})
