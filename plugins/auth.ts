export default defineNuxtPlugin((_nuxtApp) => {
    addRouteMiddleware('auth', () => {
        const { $auth } = useNuxtApp()
        console.log('user is', $auth)
    }, { global: true })
})
