<template>
  <div>This is dashboard</div>
</template>
<script setup lang="ts">
definePageMeta({
  middleware: ['auth']
})
const user = useCurrentUser()

console.log('user', user.value?.displayName)
</script>
