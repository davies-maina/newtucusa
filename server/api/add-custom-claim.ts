import { initializeApp, cert } from 'firebase-admin/app'
import { getAuth } from 'firebase-admin/auth'
const app = initializeApp({
  credential: cert(process.env.GOOGLE_APPLICATION_CREDENTIALS as string)
})

export default defineEventHandler((event) => {
  const claims = { admin: true }
  getAuth()
    .setCustomUserClaims('wDNsupYskPXpDlKt9Rk6bK0dsZr2', claims)
    .then(() => {
      console.log('Custom claims set for user')
    })
    .catch((error) => {
      console.error('Error setting custom claims:', error)
    })
  event.node.res.end()
})
