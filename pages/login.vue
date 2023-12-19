<template>
  <v-row justify="center">
    <v-col cols="12" sm="8" md="6">
      <div>
        <v-form>
          <v-text-field v-model="email.value.value" :error-messages="email.errorMessage.value" label="Email" />
          <v-text-field
            v-model="password.value.value"
            :error-messages="password.errorMessage.value"
            label="Password"
            type="password"
          />
          <v-btn type="submit" color="primary" :loading="buttonIsLoading" @click.prevent="submit">
            Submit
          </v-btn>
        </v-form>
      </div>
    </v-col>
  </v-row>
</template>

<script setup lang="ts">
import { type Auth, signInWithEmailAndPassword } from 'firebase/auth'
definePageMeta({
  middleware: ['guest']
})
const auth = useFirebaseAuth()
const route = useRoute()
const router = useRouter()
const { errorMess, alert, isError, resetAll } = useShowUserFeedBack()
resetAll()
const buttonIsLoading = ref(false)

const { handleSubmit } = useForm({
  validationSchema: {
    email (value: string) {
      if (/^[a-z0-9.-]+@[a-z0-9.-]+\.[a-z]+$/i.test(value)) { return true }

      return 'Must be a valid e-mail.'
    },

    password (value: string) {
      if (!value) { return 'Password is required.' }
      if (value?.length <= 4) { return 'Password must be atleast 5 characters long' }
      return true
    },

  }
})

const email = useField('email')
const password = useField('password')
if (route.query.email) {
  email.value.value = route.query.email
}
const submit = handleSubmit(async (values) => {
  resetAll()
  buttonIsLoading.value = true
  errorMess.value = ''
  try {
    await signInWithEmailAndPassword(auth as Auth, values.email, values.password)
    const { isAdmin, getClaims } = await useCustomClaim()
    await getClaims()

    if (isAdmin.value) {
      await router.push('/admin')
    } else {
      await router.push('/dashboard')
    }

    buttonIsLoading.value = false
  } catch (error: any) {
    buttonIsLoading.value = false
    isError.value = true
    // console.log(error.code)
    errorMess.value = error.code
    alert.value = true
  }
})

</script>
