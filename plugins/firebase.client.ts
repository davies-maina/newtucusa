import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'
import { initUser } from '~/composables/useFirebase'

export default defineNuxtPlugin((_nuxtApp) => {
    const config = useRuntimeConfig().public

    const firebaseConfig = {
        apiKey: config.FIREBASE_API_KEY,
        authDomain: config.FIREBASE_AUTH_DOMAIN,
        projectId: config.FIREBASE_PROJECT_ID,
        // storageBucket: config.FB_STORAGE_BUCKET,
        // messagingSenderId: config.FB_MESSAGING_SENDER_ID,
        appId: config.FIREBASE_APP_ID,
        measurementId: config.GOOGLE_ANALYTICS_MEASUREMENTID
    }
    const app = initializeApp(firebaseConfig)
    const auth = getAuth(app)
    const firestore = getFirestore(app)

    //   addRouteMiddleware('my-middleware', (to, from) => {
    //     if (process.server) { return }
    //     if (process.client) {
    //       console.log('auth is true', auth.currentUser)
    //     }
    // }, { global: true })
    initUser()
    return {
        provide: {
            auth, firestore
        }
    }

    // nuxtApp.vueApp.provide('firestore', firestore)
    // nuxtApp.provide('firestore', firestore)
})
