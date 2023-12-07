<template>
  <div>
    <Vue3PdfApp style="height: 100vh;"
      :pdf="url">
    </Vue3PdfApp>
    <!-- <vue-pdf-app style="height: 100vh;"
      pdf="https://firebasestorage.googleapis.com/v0/b/newtucusa.appspot.com/o/pdfs%2F1701851370778?alt=media&token=454de143-f354-415d-87b6-4fabd48da72b"></vue-pdf-app> -->

  </div>
</template>

<script lang="ts" setup>
const props = defineProps({

url: {
  type: String,
  required: true
},

})
import Vue3PdfApp from 'vue3-pdf-app';
import "vue3-pdf-app/dist/icons/main.css";
const pdfUrl = 'https://firebasestorage.googleapis.com/v0/b/newtucusa.appspot.com/o/pdfs%2F1701851370778?alt=media&token=454de143-f354-415d-87b6-4fabd48da72b'; // Replace with your PDF URL


</script>

<style></style>