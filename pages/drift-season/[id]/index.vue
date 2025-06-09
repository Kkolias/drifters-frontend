<template>
  <div class="page-drift-event full-height-page">
    <DriftSeasonDesktopSeasonPage v-if="!isMobile" :seasonSlug="seasonSlug" />
    <!-- <DriftSeasonPage v-if="!isMobile" :seasonSlug="seasonSlug" /> -->
    <DriftSeasonMobileDriftSeasonPageMobile v-else :seasonSlug="seasonSlug" />
  </div>
</template>


<script lang="ts" setup>
// Reactive state
const isMobile = ref(false);

// Access route params
const route = useRoute();
const seasonSlug = computed(() => (route.params.id as string) || "");

function SeasonSlugAsText() {
  // replace - with spaces and capitalize first letter of each word
  return seasonSlug.value
    .replace(/-/g, " ")
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

// Function to check if screen is mobile-sized
function checkMobile() {
  isMobile.value = window.innerWidth <= 768;
}

// Lifecycle hooks
onMounted(() => {
  checkMobile();
  window.addEventListener("resize", checkMobile);
});

onBeforeUnmount(() => {
  window.removeEventListener("resize", checkMobile);
});

const seasonName = SeasonSlugAsText();

const defaultTitle = ref(
  `${seasonName} - tulokset ja kisakalenteri | DriftDataan`
);
const defaultTitleEn = ref(
  `${seasonName} - Results and Schedule | DriftDataan`
);

const defaultDescriptionFi = ref(
  `Katso ${seasonName} - -sarjan kisatulokset, pistetilanne ja kauden aikataulu. Kaikki tiedot yhdellä sivulla DriftDataan -sivustolla.`
);
const defaultDescriptionEn = ref(
  `Explore ${seasonName} results, standings and event schedule. All data in one place – updated live on DriftDataan.`
);

const isEnglish = computed(() => {
  const hasEnPrefix = route.path.includes("/en/");
  return hasEnPrefix
});

const title = computed(() => {
  return isEnglish.value ? defaultTitleEn.value : defaultTitle.value;
});
const description = computed(() => {
  return isEnglish.value ? defaultDescriptionEn.value : defaultDescriptionFi.value;
});

useHead({
  title: title.value,
  meta: [
    { name: "description", content: description.value },
    { property: "og:title", content: title.value },
    { property: "og:description", content: description.value },
    { property: "og:type", content: "website" },
  ],
})
</script>
