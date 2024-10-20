<template>
  <div class="component-ControlPanelDriftEventResultEdit">
    <DriftEventAdminViewQualifyingSection
      v-if="isViewSelected('qualifying')"
      :qualifyingItem="driftEvent?.qualifying"
      :scoreboardDriverIdListWorstToBest="scoreboardDriverIdListWorstToBest"
      :eventId="eventId"
      @reload="fetchData"
    />
    <DriftEventAdminViewQualifyingShowdownSection
      v-if="isViewSelected('qualifying-showdown')"
      :qualifyingShowdownItem="driftEvent?.qualifyingShowdown"
      :eventId="eventId"
      :allDriversList="allDriversList"
      @reload="fetchData"
    />
    <DriftEventAdminViewCompetitionDaySection
      v-if="isViewSelected('bracket')"
      :competitionDayItem="driftEvent?.competitionDay"
      :eventId="eventId"
      :allDriversList="allDriversList"
      @reload="fetchData"
    />
  </div>
</template>

<script lang="ts">
import type { IDriftEvent } from "~/interfaces/drift-event.interface";
import service from "../DriftEvent/AdminView.service";
import type {
  ILeaderboard,
  ScoreboardItem,
} from "~/interfaces/leaderboard.interface";
import apiDriftLeaderboard from "~/utils/drifting/api-drift-leaderboard";
import type { IDriver } from "~/interfaces/driver.interface";
import apiDrivers from "~/utils/drifting/api-drivers";

interface IData {
  loading: boolean;
  driftEvent: IDriftEvent | null;
  seasonLeaderboard: ILeaderboard | null;
  allDriversList: IDriver[];
}

export default {
  props: {
    eventId: { type: String, default: "" },
  },
  data: (): IData => ({
    loading: false,
    driftEvent: null,
    seasonLeaderboard: null,
    allDriversList: [],
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
      return this.sortedWorstToBestScoreboard
        .map((s) => (s?.driver as IDriver)?._id || "")
        ?.filter((i) => i);
    },
  },
  mounted() {
    this.fetchData();
    this.fetchDrivers();
  },
  watch: {
    seasonId() {
      this.fetchSeasonLeaderboard();
    },
  },
  methods: {
    isViewSelected(query: string): boolean {
      return this.$route?.query?.["event-view"] === query;
    },
    async fetchDrivers(): Promise<void> {
      const drivers = await apiDrivers.getAllDrivers();
      this.allDriversList = drivers;
    },
    async fetchData() {
      this.loading = true;
      const data = await service.getDriftEventById(this.eventId);
      this.driftEvent = data;
      this.loading = false;
    },
    async fetchSeasonLeaderboard() {
      const leaderboard = await apiDriftLeaderboard.getLeaderboardBySeasonId(
        this.seasonId
      );
      this.seasonLeaderboard = leaderboard;
    },
  },
};
</script>
