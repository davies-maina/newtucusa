<template>
  <div v-if="opportunities!.length > 0">
    <v-row justify="center">
      <v-col class="text-center">
        <h1 class="text-h4">
          {{ title }}
        </h1>
      </v-col>
    </v-row>
    <v-row>
      <v-col v-for="(opportunity, index) in opportunities" :key="opportunity.id" cols="auto">
        <v-card class="mx-auto my-8" max-width="344" min-width="300" elevation="16" min-height="300">
          <v-card-item>
            <v-card-title>
              {{ opportunity.title ?? '' }}
            </v-card-title>
            <v-card-subtitle>
              {{ opportunity.provider ?? '' }}
            </v-card-subtitle>
          </v-card-item>

          <v-card-text v-if="!checkStringLength(opportunity.desc ?? '')">
            {{ plaintext(opportunity.desc ?? '') }}
          </v-card-text>
          <v-card-text v-else>
            {{ sliceString(plaintext(opportunity.desc ?? '')) }}... <NuxtLink to="" class="text-primary">
              Read more
            </NuxtLink>
          </v-card-text>
          <v-card-actions>
            <v-btn color="orange">
              Archive
            </v-btn>

            <v-btn color="orange" @click="$emit('deleteDocId', opportunity.opportunity, opportunity.id!,opportunity.pdfPath)">
              Delete
            </v-btn>
            <v-btn color="orange" @click="$emit('showEditModal', opportunity, index)">
              Edit
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script setup lang="ts">
import type { Iopportunity } from '~/helpers/interface'

import { sliceString, checkStringLength, plaintext } from '~/helpers/textutils'
// const variants = ['elevated', 'flat', 'tonal', 'outlined']
// "text" | "flat" | "elevated" | "tonal" | "outlined" | "plain"> | undefined'
defineEmits(['deleteDocId', 'showEditModal'])
defineProps({

  title: {
    type: String,
    required: true
  },
  opportunities: {
    type: Array as PropType<Iopportunity[]>,
    required: true
  }
})

</script>

<style></style>
