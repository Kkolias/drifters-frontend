<template>
  <div class="page-drift-event">
    <DriftSeasonEventDriftEventPage :seasonSlug="seasonSlug" :eventSlug="eventSlug" />
  </div>
</template>

<script lang="ts">
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
</script>
