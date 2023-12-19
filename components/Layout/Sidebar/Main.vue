<script lang="ts" setup>
import type { Auth } from 'firebase/auth'
import { signOut } from 'firebase/auth'
import { useThemeCustomizer } from '~/stores/ThemeCustomizer'
const auth = useFirebaseAuth() as Auth
const store = useThemeCustomizer()
const user = useCurrentUser()
const { isAdmin, getClaims, reset } = useCustomClaim()
await getClaims()
async function logOut () {
  try {
    await signOut(auth)
    reset()
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log(error)
  }
}
</script>

<template>
  <VNavigationDrawer v-model="store.isExpand">
    <v-list v-if="!user" density="compact" nav>
      <v-list-item prepend-icon="mdi-login-variant" title="Login" to="/login" />
      <v-list-item prepend-icon="mdi-account-plus-outline" title="Register" to="/register" />
    </v-list>

    <v-list v-else density="compact" nav>
      <v-list-item
        v-if="user.photoURL"
        :prepend-avatar="user.photoURL"
        :title="user.displayName!"
        :subtitle="user.email!"
      />
      <v-list v-else>
        <v-list-item :title="user.displayName!" :subtitle="user.email!" />
      </v-list>
      <v-list-item prepend-icon="mdi-login-variant" title="Sign out" @click="logOut" />
      <v-list-item prepend-icon="mdi-view-dashboard" title="Dashboard" to="/dashboard" />
      <v-list-item prepend-icon="mdi-account-edit" title="Profile" to="/profile" />

      <v-list-item v-if="isAdmin" prepend-icon="mdi-shield-crown-outline" title="Admin" to="/admin" />
      <v-list-item v-if="isAdmin" prepend-icon="mdi-account-school-outline" title="All students" to="/admin/students" />
    </v-list>
  </VNavigationDrawer>
</template>
