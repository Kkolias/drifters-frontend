<template>
    <div></div>
</template>

<script lang="ts" setup>

const props = defineProps<{
  schemaContent: any
}>();
// console.log("SchemaSetter props:", props);
console.log("SchemaSetter component loaded");
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "SportsEvent",
  name: "Drift Masters European Championship 2025",
  startDate: "2025-05-18",
  endDate: "2025-09-14",
  description:
    "Follow the Drift Masters 2025 European Championship series, with full results, standings and schedule updated live.",
  organizer: {
    "@type": "Organization",
    name: "DriftDataan",
    url: "https://driftdataan.fi",
  },
  ...props.schemaContent, // Spread the schema content passed as prop
};

useHead({
  script: [
    {
      type: "application/ld+json",
      innerHTML: JSON.stringify(jsonLd),
    },
  ],
});

// Tämä tarvitaan, koska innerHTML käytetään
useSeoMeta({
  script: [
    {
      innerHTML: "",
      type: "application/ld+json",
    },
  ],
});

</script>
