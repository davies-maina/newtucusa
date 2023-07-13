<template>
  <div>
    <v-form>
      <v-text-field
        v-model="email.value.value"
        :error-messages="email.errorMessage.value"
        label="Email"
      />
      <v-text-field
        v-model="password.value.value"
        :error-messages="password.errorMessage.value"
        label="Password"
        type="password"
      />
      <v-btn
        type="submit"
        color="primary"
        :loading="buttonIsLoading"
        @click.prevent="submit"
      >
        Submit
      </v-btn>
    </v-form>
  </div>
</template>

<script setup lang="ts">
import { signInWithEmailAndPassword } from 'firebase/auth'
const { $auth } = useNuxtApp()
const route = useRoute()

const alert = ref(false)
const buttonIsLoading = ref(false)
const isError = ref(false)
const errorMess = ref('')

const { handleSubmit } = useForm({
  validationSchema: {

    email (value: string) {
      if (/^[a-z.-]+@[a-z.-]+\.[a-z]+$/i.test(value)) { return true }

      return 'Must be a valid e-mail.'
    },
    password (value: string) {
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
  const { user } = await signInWithEmailAndPassword($auth, values.email, values.password)
  buttonIsLoading.value = true
  errorMess.value = ''
  try {
    buttonIsLoading.value = false
    alert.value = true
  } catch (error:any) {
    buttonIsLoading.value = false
    isError.value = true
    // console.log(error.code)
    errorMess.value = error.code
    alert.value = true
  }
})

</script>
