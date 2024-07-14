<template>
    <div class="page-drift-event full-height-page">
      <DriftSeasonPage :seasonSlug="seasonSlug" />
    </div>
  </template>
  
  <script lang="ts">
  export default {
    computed: {
        seasonSlug(): string {
        return (this.$route?.params?.id as string) || "";
      },
    },
  };
  </script>
  