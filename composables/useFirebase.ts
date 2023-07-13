import { onAuthStateChanged } from 'firebase/auth'
import { useFirebaseUser } from './useState'
export const initUser = () => {
    const { $auth } = useNuxtApp()
    const firebaseUser = useFirebaseUser()
    firebaseUser.value = $auth.currentUser
    onAuthStateChanged($auth, (user) => {
        if (user) {
            console.log(user)
          // https://firebase.google.com/docs/reference/js/auth.user

          // ...
        } else {
            console.log('signed out')
          // User is signed out
          // ...
        }
        firebaseUser.value = user
      })
}
