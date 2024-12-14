<template>
  <div class="page-all-drivers">
    <DriversListPage />
    <DriversList />
  </div>
</template>

<script lang="ts" setup>
useHead({
  title: "DriftDataan - Drifting drivers and their statistics",
  meta: [
    {
      name: "description",
      content: "DriftDataan - Drifting drivers and their statistics",
    },
  ],
});
</script>
