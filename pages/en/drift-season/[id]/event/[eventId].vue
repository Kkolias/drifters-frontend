<template>
  <div class="page-drift-event full-height-page">
    <DriftSeasonEventDriftEventPage
      v-if="!isMobile"
      :seasonSlug="seasonSlug"
      :eventSlug="eventSlug"
    />
    <DriftSeasonMobileEventPage
      v-if="isMobile"
      :seasonSlug="seasonSlug"
      :eventSlug="eventSlug"
    />
  </div>
</template>

<script setup lang="ts">
const isMobile = ref(false);

function checkMobile() {
  if (window.innerWidth <= 768) {
    isMobile.value = true;
  } else {
    isMobile.value = false;
  }
}

// watch for window resize
onMounted(() => {
  checkMobile();
  window.addEventListener("resize", checkMobile);
});

onBeforeUnmount(() => {
  window.removeEventListener("resize", checkMobile);
});

const route = useRoute();
const eventSlug = computed(() => {
  return (route?.params?.eventId as string) || "";
});

const seasonSlug = computed(() => {
  return (route?.params?.id as string) || "";
});

function seasonSlugAsText() {
  // replace - with spaces and capitalize first letter of each word
  return seasonSlug.value
    .replace(/-/g, " ")
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function eventSlugAsText() {
  // replace - with spaces and capitalize first letter of each word
  return eventSlug.value
    .replace(/-/g, " ")
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

const titleFi = ref(
  `${seasonSlugAsText()} - ${eventSlugAsText()} | Tapahtuma, tulokset ja aikataulu`
);

const titleEn = ref(
  `${seasonSlugAsText()} - ${eventSlugAsText()} | Event, Results and Schedule`
);

const descriptionEn = ref(
  `Full results from ${seasonSlugAsText()} ${eventSlugAsText()}: qualifying scores, battle brackets, final standings, and updated championship points.`
);

const descriptionFi = ref(
  `Täydelliset tulokset ${seasonSlugAsText()} ${eventSlugAsText()} -tapahtumasta: karsintatulokset, taistelukaaviot, lopulliset tulokset ja päivitetyt mestaruuspisteet.`
);

const isEnglish = computed(() => {
  const hasEnPrefix = route.path.includes("/en/");
  return hasEnPrefix;
});

const title = computed(() => {
  return isEnglish.value ? titleEn.value : titleFi.value;
});

const description = computed(() => {
  return isEnglish.value ? descriptionEn.value : descriptionFi.value;
});

// This will be reactive when you change title/description above
useHead({
  title: title.value,
  meta: [
    { name: "description", content: description.value },
    { property: "og:title", content: title.value },
    { property: "og:description", content: description.value },
    { property: "og:type", content: "website" },
  ],
});
</script>
