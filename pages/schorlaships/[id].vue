<template>
  <div><p>All schorlaships from {{ route.params.id }}</p></div>
</template>

<script setup lang="ts">
const route = useRoute()

console.log(route.params)
console.log(route.query)

</script>
