<template>
  <v-container>
    <pdf v-if="getPdf()" :url="getPdf()!" />
    <h4 v-else class="text-h5">
      Nothing to view
    </h4>
  </v-container>
</template>

<script setup lang="ts">
const { getPdf } = usePdf()

</script>
