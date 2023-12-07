<script lang="ts" setup>
import { useTheme } from 'vuetify'
import { useThemeCustomizer } from '~/stores/ThemeCustomizer'

const theme = useTheme()
const store = useThemeCustomizer()

const setTheme = () => {
  theme.global.name.value = theme.current.value.dark ? 'light' : 'dark'
}
// computed property for dark mode

// toggle mode action
</script>

<template>
  <VAppBar>
    <VAppBarTitle>Student portal</VAppBarTitle>

    <!-- <VBtn variant="text" icon="mdi-cloud-upload" @click="setTheme">
      <Icon name="tabler-sun-moon" color="primary" />
    </VBtn> -->
    <v-btn
      class="ma-2"
      color="indigo"
      icon="mdi-theme-light-dark"
      @click="setTheme"
    />
    <v-btn
      class="ma-2"
      color="indigo"
      icon="mdi-menu"
      @click.stop="store.setDrawer"
    />
    <!-- <VBtn variant="text" @click.stop="store.setDrawer">
      <Icon name="tabler-menu-2" />
    </VBtn> -->
  </VAppBar>
</template>
