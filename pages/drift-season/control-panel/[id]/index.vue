<template>
  <div class="page-drift-season full-height-page">
    <ControlPanelDriftSeasonPage :seasonId="id" />
  </div>
</template>

<script lang="ts">
import authenticatedView from "../../../../mixins/authenticatedView.vue";
export default {
  mixins: [authenticatedView],
  computed: {
    id(): string {
      return (this.$route?.params?.id as string) || "";
    },
  },
};
</script>
