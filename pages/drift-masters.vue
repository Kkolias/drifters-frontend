<template>
  <div class="page-drift-masters">
    <DriftMastersLanderPage />
  </div>
</template>

<script lang="ts" setup>
import translations from "~/lang/home.lang";

const title =
  "Drift Masters - Global Drifting Championship Tulokset & Aikataulu";

const description = `Pysy ajan tasalla Drift Mastersista, maailman johtavasta drifting-mestaruussarjasta. Katso viimeisimmät tulokset, kausien pisteet, kilpailuaikataulu ja ohjeet liveseurantaan. Tutustu menneisiin kausiin ja tuleviin kilpailuihin nyt!`;
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
