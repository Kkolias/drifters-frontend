<template>
    <div class="page-series">
      <DriftSeriesPage />
    </div>
  </template>
  
  <script setup lang="ts">
  const title = ref("DriftDataan - Drift Series");
  const description = ref("DriftDataan - Drift series and seasons");
  
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
  