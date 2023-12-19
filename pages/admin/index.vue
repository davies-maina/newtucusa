<template>
  <div>
    <!-- <v-btn @click="addCustomClaim">
      Click me
    </v-btn> -->
    <v-dialog v-model="dialog" fullscreen :scrim="false" transition="dialog-bottom-transition">
      <template #activator="{ props }">
        <v-btn color="indigo-darken-3" class="mb-2" v-bind="props" @click="resetF">
          Add opportunity
        </v-btn>
      </template>

      <v-card>
        <v-toolbar dark color="primary">
          <v-btn icon dark @click="dialog = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
          <v-toolbar-title v-if="isEdit">
            Edit opportunity
          </v-toolbar-title>

          <v-toolbar-title v-else>
            Add opportunity
          </v-toolbar-title>
          <v-spacer />
          <v-toolbar-items>
            <v-btn variant="text" :loading="isLoading" @click="saveOpportunity">
              Save
            </v-btn>
          </v-toolbar-items>
        </v-toolbar>
        <v-container>
          <v-row justify="center" align="center" style="height: 100vh;">
            <v-col cols="12" sm="8" md="6">
              <!-- Your form goes here -->
              <v-form>
                <v-text-field v-model="opportunity.title" label="Title" />
                <label for="Description">Description</label>
                <ClientOnly>
                  <QuillEditor v-model:content="opportunity.desc" theme="snow" content-type="html" class="mb-2" />
                </ClientOnly>
                <v-select
                  v-model="opportunity.opportunity"
                  label="Opportunity type"
                  :items="['schorlaships', 'internships', 'jobs']"
                />
                <v-select
                  v-model="opportunity.provider"
                  label="Opportunity provider"
                  :items="['Turkana county Govt', 'National govt', 'NGO', 'CBO', 'CDF']"
                />
                <label for="providername">Provider name/Department</label>

                <v-text-field v-model="opportunity.providername" label="Opportunity provider name" />
                <div>
                  <label for="constituency">Constituency(optional)</label>

                  <v-select
                    v-model="opportunity.constituency"
                    :items="getAllCons"
                    label="Select constituency"
                    @update:model-value="handleSelectedCon"
                  />
                </div>
                <div v-if="showWard">
                  <label for="ward">Ward(optional)</label>

                  <v-select v-model="opportunity.ward" :items="wards" label="Select ward" />
                </div>
                <label for="ward">Attach PDF(optional)</label>
                <Fileupload :label="'Attach PDF'" :up-progress="uploadProgress" @pdf-selected="handleFile" />
              </v-form>
            </v-col>
          </v-row>
        </v-container>
      </v-card>
    </v-dialog>
    <v-container>
      <div v-if="getSchorlaships.length > 0 || getJobs.length > 0 || getInternships.length > 0">
        <!-- <v-row justify="center" align="center" style="height: 30vh;"> -->
        <Cardopportunities
          :title="'Schorlaships/Bursaries'"
          :opportunities="getSchorlaships"
          @show-edit-modal="activateEditState"
          @delete-doc-id="deleteDoc"
        />
        <Cardopportunities
          :title="'Jobs'"
          :opportunities="getJobs"
          @show-edit-modal="activateEditState"
          @delete-doc-id="deleteDoc"
        />
        <Cardopportunities
          :title="'Internships'"
          :opportunities="getInternships"
          @show-edit-modal="activateEditState"
          @delete-doc-id="deleteDoc"
        />
      </div>
      <p v-else class="text-h5">
        Nothing to show. Add opportunities to see things here
      </p>
    </v-container>
  </div>
</template>

<script setup lang="ts">
import { QuillEditor } from '@vueup/vue-quill'
import '@vueup/vue-quill/dist/vue-quill.snow.css'
import { collection, query, getDocs, Timestamp } from 'firebase/firestore'
import { ref as storageRef, deleteObject, getDownloadURL } from 'firebase/storage'

import { useFirebaseStorage, useStorageFile } from 'vuefire'

import type { Iopportunity } from '~/helpers/interface'
const db = useFirestore()
const storage = useFirebaseStorage()

const isFile = ref(false)
const uploadedFile = ref(null)
const { getAllCons, getWards } = getConstituencies()
// const { finalCounties } = getCounties()
const { addDocument, setUserDocument, deleteDocument, updateDocument } = firestoreFuncs()

const wards = ref<string[]>([])
const showWard = ref(false)
const dialog = ref(false)
const isLoading = ref(false)
const isEdit = ref(false)
const addedOpportunities = ref<Iopportunity[]>([])
const currentEditingIndex = ref()
const opportunity = reactive<Iopportunity>({
  title: '',
  desc: '',
  provider: '',
  providername: '',
  ward: '',
  constituency: '',
  opportunity: '',
  archive: false,
  createdAt: undefined,
  pdf: null,
  pdfPath: null,

})
const time = Date.now().toString()
const fileRef = storageRef(storage, `pdfs/${time}`)
const emptyOpp:Iopportunity = {
  title: '',
    desc: '',
    provider: '',
    providername: '',
    ward: '',
    constituency: '',
    opportunity: '',
    archive: false,
    createdAt: undefined,
    pdf: null,
    pdfPath: null,

}

const resetF = () => {
  Object.assign(opportunity, emptyOpp)
}
// console.log(fileRef.)

const {

  // gives you a percentage between 0 and 1 of the upload progress
  uploadProgress,

  // firebase upload task

  upload,
} = useStorageFile(fileRef)

definePageMeta({
  middleware: ['role']
})
onMounted(() => {
  getAllOpportunities()
})
function handleFile (payload: any) {
  isFile.value = true
  uploadedFile.value = payload
}

const deleteDoc = async (collectionname: string, id: string, pdfPath: string | null) => {
  const res = await deleteDocument(collectionname, id)
  if (res) {
    if (pdfPath) {
      const pdfRef = storageRef(storage, pdfPath)
      deleteObject(pdfRef).then(() => {
        // eslint-disable-next-line no-console
        console.log('File deleted successfully')
      }).catch((error) => {
        // Uh-oh, an error occurred!
        // eslint-disable-next-line no-console
        console.log(error)
      })
    }
    addedOpportunities.value.forEach((opportunity, index) => {
      if (opportunity.id === id) {
        addedOpportunities.value.splice(index, 1)
      }
    })
  }
}
async function saveOpportunity () {
  isLoading.value = true
  opportunity.createdAt = new Date()
  const newOpportunity = {
    ...opportunity,
...{
      createdAt: Timestamp.fromDate(opportunity.createdAt)
    }
  }
  Object.assign(opportunity, newOpportunity)
  // console.log(newOpportunity);
  if (isEdit.value) {
    await setUserDocument(opportunity.opportunity, opportunity.id!, opportunity)
    Object.assign(addedOpportunities.value[currentEditingIndex.value], opportunity)
    isLoading.value = false
    dialog.value = false
  } else {
    const docRef = await addDocument(opportunity.opportunity, opportunity)
    // let data=await setUserDocument(`${opportunity.opportunity}`,opportunity)
    if (docRef) {
      const appendId = {
        ...opportunity,
...{
          id: docRef
        }
      }

      Object.assign(opportunity, appendId)
      // const fileRef = storageRef(storage, `pdfs/${opportunity.id}`)

      // console.log(opportunity)
      // console.log(`pdfs/${opportunity.id}`)

      if (isFile.value) {
        // fileRef.fullPath = `pdfs/${opportunity.id}`
        await upload(uploadedFile.value!)?.then(async () => {
          await getDownloadURL(fileRef).then(async (url) => {
            await updateDocument(opportunity.opportunity, opportunity.id!, {
              pdf: url,
              pdfPath: fileRef.fullPath
            })
            opportunity.pdf = url
            opportunity.pdfPath = fileRef.fullPath
          })
        })
      }

      addedOpportunities.value.unshift(opportunity)

      isLoading.value = false
      dialog.value = false
      // opportunity.title = '',
      //   opportunity.desc = '',
      //   opportunity.provider = '',
      //   opportunity.providername = '',
      //   opportunity.ward = '',
      //   opportunity.constituency = '',
      //   opportunity.opportunity = '',
      //   opportunity.archive = false,
      //   opportunity.createdAt = undefined
    } else {
      isLoading.value = false
      dialog.value = false
    }
  }
}
const getAllOpportunities = async () => {
  const query1 = query(collection(db, 'schorlaships'))
  const query2 = query(collection(db, 'internships'))
  const query3 = query(collection(db, 'jobs'))

  try {
    const [snapshot1, snapshot2, snapshot3] = await Promise.all([
      getDocs(query1),
      getDocs(query2),
      getDocs(query3)
    ])

    snapshot1.forEach((doc) => {
      const opportunity = doc.data() as Iopportunity
      opportunity.id = doc.id // Adding the document ID as the id property
      addedOpportunities.value.push(opportunity)
    })
    snapshot2.forEach((doc) => {
      const opportunity = doc.data() as Iopportunity
      opportunity.id = doc.id // Adding the document ID as the id property
      addedOpportunities.value.push(opportunity)
    })
    snapshot3.forEach((doc) => {
      const opportunity = doc.data() as Iopportunity
      opportunity.id = doc.id // Adding the document ID as the id property
      addedOpportunities.value.push(opportunity)
    })
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Error fetching data:', error)
  }
}
function handleSelectedCon ($event: any) {
  wards.value = getWards($event)!
  showWard.value = true
}
function activateEditState (payload: Iopportunity, index: number) {
  isEdit.value = true
  dialog.value = true
  Object.assign(opportunity, payload)
  currentEditingIndex.value = index
}
const getSchorlaships = computed(() => {
  if (addedOpportunities.value.length > 0) {
    return addedOpportunities.value.filter(opportunity => opportunity.opportunity === 'schorlaships')
  }
  return []
})
const getInternships = computed(() => {
  if (addedOpportunities.value.length > 0) {
    return addedOpportunities.value.filter(opportunity => opportunity.opportunity === 'internships')
  }
  return []
})
const getJobs = computed(() => {
  if (addedOpportunities.value.length > 0) {
    return addedOpportunities.value.filter(opportunity => opportunity.opportunity === 'jobs')
  }
  return []
})
// async function addCustomClaim () {
//   const { data } = await useFetch('/api/add-custom-claim')
//   console.log(data)
// }
</script>
