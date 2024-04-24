<template>
  <div class="page-drift-event">
    <DriftSeasonEventDriftEventPage :seasonId="seasonId" :eventId="eventId" />
  </div>
</template>

<script lang="ts">
export default {
  computed: {
    eventId(): string {
      return (this.$route?.params?.eventId as string) || "";
    },
    seasonId(): string {
      return (this.$route?.params?.id as string) || "";
    },
  },
};
</script>
