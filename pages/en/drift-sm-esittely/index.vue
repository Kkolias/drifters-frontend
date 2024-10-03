<template>
  <div class="page-drift-sm-preview">
    <DriftSmProHeroSection />
    <DriftSmSeasonsSection />
    <DriftSmProTwoHeroSection />
    <DriftSmBottomSection />
  </div>
</template>

<script setup lang="ts">
const title = ref("Drift SM - Finland's Best Drifting | Drift SM Pro and Pro2");
//   const description = ref("DriftDataan - Tutustu Drift SM -sarjaan, Suomen arvostetuimpaan drifting-sarjaan. Lue lisää SM Pro- ja SM Pro2-luokista, tapahtumista ja kilpailukalenterista. Seuraa Suomen parhaita drifting-kuljettajia kaudella 2024.");
const description = ref(
  "DriftDataan - Get to know the Drift SM series, Finland's most respected drifting series. Read more about the SM Pro and SM Pro2 classes, events and competition calendar. Follow Finland's best drifting drivers in the 2024 season."
);
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
