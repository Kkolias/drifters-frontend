<template>
  <div class="component-DriftEventAdminView">
    <LoadingIndicator v-if="loading" />
    <div v-if="!loading">
      <DriftEventAdminViewQualifyingSection
        :qualifyingItem="driftEvent?.qualifying"
        :scoreboardDriverIdListWorstToBest="scoreboardDriverIdListWorstToBest"
        :eventId="id"
        @reload="fetchData"
      />
      <DriftEventAdminViewQualifyingShowdownSection
        :qualifyingShowdownItem="driftEvent?.qualifyingShowdown"
        :eventId="id"
        :allDriversList="allDriversList"
        @reload="fetchData"
      />
      <DriftEventAdminViewCompetitionDaySection
        :competitionDayItem="driftEvent?.competitionDay"
        :eventId="id"
        :allDriversList="allDriversList"
        @reload="fetchData"
      />
    </div>
  </div>
</template>

<script lang="ts">
import type { IDriftEvent } from "~/interfaces/drift-event.interface";
import service from "./AdminView.service";
import apiDrivers from "~/utils/drifting/api-drivers";
import type { IDriver } from "~/interfaces/driver.interface";
import apiDriftLeaderboard from "~/utils/drifting/api-drift-leaderboard";
import type { ILeaderboard, ScoreboardItem } from "~/interfaces/leaderboard.interface";

interface IData {
  loading: boolean;
  driftEvent: IDriftEvent | null;

  allDriversList: IDriver[];

  seasonLeaderboard: ILeaderboard | null;
}

export default {
  props: {
    id: { type: String, default: "" },
  },
  data: (): IData => ({
    loading: true,

    driftEvent: null,

    allDriversList: [],

    seasonLeaderboard: null
  }),
  computed: {
    seasonId(): string {
      return this.driftEvent?.seasonId || "";
    },
    sortedWorstToBestScoreboard(): ScoreboardItem[] {
      const scoreboard = this.seasonLeaderboard?.scoreboard || []; 
      return scoreboard.sort((a, b) => a?.score - b?.score);
    },
    scoreboardDriverIdListWorstToBest(): string[] {
      return this.sortedWorstToBestScoreboard.map((s) => (s?.driver as IDriver)?._id || '')?.filter(i => i);
    }
  },
  mounted() {
    this.fetchData();
    this.fetchDrivers();
  },
  watch: {
    seasonId() {
      this.fetchSeasonLeaderboard();
    }
  },
  methods: {
    async fetchDrivers(): Promise<void> {
      const drivers = await apiDrivers.getAllDrivers();
      this.allDriversList = drivers;
    },
    async fetchData() {
      this.loading = true;
      const data = await service.getDriftEventById(this.id);
      this.driftEvent = data;
      this.loading = false;
    },
    async fetchSeasonLeaderboard() {
      const leaderboard = await apiDriftLeaderboard.getLeaderboardBySeasonId(this.seasonId);
      this.seasonLeaderboard = leaderboard;
    }
  },
};
</script>

<style lang="less" scoped>
.component-DriftEventAdminView {
}
</style>
