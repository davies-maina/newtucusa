<script lang="ts" setup>
import { useThemeCustomizer } from '~/stores/ThemeCustomizer'

const store = useThemeCustomizer()
</script>

<template>
  <VNavigationDrawer v-model="store.isExpand">
    <v-list density="compact" nav>
      <v-list-item
        prepend-icon="mdi-login-variant"
        title="Login"
        to="/login"
      />
      <v-list-item prepend-icon="mdi-account-plus-outline" title="Register" to="/register" />
    </v-list>
  </VNavigationDrawer>
</template>
