<template>
  <div class="page-series">
    <DriftSeriesPage />
  </div>
</template>

<script setup lang="ts">
const title = ref("DriftDataan - Driftisarjat");
const description = ref("DriftDataan - Driftisarjat ja kaudet");

// This will be reactive when you change title/description above
useHead({
  title,
  meta: [
    {
      name: "description",
      content: description,
    },
  ],
});
</script>
