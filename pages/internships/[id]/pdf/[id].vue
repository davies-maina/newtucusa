<template>
    <v-container>
        <pdf :url="getPdf()!" v-if="getPdf()"></pdf>
        <h4 class="text-h5" v-else>Nothing to view </h4>
    </v-container>
</template>

<script setup lang="ts">
const { getPdf } = usePdf()

</script>