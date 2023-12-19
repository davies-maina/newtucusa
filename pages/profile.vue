<template>
  <div>
    {{ uploadError }}
    <v-card class="mx-auto" max-width="434" rounded="0">
      <div v-if="result.dataURL" class="preview">
        <img :src="result.dataURL">
      </div>
      <div v-if="currentUser.photoURL" class="preview">
        <img :src="currentUser.photoURL">
      </div>
      <!-- <v-avatar
        v-if="result.dataURL"
        color="grey"
        size="150"
        rounded="0"
      >
        <v-img cover :src="result.dataURL" />
      </v-avatar> -->
      <v-progress-linear
        v-if="uploadProgress && uploadProgress < 1"
        color="primary"
        :model-value="Math.floor(uploadProgress * 100)"
        height="25"
      >
        <strong class="text-white"> {{ Math.floor(uploadProgress * 100) }}</strong>
      </v-progress-linear>
      <v-btn color="primary" class="m-3" @click="triggerFileInput">
        {{ currentUser.photoURL ? 'Change Photo' : 'Upload photo' }}
      </v-btn>
      <input
        ref="fileInput"
        type="file"
        style="display: none;"
        accept="image/jpg, image/jpeg, image/png, image/gif"
        @change="selectFile"
      >

      <v-list-item :title="currentUser.email" :subtitle="currentUser.displayName" />
      <!-- <v-form>
        <v-container>
          <v-row dense>
            <v-col cols="12" md="6">
              <v-text-field
                v-model="name"

                color="blue-grey-lighten-2"
                label="Name"
              />
            </v-col>

            <v-col cols="12" md="6">
              <v-text-field
                v-model="title"

                color="blue-grey-lighten-2"
                label="Title"
              />
            </v-col>

            <v-col cols="12" />
          </v-row>
        </v-container>
      </v-form> -->
    </v-card>
    <v-row justify="center">
      <v-dialog v-model="isShowModal" persistent width="700">
        <v-card>
          <v-card-title class="text-h5">
            Crop and upload
          </v-card-title>
          <v-card-text>
            <ClientOnly>
              <VuePictureCropper
                :box-style="{
                  width: '100%',
                  height: '100%',
                  backgroundColor: '#f8f8f8',
                  margin: 'auto',
                }"
                :img="pic"
                :options="{
                  viewMode: 1,
                  dragMode: 'move',
                  aspectRatio: 1,
                  cropBoxResizable: false,
                }"
                :preset-mode="{
                  mode: 'round',
                  width: 100,
                  height: 100,
                }"
                @ready="ready"
              />
            </ClientOnly>
          </v-card-text>
          <v-card-actions>
            <v-spacer />
            <v-btn color="green-darken-1" variant="text" @click="isShowModal = false">
              Cancel
            </v-btn>
            <v-btn color="green-darken-1" variant="text" @click="getResult">
              Crop
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-row>
  </div>
</template>

<script lang="ts" setup>
import VuePictureCropper, { cropper } from 'vue-picture-cropper'
import { ref as storageRef, getDownloadURL, deleteObject } from 'firebase/storage'
import { useFirebaseStorage, useStorageFile, updateCurrentUserProfile } from 'vuefire'
const storage = useFirebaseStorage()
const currentUser = await getCurrentUser()
const { setUserDocument } = firestoreFuncs()

definePageMeta({
  middleware: ['auth']
})
interface Result {
  dataURL: string | null;
  blobURL: string;
}
const isShowModal = ref<boolean>(false)
const pic = ref<string>('')
const result = reactive<Result>({
  dataURL: null,
  blobURL: '',
})
const fileInput = ref<HTMLInputElement | null>(null)
const triggerFileInput = () => {
  fileInput.value?.click()
}

const fileRef = storageRef(storage, `profileimages/${createUniqueID()}`)
const {

  // gives you a percentage between 0 and 1 of the upload progress
  uploadProgress,
  uploadError,
  // firebase upload task

  upload,
} = useStorageFile(fileRef)
function createUniqueID () {
  const timestamp = Date.now().toString()
  const randomPortion = Math.random().toString(36).substring(2, 15)
  return timestamp + randomPortion
}

const selectFile = (e: Event) => {
  pic.value = ''
  result.dataURL = ''
  result.blobURL = ''
  const { files } = e.target as HTMLInputElement
  if (!files || !files.length) { return }
  // Convert to dataURL and pass to the cropper component
  const file = files![0]
  const reader = new FileReader()
  reader.readAsDataURL(file)
  reader.onload = () => {
    // Update the picture source of the `img` prop
    pic.value = String(reader.result)

    // Show the modal
    isShowModal.value = true

    // Clear selected files of input element
    if (!fileInput.value) { return }
    fileInput.value.value = ''
  }
}
function ready () {
  console.log('Cropper is ready.')
}
async function getResult () {
  if (!cropper) { return }
  const base64 = cropper.getDataURL()
  const blob: Blob | null = await cropper.getBlob()
  if (!blob) { return }

  const file = await cropper.getFile({
    // fileName: locales.fileName,
  })

  console.log({ base64, blob, file })
  result.dataURL = base64
  result.blobURL = URL.createObjectURL(blob)
  isShowModal.value = false
  if (file) {
    if (currentUser.photoURL) {
      const pdfRef = storageRef(storage, currentUser.photoURL)
      deleteObject(pdfRef).then(async () => {
        await setUserDocument('personal_details', currentUser.uid, {
              photoUrl: null
            })
        // eslint-disable-next-line no-console
        console.log('File deleted successfully')
        await upload(file)?.then(async () => {
          await getDownloadURL(fileRef).then(async (url) => {
            await updateCurrentUserProfile({
              photoURL: url
            })
            await setUserDocument('personal_details', currentUser.uid, {
              photoUrl: url
            })
          })
        })
      }).catch((error) => {
        // Uh-oh, an error occurred!
        // eslint-disable-next-line no-console
        console.log(error)
      })
    }
  }
}
</script>

<style></style>
