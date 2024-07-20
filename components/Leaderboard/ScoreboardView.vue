<template>
  <div class="component-ScoreboardView">
    <LoadingIndicator v-if="loading" />
    <div v-else-if="scoreboard.length">
      <p class="subtitle">
        {{ seasonName }} Kauden {{ seasonYear }} pistetaulukko.
      </p>
      <table class="scoreboard-table">
        <thead>
          <tr>
            <th>Sija</th>
            <th>Kuljettaja</th>
            <th>Pisteet</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(result, index) in sortedScoreboard" :key="result._id">
            <td>
              <NuxtLink :to="driverProfileLink(result)" class="button blank">
                <span> {{ index + 1 }}. </span>
              </NuxtLink>
            </td>
            <td>
              <NuxtLink :to="driverProfileLink(result)" class="button blank">
                <span>{{ getDriverName(result) }}</span>
              </NuxtLink>
            </td>
            <td>
              <NuxtLink :to="driverProfileLink(result)" class="button blank">
                <span>{{ getPoints(result) }}</span>
              </NuxtLink>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
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
    seasonYear: {
      type: String,
      required: true,
    },
    seasonName: {
      type: String,
      required: true,
    },
  },
  computed: {
    sortedScoreboard(): ScoreboardItem[] {
      return this.scoreboard?.sort((a, b) => b.score - a.score) || [];
    },
  },
  methods: {
    driverProfileLink(resultItem: ScoreboardItem): string {
      console.log(resultItem)
      const slug = this.getDriver(resultItem)?.slug || "";
      return `/drivers/${slug}`;
    },
    getDriver(resultItem: ScoreboardItem): IDriver {
      const driverId = resultItem?.driver;
      return this.allDriversList.find((d) => d?._id === driverId) as IDriver;
    },
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
