<template>
    <div>
        <v-progress-circular :rotate="360" :size="80" :width="15" :model-value="upProgress * 100" color="teal"
            v-if="upProgress">
            {{ Math.floor(upProgress * 100) }}
        </v-progress-circular>
        <v-file-input show-size :label="label" prepend-icon="mdi-file-pdf-box" accept=".pdf"
            @change="handleFileSelect"></v-file-input>
    </div>
</template>

<script setup lang="ts">
defineProps<{
    label: string
    upProgress?: number | null
}>()
const progress = ref<number | null>(null)
// const props = defineProps({

//     label: {
//         type: String,
//         required: true
//     },
//     upProgress: {
//         type: Number,

//     }

// })

const emit = defineEmits<{

    (e: 'pdfSelected', file: any): void
}>()
// const emit = defineEmits(['pdfSelected'])

const value = ref(2)
function handleFileSelect(file: any) {
    if (!file) return;
    console.log(file.target.files[0])
    emit('pdfSelected', file.target.files[0])

}
</script>