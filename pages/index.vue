<script lang="ts" setup>

    const user = await getCurrentUser()

</script>

<template>
  <div>
    {{ user ? `You are logged in as ${user.displayName}` :'Welcome to TUCUSA' }}
  </div>
</template>
