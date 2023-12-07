<template>
  <!-- <div>
      {{  }}
    </div> -->
  <v-container v-if="!pending">
    <!-- <pdf :url="opportunity.pdf"></pdf> -->

    <v-row justify="center" align="center">

      <v-col cols="12" sm="8" md="6">
        <h4 class="text-h4  underline mb-5">{{ opportunity.title }}</h4>
        <p class="text-h5 mb-5">{{ opportunity.provider }}</p>
        <p class="text-h5 mb-5">{{ opportunity.providername }}</p>
        <p class="text-h5 mb-5">{{ opportunity.constituency }}</p>
        <p class="text-h5 mb-5">{{ opportunity.ward }}</p>
        <!-- {{ opportunity.pdf }} -->

        <v-col>
          <article v-html="opportunity.desc"></article>
        </v-col>






        <!-- <p>All schorlaships from {{ route.params.id }}</p>
          <h3 class="text-h3">Main Details</h3>
          <v-row>
            <h3 class="text-h3">Main Details</h3>
          </v-row> -->
      </v-col>
      <v-col v-if="opportunity.pdf">
        <v-btn size="x-large" :to="`/schorlaships/${opportunity.id}/pdf/${replaceString(opportunity.pdfPath!)}`" @click="setPdf(opportunity.pdf)">View
          Attached File</v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>
  
<script setup lang="ts">
import { collection, doc } from 'firebase/firestore'
import { Iopportunity } from "~/helpers/interface";
const route = useRoute();
const { setPdf } = usePdf()
const db = useFirestore()
const { data, pending } = useDocument(doc(collection(db, 'schorlaships'), `${route.params.id}`))
const opportunity = data as unknown as Iopportunity

function replaceString(data: string) {
  return data.replace(/pdfs\//g, "")
}

</script>
  