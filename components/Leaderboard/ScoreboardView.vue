<template>
  <div class="component-ScoreboardView">
    <LoadingIndicator v-if="loading" />
    <table v-else class="scoreboard-table">
      <thead>
        <tr>
          <th>Sija</th>
          <th>Kuljettaja</th>
          <th>Pisteet</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(result, index) in sortedScoreboard" :key="result._id">
          <td>{{ index + 1 }}.</td>
          <td>
            {{ getDriverName(result) }}
          </td>
          <td>
            {{ getPoints(result) }}
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script lang="ts">
import type { PropType } from "vue";
import type { IDriver } from "~/interfaces/driver.interface";
import type { ScoreboardItem } from "~/interfaces/leaderboard.interface";

export default {
  props: {
    scoreboard: {
      type: Array as PropType<ScoreboardItem[]>,
      required: true,
    },
    allDriversList: {
      type: Array as PropType<IDriver[]>,
      required: true,
    },
    loading: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    sortedScoreboard(): ScoreboardItem[] {
      return this.scoreboard?.sort((a, b) => b.score - a.score) || [];
    },
  },
  methods: {
    getDriverName(scoreItem: ScoreboardItem): string {
      const driverId = scoreItem?.driver;
      const driver = this.allDriversList.find((d) => d?._id === driverId);
      return `${driver?.firstName} ${driver?.lastName}`;
    },
    getPoints(resultItem: ScoreboardItem): number {
      return resultItem.score;
    },
  },
};
</script>

<style lang="less" scoped>
.component-ScoreboardView {
}
</style>
