<script lang="ts" setup>
import { Auth, signOut } from 'firebase/auth'
import { useThemeCustomizer } from '~/stores/ThemeCustomizer'
const auth = useFirebaseAuth() as Auth
const store = useThemeCustomizer()
const user = useCurrentUser()
async function logOut () {
  try {
    await signOut(auth)
  } catch (error) {
    console.log(error)
  }
}
</script>

<template>
  <VNavigationDrawer v-model="store.isExpand">
    <v-list v-if="!user" density="compact" nav>
      <v-list-item
        prepend-icon="mdi-login-variant"
        title="Login"
        to="/login"
      />
      <v-list-item prepend-icon="mdi-account-plus-outline" title="Register" to="/register" />
    </v-list>
    <v-list v-else density="compact" nav>
      <v-list>
        <v-list-item

          :title="user.displayName!"
          :subtitle="user.email!"
        />
      </v-list>
      <v-list-item
        prepend-icon="mdi-login-variant"
        title="Sign out"
        @click="logOut"
      />
      <v-list-item prepend-icon="mdi-account-plus-outline" title="Dashboard" to="/dashboard" />
    </v-list>
  </VNavigationDrawer>
</template>
