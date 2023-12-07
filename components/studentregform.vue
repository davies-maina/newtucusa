<script setup lang="ts">
// import { Form, Field, ErrorMessage } from 'vee-validate'
import * as yup from 'yup'
import { VueTelInput } from 'vue-tel-input'
// import { Cropper } from 'vue-advanced-cropper'
// import 'vue-advanced-cropper/dist/style.css'

import 'vue-tel-input/vue-tel-input.css'
defineProps({
  hidePrevBtn: {
    type: Boolean,
    required: true
  }
})
const user = await getCurrentUser()

const { getAllCons, getWards } = getConstituencies()
const { finalCounties } = getCounties()
const { setUserDocument } = firestoreFuncs()

const currentStep = ref(1)

const phonenumber = ref(null)
const phonenumberValid = ref(false)
const institutiontype = ref('')
const showUnivNameInput = ref(false)

const showPostalAndAddress = ref(false)
const showConstituencies = ref(false)
const wards = ref<string[]>([])
const showWard = ref(false)
const buttonIsLoading = ref(false)
onMounted(() => {
  currentStep.value = useState<number>('formstep').value
})

interface IData {
  name: string
}
const schools = ref<string[]>([])
const schemas = [
  yup.object({
    dob: yup.date()
      .required('Date of birth is required')
      .max(
        new Date(),
        'Date of birth cannot be in the future'
      ),
    gender: yup.string().required(),
    nationalid: yup.string().required().min(8),

    phonenumber: yup.string().test('field-test', 'Invalid Phone number', function (_value) {
      return phonenumberValid.value // field is valid if booleanVar is true, invalid if false
    }),

  }),
  yup.object({
    institutiontype: yup.string().required(),
    institutionname: yup.string().required(),
    schoolid: yup
      .string()
      .matches(/^[a-zA-Z0-9]*$/, 'Only alphanumeric characters are allowed')
      .required(),
    coursetaken: yup.string().required(),
    coursecategory: yup.string().required(),
    academicprogram: yup.string().required()

  }),
  yup.object({
    location: yup.string().required(),
    address: yup.string(),
    postalcode: yup
      .string()

      .matches(/^[a-zA-Z0-9][a-zA-Z0-9\s]*$/, 'Invalid postal code.'),
    constituency: yup.string().when('$showConstituencies', (showConstituencies, schema) => {
      return showConstituencies ? schema.required() : schema
    }),
    ward: yup.string().when('$showWard', (showWard, schema) => {
      return showWard ? schema.required() : schema
    })

  }),

]

const currentSchema = computed(() => {
  return schemas[currentStep.value - 1]
})
const title = computed(() => {
  switch (currentStep.value) {
    case 1:
      return 'Personal information'
    case 2:
      return 'School details'
    case 3:
      return 'Residential home details'
    default:
      return 'Complete sign up'
  }
})
const progressVal = computed(() => {
  return currentStep.value / 3 * 100
})

async function nextStep(values: any) {
  if (currentStep.value === 1) {
    buttonIsLoading.value = true

    const a = await setUserDocument('personal_details', user.uid, values, true)
    if (a) {
      const b = await setUserDocument('form_current_step', user.uid, {
        currentstep: currentStep.value + 1
      })
      if (b) {
        buttonIsLoading.value = false

        currentStep.value++
        return
      }
    }

    buttonIsLoading.value = false


  }
  if (currentStep.value === 2) {
    buttonIsLoading.value = true
    const vals = {
      institutiontype: values.institutiontype ?? '',
      academicprogram: values.academicprogram ?? '',
      schoolid: values.schoolid ?? '',
      coursetaken: values.coursetaken ?? '',
      coursecategory: values.coursecategory ?? '',
      institutionname: values.institutionname ?? '',
      institutioncounty: values.institutioncounty ?? ''
    }
    const c = await setUserDocument('school_details', user.uid, vals)
    if (c) {
      const d = await setUserDocument('form_current_step', user.uid, {
        currentstep: currentStep.value + 1
      })
      if (d) {
        buttonIsLoading.value = false
        currentStep.value++
        return
      }
    }
    buttonIsLoading.value = false

  }
  if (currentStep.value === 3) {
    buttonIsLoading.value = true
    const vals = {
      location: values.location ?? '',
      address: values.address ?? '',
      postalcode: values.postalcode ?? '',
      constituency: values.constituency ?? '',
      ward: values.ward ?? ''
    }

    const e = await setUserDocument('residential_home_details', user.uid, vals)
    if (e) {
      const f = await setUserDocument('form_current_step', user.uid, {
        currentstep: 0
      })
      if (f) {
        useState<number | null>('formstep').value = 0
      }
    }

  }
  // if (currentStep.value === 0) {
  //   currentStep.value = +1
  // }
}

function prevStep() {
  if (currentStep.value <= 1) {
    return
  }

  currentStep.value--
}
function validateI(val: any) {
  if (val?.valid !== undefined) {
    phonenumberValid.value = val?.valid
    // console.log('p', phonenumberValid.value)
  }

  // console.log(val?.valid)
  // console.log('p', phonenumberValid.value)
}
function handleUnivInput($event: any) {
  showUnivNameInput.value = true
  institutiontype.value = $event
}
const handleSearch = useDebounceFn(async ($event: any) => {
  // const school = await $fetch(`http://universities.hipolabs.com/search?name=${$event}&country=kenya`)
  // console.log('sc', school)
  if ($event.length >= 3) {
    const { data } = await useFetch<IData[]>('http://universities.hipolabs.com/search', {
      query: { name: $event, country: 'kenya' },
      // pick: ['name']
    })
    data.value?.forEach(e => schools.value.push(e.name))
  }

  // schools.value = data as unknown as [] || []
}, 1000, { maxWait: 5000 })

function handleLocation($event: any) {
  showPostalAndAddress.value = true
  if ($event === 'Turkana') {
    showConstituencies.value = true
  } else {
    showConstituencies.value = false
  }
}
function handleSelectedCon($event: any) {
  wards.value = getWards($event)!
  showWard.value = true
}

// const remoteSchoolName = await $fetch(`https://pokeapi.co/api/v2/pokemon/${currentId.value}`)
// currentPokemon.value = {
//   name: pokemon.name,
//   imageUrl: pokemon.sprites.front_default,
// }

// function handleChange () {

// }

</script>

<template>
  <div>
    <div class="text-h5 text-center">
      {{ title }}
    </div>

    <v-progress-linear :model-value="progressVal" class="my-4" />
    <Form v-slot="{ errors, validate }" :validation-schema="currentSchema" keep-values @submit="nextStep">
      <!-- {{ errors }}{{ currentStep }} -->
      <!-- dd{{ values }} -->
      <template v-if="currentStep === 1">
        <label for="Date of birth">Date of birth</label>
        <Field id="dob" name="dob" as="v-text-field" :error-messages="errors.dob" type="date" />
        <!-- <ErrorMessage name="name" /> -->

        <label for="gender">Gender</label>
        <Field id="gender" v-slot="{ field }" name="gender">
          <v-select v-bind="field" label="Select Gender" :items="['Male', 'Female',]" :error-messages="errors.gender" />
        </Field>
        <label for="nationalid">National id</label>
        <Field id="nationalid" name="nationalid" as="v-text-field" :error-messages="errors.nationalid" type="number" />

        <label for="phonenumber">Phone number</label>

        <Field id="phonenumber" v-slot="{ field }" type="text" name="phonenumber">
          <ClientOnly>
            <vue-tel-input v-bind="field" v-model="phonenumber" required="true" @validate="validateI" />
            <p>{{ errors.phonenumber }}</p>
          </ClientOnly>
        </Field>
        <!-- <ErrorMessage name="phonenumber" /> -->
      </template>

      <template v-if="currentStep === 2">
        <label for="insttype">Type of institution</label>
        <Field id="institutiontype" v-slot="{ field }" name="institutiontype">
          <v-select v-bind="field" label="select type of institution"
            :items="['University', 'College', 'Technical or vocational']" :error-messages="errors.institutiontype"
            :value="field.value" @update:model-value="handleUnivInput" />
        </Field>
        <div v-if="showUnivNameInput">
          <v-row gutter="16">
            <v-col>
              <label for="instname">{{ institutiontype }} name </label>
              <Field id="institutionname" v-slot="{ field }" autocomplete="off" name="institutionname">
                <v-combobox autocomplete="off" v-bind="field" :items="schools"
                  :hint="`If your ${institutiontype} name is not available on the dropdown please type it in full`"
                  :error-messages="errors.institutionname" keep-values @update:model-value="handleSearch" />
              </Field>
            </v-col>
            <v-col>
              <label for="instcounty">Institution county</label>
              <Field id="institutioncounty" v-slot="{ field }" name="institutioncounty">
                <v-combobox v-bind="field" :items="finalCounties" :error-messages="errors.institutioncounty" keep-values
                  hint="Type to see suggestions" />
              </Field>
            </v-col>
          </v-row>
        </div>
        <v-row gutter="16">
          <v-col>
            <label for="aprogram">Academic program</label>
            <Field id="academicprogram" v-slot="{ field }" name="academicprogram">
              <v-select v-bind="field" label="Select Academic program"
                :items="['Certificate', 'Diploma', 'Undergraduate', 'Post-graduate diploma', 'Masters', 'PhD']"
                :error-messages="errors.academicprogram" />
            </Field>
          </v-col>
          <v-col>
            <label for="schoolid">School ID</label>
            <Field id="schoolid" name="schoolid" as="v-text-field" :error-messages="errors.schoolid"
              hint="This will help us reduce election irreguralities and is completely safe with us" />
          </v-col>
        </v-row>
        <v-row gutter="16">
          <v-col>
            <label for="schoolid">Course taken</label>
            <Field id="coursetaken" name="coursetaken" as="v-text-field" :error-messages="errors.coursetaken" />
          </v-col>
          <v-col>
            <label for="schoolid">Course category</label>
            <Field id="coursecategory" name="coursecategory" as="v-text-field" :error-messages="errors.coursecategory" />
          </v-col>
        </v-row>
      </template>

      <template v-if="currentStep === 3">
        <label for="location">Select location</label>
        <Field id="location" v-slot="{ field }" name="location">
          <v-select v-bind="field" :items="['Turkana', 'Diaspora']" :error-messages="errors.location"
            @update:model-value="handleLocation" />
        </Field>
        <div v-if="showConstituencies">
          <label for="constituency">Constituency</label>
          <Field id="constituency" v-slot="{ field }" name="constituency">
            <v-select v-bind="field" :items="getAllCons" :error-messages="errors.constituency" label="Select constituency"
              @update:model-value="handleSelectedCon" />
          </Field>
        </div>
        <div v-if="showWard">
          <label for="ward" />
          <Field id="ward" v-slot="{ field }" name="ward">
            <v-select v-bind="field" :items="wards" :error-messages="errors.ward" label="Select ward" />
          </Field>
        </div>
        <div v-if="showPostalAndAddress">
          <label for="address">Address (optional)</label>
          <Field id="address" v-slot="{ field }" name="address">
            <v-textarea v-bind="field" :error-messages="errors.address" />
          </Field>
          <label for="postalcode">Postal code (optional)</label>
          <Field id="postalcode" v-slot="{ field }" name="postalcode">
            <v-text-field v-bind="field" :error-messages="errors.postalcode" />
          </Field>
        </div>
        <!-- <v-text-field
        v-model="postalCode"
        vee-validate="{ name: 'postal code', rules: 'required|postal_code' }"
        label="Postal Code"
        required
      ></v-text-field> -->
      </template>

      <!-- <v-btn v-if="currentStep !== 0" type="button" class="mt-4" @click="prevStep">
        Previous
      </v-btn>

      <v-btn v-if="currentStep !== 3" type="submit" class="mt-4">
        Next
      </v-btn> -->
      <v-btn v-if="currentStep !== 1" color="primary" primary class="m-3 mt-4" type="button" :disabled="hidePrevBtn"
        @click="prevStep">
        Previous
      </v-btn>

      <v-btn v-if="currentStep !== 3" color="primary" primary class="m-3 mt-4" type="submit" :loading="buttonIsLoading"
        @click="validate">
        Next
      </v-btn>
      <v-btn v-if="currentStep === 3" color="primary" primary type="submit" class="m-3 mt-4" :loading="buttonIsLoading"
        @click="validate">
        Finish
      </v-btn>

      <!-- <pre>{{ values }}</pre> -->
    </Form>
  </div>
</template>
