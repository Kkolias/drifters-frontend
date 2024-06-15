<template>
  <div class="page-drift-sm-esittely">
    <DriftSmProHeroSection />
    <DriftSmSeasonsSection />
    <DriftSmProTwoHeroSection />
    <DriftSmBottomSection />
  </div>
</template>

<script setup lang="ts">
const title = ref("Drift SM - Suomen Parasta Driftingiä | Drift SM Pro ja Pro2");
const description = ref("DriftDataan - Tutustu Drift SM -sarjaan, Suomen arvostetuimpaan drifting-sarjaan. Lue lisää SM Pro- ja SM Pro2-luokista, tapahtumista ja kilpailukalenterista. Seuraa Suomen parhaita drifting-kuljettajia kaudella 2024.");

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
