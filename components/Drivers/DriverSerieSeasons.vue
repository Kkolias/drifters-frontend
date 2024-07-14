<template>
  <div class="component-DriverSerieSeason">
    <h3>{{ serieName }}</h3>
    <ul>
      <!-- <li v-for="leaderboard in leaderboards" :key="leaderboard._id">
        <p>{{ leaderboard.seasonInfo.seasonName }}</p>
        <p>{{ leaderboard.seasonInfo.seasonYear }}</p>
        <p>{{ leaderboard.points }}</p>
      </li> -->
    </ul>
  </div>
</template>

<script lang="ts">
import type { ILeaderboardWithSeasonInfo } from "~/interfaces/drift-season.interface";
import type { IDriftSerieSeasonList } from "./DriverSeasonsSection.vue";

export default {
  props: {
    serieWithSeasonStats: {
      type: Object as PropType<IDriftSerieSeasonList>,
      required: true,
    },
  },
  computed: {
    serieName(): string {
      return this.serieWithSeasonStats?.serieName || "";
    },
    leaderboards(): ILeaderboardWithSeasonInfo[] {
      return this.serieWithSeasonStats?.leaderboards || [];
    },
  },
};
</script>

<style lang="less" scoped>
.component-DriverSerieSeason {
}
</style>
