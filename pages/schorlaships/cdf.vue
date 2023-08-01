<template>
  <div>
    <v-container>
      <v-row
        v-if="pending"
        class="fill-height"
        align-content="center"
        justify="center"
      >
        <v-col
          class="text-subtitle-1 text-center"
          cols="12"
        >
          Fetching CDF schorlaships
        </v-col>
        <v-col cols="6">
          <v-progress-linear
            color="deep-purple-accent-4"
            indeterminate
            rounded
            height="6"
          />
        </v-col>
      </v-row>
      <p v-else>
        you are viewing schorlaships from {{ data!.constituency }}
      </p>
    </v-container>
  </div>
</template>

<script setup lang="ts">
import { doc } from 'firebase/firestore'
definePageMeta({
  middleware: ['auth']
})
const db = useFirestore()
const user = useCurrentUser()

const constituency = ref('')

const ward = ref('')

const { data, promise, pending } = useDocument(doc(db, 'residential_home_details', `${user.value?.uid}`), {
      once: true
    })

    promise.value.then((home) => {
        if (home !== null) {
            constituency.value = home!.constituency
            ward.value = home!.ward
        }
    }).catch((e) => {
    console.log(e)
    })
</script>
