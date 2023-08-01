<template>
  <v-row>
    <v-col v-for="opportunity in opportunities" :key="opportunity.name" cols="12" sm="4" md="6">
      <v-card>
        <v-card-title>
          {{ opportunity.name }}
        </v-card-title>
        <v-card-text>
          {{ opportunity.desc }}
        </v-card-text><v-card-actions>
          <v-btn
            :to="opportunity.link"
            color="primary"
            primary
            class="m-3 mt-4"
            type="button"
          >
            Visit
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-col>
  </v-row>
</template>

<script setup lang="ts">
import opportunities from '~/helpers/opportunities'
</script>
