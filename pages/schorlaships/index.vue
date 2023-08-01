<template>
  <v-row justify="center">
    <v-col cols="12" sm="8" md="10">
      <div>
        <!-- <p v-for="provider in providers" :key="provider.slug">
      {{ provider.name }}
    </p> -->
        <v-row>
          <v-col v-for="(provider,index) in providers" :key="slugify(provider.name)" cols="12" sm="4" md="6">
            <v-card>
              <v-card-title>
                {{ provider.name }}
              </v-card-title>
              <!-- <v-card-text>
          {{ opportunity.desc }}
        </v-card-text> -->
              <v-card-actions>
                <NuxtLink v-if="index<=3" :to="{path:`/schorlaships/${slugify(provider.name)}`}">
                  <v-btn

                    color="primary"
                    primary
                    class="m-3 mt-4"
                    type="button"
                  >
                    Visit
                  </v-btn>
                </NuxtLink>
                <NuxtLink v-else :to="{path:'/schorlaships/cdf'}">
                  <v-btn

                    color="primary"
                    primary
                    class="m-3 mt-4"
                    type="button"
                  >
                    Visit
                  </v-btn>
                </NuxtLink>
              </v-card-actions>
            </v-card>
          </v-col>
        </v-row>
      </div>
    </v-col>
  </v-row>
</template>
<script setup lang="ts">
import { slugify } from '~/helpers/slugify'
const providers = [
    {
        name: 'Turkana county Government',
        slug: 'tcg'
    },
    {
        name: 'National Government',
        slug: 'natgov'
    },
    {
        name: 'NGO\'S',
        slug: 'ngo'
    },
    {
        name: 'Local CBO\'s',
        slug: 'cbo'
    },
    {
        name: 'County Development Fund',
        slug: 'cdf',
    }
]
// import allProviders from '~/helpers/service_providers'
// const providers = ref(allProviders)
// onMounted(() => {
// providers.value.push({
//     name: 'County Development Fund',
//     slug: 'cdf',

// })
// })
</script>
