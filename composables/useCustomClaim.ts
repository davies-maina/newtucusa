import { getIdTokenResult } from 'firebase/auth'
const isAdmin = ref(false)
export const useCustomClaim = () => {
  const getClaims = async () => {
    const user = await getCurrentUser()
    if (user) {
      const idTokenResult = await getIdTokenResult(user)
      if (idTokenResult.claims.admin) {
              isAdmin.value = true
            }
    } else {
      isAdmin.value = false
    }
  }
  const reset = () => {
    isAdmin.value = false
  }
  return {
    isAdmin, getClaims, reset
  }
// if(user) {
//     const idTokenResult = await getIdTokenResult(user)
//     if(idTokenResult.claims.admin){
//       isAdmin.value=true
//     }
//     // console.log(isAdmin.value)
//     // console.log(idTokenResult.claims)
//   return idTokenResult.claims
//   }

//   else{
//     return null
//   }
}
