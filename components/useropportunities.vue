<template>
    <div>
        <v-row justify="center">
            <v-col class="text-center">
                <h1 class="text-h6">{{ title }}</h1>
                <p v-if="cdfbanner">If CDF is selected, CDF results will be explicitly for your ward ({{ home }})</p>
            </v-col>
        </v-row>
        <v-row v-if="opportunities!.length > 0">
            <TransitionGroup name="list">
                <v-col v-for="(opportunity, index) in opportunities" :key="opportunity.id" cols="auto">
                    <v-card class="mx-auto my-8" max-width="344" min-width="300" elevation="16" min-height="250">
                        <v-card-item>
                            <v-card-title>
                                {{ opportunity.title }}
                            </v-card-title>
                            <v-card-subtitle>
                                {{ opportunity.provider }}
                            </v-card-subtitle>
                        </v-card-item>

                        <v-card-text v-if="!checkStringLength(opportunity.desc)">
                            {{ plaintext(opportunity.desc) }}
                        </v-card-text>
                        <v-card-text v-else>
                            {{ sliceString(plaintext(opportunity.desc)) }}... <NuxtLink
                                :to="`${name?.toString()}/${opportunity.id}`" class="text-primary">Read more
                            </NuxtLink>
                        </v-card-text>
                        <v-card-actions>
                            <v-btn color="orange" :to="`${name?.toString()}/${opportunity.id}`">
                                View
                            </v-btn>


                        </v-card-actions>
                    </v-card>

                </v-col>
            </TransitionGroup>
        </v-row>
        <v-row justify="center" align="center" v-else>
            <p class="text-h5">Nothing found</p>
        </v-row>
    </div>
</template>
  
<script setup lang="ts">
import { Iopportunity } from '~/helpers/interface';
const { name } = useRoute()

import { sliceString, checkStringLength, plaintext } from "~/helpers/textutils";
const variants = ['elevated', 'flat', 'tonal', 'outlined']
// "text" | "flat" | "elevated" | "tonal" | "outlined" | "plain"> | undefined'
const props = defineProps({
    title: {
        type: String,
        required: true
    },

    opportunities: {
        type: Array as PropType<Iopportunity[]>
    },
    cdfbanner: {
        type: Boolean
    },
    home: {
        type: String
    }
})






</script>
  
  
  
<style>
.list-move,
.list-enter-active,
.list-leave-active {
    transition: 0.3s ease;
}

.list-enter-from,
.list-leave-to {
    opacity: 0;
    transform: translateY(10px);
}
</style>
  