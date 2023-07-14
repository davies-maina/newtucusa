<template>
  <div>
    <!-- <v-alert
      v-model="alert"
      class="mb-4"
      :icon="isError ? '$error' : '$success'"
      closable
      close-label="Close Alert"
      :text="isError ? errorMess : `Email sent to ${email.value.value}`"
      :color="isError ? 'error' : 'success'"
    /> -->

    <v-form>
      <v-row gutter="16">
        <v-col>
          <v-text-field v-model="firstname.value.value" label="First Name" :error-messages="firstname.errorMessage.value" />
        </v-col>
        <v-col>
          <v-text-field v-model="lastname.value.value" label="Last name" :error-messages="lastname.errorMessage.value" />
        </v-col>
      </v-row>
      <v-text-field v-model="email.value.value" :error-messages="email.errorMessage.value" label="Email" type="email" />
      <v-row gutter="16">
        <v-col>
          <v-text-field v-model="password.value.value" label="Password" :error-messages="password.errorMessage.value" />
        </v-col>
        <v-col>
          <v-text-field
            v-model="passwordConfirmation.value.value"
            label="Confirm password"
            :error-messages="passwordConfirmation.errorMessage.value"
          />
        </v-col>
      </v-row>
      <v-btn type="submit" color="primary" :loading="buttonIsLoading" @click.prevent="submit">
        Submit
      </v-btn>
    </v-form>
  </div>
</template>

<script setup lang="ts">
import { Auth, createUserWithEmailAndPassword, sendEmailVerification, updateProfile } from 'firebase/auth'
definePageMeta({
  middleware: ['guest']
})
const auth = useFirebaseAuth()
// import { Icon } from '../helpers/interface'
const { errorMess, alert, isError, successMess, resetAll } = useShowUserFeedBack()
resetAll()
const buttonIsLoading = ref(false)

const { handleSubmit } = useForm({
  validationSchema: {
    firstname (value: string) {
      if (value?.length >= 2) { return true }

      return 'Name needs to be at least 2 characters.'
    },
    lastname (value: string) {
      if (value?.length >= 2) { return true }

      return 'Name needs to be at least 2 characters.'
    },
    email (value: string) {
      if (/^[a-z0-9.-]+@[a-z0-9.-]+\.[a-z]+$/i.test(value)) { return true }

      return 'Must be a valid e-mail.'
    },
    password (value: string) {
      if (value?.length <= 4) { return 'Password must be atleast 5 characters long' }
      return true
    },
    passwordConfirmation (value: string) {
      if (password.value.value === value) {
        return true
      }
      return 'Passwords do not match'
    }
  }
})
const firstname = useField('firstname')
const lastname = useField('lastname')
const email = useField('email')
const password = useField('password')
const passwordConfirmation = useField('passwordConfirmation')

const submit = handleSubmit(async (values) => {
  resetAll()
  buttonIsLoading.value = true
  errorMess.value = ''
  try {
    const { user } = await createUserWithEmailAndPassword(
      auth as Auth,
      values.email,
      values.password,

    )
    await updateProfile(user, {
      displayName: `${values.firstname} ${values.lastname}`
    })
    const actionCodeSettings = {
        url: `http://localhost:3000/login/?email=${user.email}`,
        handleCodeInApp: true,
      }
    await sendEmailVerification(user, actionCodeSettings)
    successMess.value = `Email sent to ${email.value.value} .Please verify in order to see personalized data`
    alert.value = true
    buttonIsLoading.value = false
  } catch (error:any) {
    buttonIsLoading.value = false
    isError.value = true
    // console.log(error.code)
    errorMess.value = error.code
    alert.value = true
  }
})

</script>
