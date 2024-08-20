<template>
  <div class="page-drift-event full-height-page">
    <DriftSeasonEventDriftEventPage
      :seasonSlug="seasonSlug"
      :eventSlug="eventSlug"
    />
  </div>
</template>

<!-- <script lang="ts">
export default {
  computed: {
    eventSlug(): string {
      return (this.$route?.params?.eventId as string) || "";
    },
    seasonSlug(): string {
      return (this.$route?.params?.id as string) || "";
    },
  },
};
</script> -->

<script setup lang="ts">
const defaultTitle = ref(
  "Drift SM - Suomen Parasta Driftingiä | Drift SM Pro ja Pro2"
);
const defaultDescription = ref(
  "DriftDataan - Tutustu Drift SM -sarjaan, Suomen arvostetuimpaan drifting-sarjaan. Lue lisää SM Pro- ja SM Pro2-luokista, tapahtumista ja kilpailukalenterista. Seuraa Suomen parhaita drifting-kuljettajia kaudella 2024."
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
    return "Drift SM Pro - Lajittelu- ja kaaviotulokset | DriftDataan";
  } else if (isDmec?.value) {
    return "Drift Masters - Lajittelu- ja kaaviotulokset | DriftDataan";
  }
  return "DriftDataan - Drifting tulokset ja tilastot";
});

const description = computed(() => {
  if (isDriftSm?.value) {
    return "DriftDataan - Seuraa Drift SM Pro -sarjan kilpailuja ja tuloksia. Lue lisää Drift SM Pro -sarjan kilpailuista, tuloksista ja tilastoista. Seuraa Suomen parhaita drifting-kuljettajia kaudella 2024.";
  } else if (isDmec?.value) {
    return "DriftDataan - Seuraa Drift Masters -sarjan kilpailuja ja tuloksia. Lue lisää Drift Masters -sarjan kilpailuista, tuloksista ja tilastoista. Seuraa Euroopan parhaita drifting-kuljettajia kaudella 2024.";
  }
  return "DriftDataan - Drifting tulokset ja tilastot";
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
