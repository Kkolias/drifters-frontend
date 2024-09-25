<template>
  <div class="page-drift-event full-height-page">
    <DriftSeasonPage v-if="!isMobile" :seasonSlug="seasonSlug" />
    <DriftSeasonMobileDriftSeasonPageMobile v-else :seasonSlug="seasonSlug" />
  </div>
</template>

<script lang="ts">
export default {
  data: () => ({
    isMobile: false,
  }),
  computed: {
    seasonSlug(): string {
      return (this.$route?.params?.id as string) || "";
    },
  },
  mounted() {
    this.checkMobile();
    window.addEventListener("resize", this.checkMobile);
  },
  beforeDestroy() {
    window.removeEventListener("resize", this.checkMobile);
  },
  methods: {
    checkMobile() {
      if (window.innerWidth <= 768) {
        this.isMobile = true;
      } else {
        this.isMobile = false;
      }
    },
  },
};
</script>
