<template>
  <div v-if="!showVerifyEmailBanner">
    <div v-if="!loadingData">
      <div v-if="formStep! > 0">
        <v-row justify="center">
          <v-col cols="12" sm="8" md="6">
            <Studentregform :hide-prev-btn="hidePreviousButton" />
          </v-col>
        </v-row>
      </div>
      <div v-else>
        <v-row justify="center">
          <v-col cols="12" sm="8" md="10">
            <Opportunities />
          </v-col>
        </v-row>
      </div>
    </div>
    <div v-else>
      <v-row justify="center">
        <v-col cols="12" sm="8" md="6">
          <v-col class="text-subtitle-1 text-center" cols="12">
            Please wait
          </v-col>
          <v-progress-linear color="deep-purple-accent-4" indeterminate rounded height="6" />
        </v-col>
      </v-row>
      <!-- <v-col class="text-subtitle-1 text-center" cols="12">
        Please wait
      </v-col>
      <v-progress-linear color="deep-purple-accent-4" indeterminate rounded height="6" /> -->
    </div>
  </div>
  <div v-else>
    <v-banner
      lines="three"
      color="deep-purple-accent-4"
    >
      <template #prepend>
        <v-avatar
          color="deep-purple-accent-4"
          icon="mdi-account-filter"
        />
      </template>

      <v-banner-text>
        Please verify {{ user?.email }} to see
        personalized data
      </v-banner-text>

      <!-- <v-banner-actions>
        <v-btn>Action</v-btn>

        <v-btn>Action</v-btn>
      </v-banner-actions>
    </v-banner> -->
    </v-banner>
  </div>
</template>
<script setup lang="ts">

import { doc } from 'firebase/firestore'
const db = useFirestore()
const user = await getCurrentUser()
const formStep = useState<number | null>('formstep', () => null)
const loadingData = ref(false)
const showVerifyEmailBanner = ref(false)
const hidePreviousButton = ref(false)
const { setUserDocument } = firestoreFuncs()

definePageMeta({
  middleware: ['auth', 'guest']
})

  onMounted(() => {
    if (user.emailVerified) {
    const { promise, pending } = useDocument(doc(db, 'form_current_step', `${user.uid}`))

    loadingData.value = pending.value

    promise.value.then((currentstep) => {
      if (currentstep != null) {
          loadingData.value = pending.value
          formStep.value = currentstep!.currentstep
          if (currentstep!.currentstep === 2 || currentstep!.currentstep === 3) {
            hidePreviousButton.value = true
          }
      } else {
      setUserDocument('form_current_step', {
        currentstep: 1
      }).then(() => {
        formStep.value = 1
        loadingData.value = false
      })
      }
    }).catch((e) => {
      console.log('error', e)
    })
    // if (currentstep.data.value !== undefined) {
    // console.log('fsvv', currentstep.data.value?.currentstep)

    //   formStep.value = currentstep.data.value?.currentstep
    //   // console.log('fsvv', currentstep.data.value?.currentstep)
    // } else {
    //   loadingData.value = true
    //   await setUserDocument('form_current_step', {
    //     currentstep: 1
    //   })
    //   formStep.value = 1
    //   loadingData.value = false
    // }
  } else {
    showVerifyEmailBanner.value = true
  }
  })
  // console.log('cs', currentstep.data.value?.currentstep)

// const user = useCurrentUser()

</script>
