<template>
  <div>
    <v-progress-circular
      v-if="upProgress"
      :rotate="360"
      :size="80"
      :width="15"
      :model-value="upProgress * 100"
      color="teal"
    >
      {{ Math.floor(upProgress * 100) }}
    </v-progress-circular>
    <v-file-input
      show-size
      :label="label"
      prepend-icon="mdi-file-pdf-box"
      accept=".pdf"
      @change="handleFileSelect"
    />
  </div>
</template>

<script setup lang="ts">
defineProps<{
    label: string
    upProgress?: number | null
}>()
// eslint-disable-next-line func-call-spacing
const emit = defineEmits <{
(e: 'pdfSelected', file: any): void
}>()
// const emit = defineEmits(['pdfSelected'])

function handleFileSelect (file: any) {
    if (!file) { return }
    // eslint-disable-next-line no-console
    console.log(file.target.files[0])
    emit('pdfSelected', file.target.files[0])
}
</script>
