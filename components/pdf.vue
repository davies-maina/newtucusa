<template>
  <div>
    <Vue3PdfApp
      style="height: 100vh;"
      :pdf="url"
    />
  </div>
</template>

<script lang="ts" setup>
import Vue3PdfApp from 'vue3-pdf-app'
import 'vue3-pdf-app/dist/icons/main.css'
defineProps({

url: {
  type: String,
  required: true
},

})

</script>

<style></style>
