
export default defineNuxtRouteMiddleware(async (to, _from) => {
  const { isAdmin, getClaims } = useCustomClaim()
  await getClaims()
  
  if (!isAdmin.value) {
        return abortNavigation()
      } else if (isAdmin.value && (to.path === '/login' || to.path === '/register')) {
        return navigateTo('/admin')
      }
 
})
