<template>
  <div class="page-qualifying">
    <QualifyingView :qualifyingId="qualifyingId" />
  </div>
</template>

<script lang="ts">
export default {
  computed: {
    qualifyingId(): string {
      return this.$route?.params?.id as string || "";
    },
  },
};
</script>
