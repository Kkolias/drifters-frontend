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
  
  const defaultTitle = ref(
    "Drift SM - Finland's Best Drifting | Drift SM Pro and Pro2"
  );
  const defaultDescription = ref(
    "DriftDataan - Explore the Drift SM series, Finland's most prestigious drifting championship. Learn more about the SM Pro and SM Pro2 classes, events, and competition calendar. Follow Finland’s top drifting drivers in the 2024 season."
  );
  
  const route = useRoute();
  const eventSlug = computed(() => {
    return (route?.params?.eventId as string) || "";
  });
  
  const seasonSlug = computed(() => {
    return (route?.params?.id as string) || "";
  });
  
  const isDriftSm = computed((): boolean => {
    // if seasonSlug has "drift-sm" in it
    return seasonSlug?.value?.includes("drift-sm");
  });
  const isDmec = computed((): boolean => {
    // if seasonSlug has "dmec" in it
    return seasonSlug?.value?.includes("drift-masters-european-championship");
  });
  
  const title = computed(() => {
    if (isDriftSm?.value) {
      return "Drift SM Pro - Qualifying and bracket results | DriftDataan";
    } else if (isDmec?.value) {
      return "Drift Masters - Qualifying and bracket result | DriftDataan";
    }
    return "DriftDataan - Drift results and statistics";
  });
  
  const description = computed(() => {
    if (isDriftSm?.value) {
      return "DriftDataan - Follow the Drift SM Pro series competitions and results. Learn more about Drift SM Pro series races, results, and statistics. Track Finland’s top drifting drivers in the 2024 season.";
    } else if (isDmec?.value) {
      return "DriftDataan - Follow the Drift Masters series competitions and results. Learn more about Drift Masters series races, results, and statistics. Track Europe’s top drifting drivers in the 2024 season.";
    }
    return "DriftDataan - Drift results and statistics";
  });
  // This will be reactive when you change title/description above
  useHead({
    title: title?.value || defaultTitle,
    meta: [
      {
        name: "description",
        content: description?.value || defaultDescription,
      },
    ],
  });
  </script>
  