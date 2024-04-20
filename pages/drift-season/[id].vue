<template>
    <div class="page-drift-event">
      <DriftSeasonPage :seasonId="seasonId" />
    </div>
  </template>
  
  <script lang="ts">
  export default {
    computed: {
        seasonId(): string {
        return (this.$route?.params?.id as string) || "";
      },
    },
  };
  </script>
  