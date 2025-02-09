<template>
  <div class="page-drift-masters">
    <DriftMastersLanderPage />
  </div>
</template>

<script lang="ts" setup>
import translations from "~/lang/home.lang";

const textContent = computed(() => translations.en);

const title = "Drift Masters - Global Drifting Championship Results & Schedule";

const description = `Stay up to date with Drift Masters, the premier global drifting championship. Get the latest results, season standings, event schedule, and how to watch live. Explore past seasons and upcoming competitions now!`;

// This will be reactive when you change title/description above
useHead({
  title: title,
  meta: [
    {
      name: "description",
      content: description,
    },
  ],
});
</script>
