export default defineNuxtRouteMiddleware(async (to, _from) => {
    const user = await getCurrentUser()

    // redirect the user to the login page
    if (user && (to.path === '/login' || to.path === '/register')) {
      return navigateTo('/dashboard')
    }
  })
