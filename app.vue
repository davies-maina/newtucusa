<template>
  <div>
    <Html lang="en-US">
      <NuxtLayout>
        <v-btn @click="addCustomClaim">
          Click me
        </v-btn>
        <v-container fluid fill-height>
          <v-row justify="center">
            <v-col cols="12" sm="8" md="6">
              <v-alert
                v-model="alert"
                class="mb-4"
                :icon="isError ? '$error' : '$success'"
                closable
                close-label="Close Alert"
                :text="isError ? errorMess : successMess"
                :color="isError ? 'error' : 'success'"
              />
            </v-col>
          </v-row>
          <NuxtPage />
        </v-container>
      </NuxtLayout>
    </html>
  </div>
</template>

<script setup lang="ts">
const router = useRouter()
const route = useRoute()
const user = useCurrentUser()

const { errorMess, alert, isError, successMess } = useShowUserFeedBack()

// we don't need this watcher on server
onMounted(() => {
  watch(user, (user, prevUser) => {
    if (prevUser && !user) {
      // user logged out
      router.push('/login')
    } else if (user && typeof route.query.redirect === 'string') {
      console.log('logged in')
      // user logged in
      router.push(route.query.redirect)
    }
  })
})
async function addCustomClaim () {
  const { data } = await useFetch('/api/add-custom-claim')
  console.log(data)
}

</script>
