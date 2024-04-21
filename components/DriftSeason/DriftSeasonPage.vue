<template>
  <div class="component-DriftEventPage">
    <h1>{{ serie }} {{ seasonYear }}</h1>
    <p class="event-details">
      {{ driftEventName }}
      <span class="city">{{ eventTrackCity }}</span>
    </p>
    <section class="select-view-section">
      <DriftSeasonViewSelection v-if="!!season" :season="season" />
    </section>
    <section class="view-section" v-if="isViewSelected('events')">
      <DriftSeasonEventList v-if="!!season" :season="season" />
    </section>
    <section class="view-section" v-if="isViewSelected('qualifying')">
      <QualifyingViewWrapper
        v-if="qualifying"
        :qualifying="qualifying"
        :loadingQualifying="loading.qualifying"
        :loadingDrivers="loading.drivers"
        :allDriversList="allDriversList"
      />
      <p v-else class="no-data">Tietoja puuttuu</p>
    </section>
    <section class="view-section" v-if="isViewSelected('battles')">
      <DriftCompetitionDayDriftBattlesView
        v-if="competitionDay"
        :competitionDay="competitionDay"
        :loadingDrivers="loading.drivers"
        :loadingCompetitionDay="loading.competitionDay"
      />
      <p v-else class="no-data">Tietoja puuttuu</p>
    </section>
    <section class="view-section" v-if="isViewSelected('leaderboard')">
      <LeaderboardScoreboardView
        v-if="season"
        :loading="loading.drivers || loading.season"
        :scoreboard="scoreboard"
        :allDriversList="allDriversList"
      />
    </section>
  </div>
</template>

<script lang="ts">
import { DRIFT_SERIES_LABEL } from "~/constants/drift-series";
import type { ICompetitionDay } from "~/interfaces/competition-day.interface";
import type { IDriftEvent } from "~/interfaces/drift-event.interface";
import type { IDriftSeason } from "~/interfaces/drift-season.interface";
import type { IDriver } from "~/interfaces/driver.interface";
import type { ScoreboardItem } from "~/interfaces/leaderboard.interface";
import type { IQualifying } from "~/interfaces/qualifying.interface";
import apiCompetitionDay from "~/utils/drifting/api-competition-day";
import apiDriftEvent from "~/utils/drifting/api-drift-event";
import apiDriftSeason from "~/utils/drifting/api-drift-season";
import apiDrivers from "~/utils/drifting/api-drivers";
import apiQualifying from "~/utils/drifting/api-qualifying";

interface IData {
  driftEvent: IDriftEvent | null;
  season: IDriftSeason | null;

  competitionDay: ICompetitionDay | null;
  qualifying: IQualifying | null;

  allDriversList: IDriver[];

  loading: {
    driftEvent: boolean;
    season: boolean;
    qualifying: boolean;
    drivers: boolean;
    competitionDay: boolean;
  };
}

export default {
  props: {
    seasonId: {
      type: String,
      required: true,
    },
  },
  data: (): IData => ({
    driftEvent: null,
    season: null,
    qualifying: null,
    competitionDay: null,
    allDriversList: [],

    loading: {
      driftEvent: false,
      season: false,
      qualifying: false,
      drivers: false,
      competitionDay: false,
    },
  }),
  computed: {
    queryParams() {
      return this.$route.query;
    },
    eventId() {
      return (this.$route?.query?.["event-id"] as string) || "";
    },
    qualifyingId(): string {
      return this.driftEvent?.qualifying?._id || "";
    },
    competitionDayId(): string {
      return this.driftEvent?.competitionDay?._id || "";
    },
    seasonYear(): string {
      return `${this.season?.year}` || "";
    },
    scoreboard(): ScoreboardItem[] {
      return this.season?.leaderboard?.scoreboard || [];
    },
    serie(): string {
      const serieKey = this.season?.serie || "";
      return (
        DRIFT_SERIES_LABEL[serieKey as keyof typeof DRIFT_SERIES_LABEL] || ""
      );
    },
    driftEventName(): string {
      return this.driftEvent?.name || "";
    },
    eventTrack(): string {
      return this.driftEvent?.track || "";
    },
    eventCity(): string {
      return this.driftEvent?.city || "";
    },
    eventTrackCity(): string {
      if (!this.eventCity || !this.eventTrack) return "";
      return ` - ${this.eventTrack}, ${this.eventCity}`;
    },
  },
  mounted() {
    this.fetchDriftSeason();
    this.fetchDrivers();
  },
  watch: {
    eventId() {
      this.fetchDriftEvent();
    },
    qualifyingId() {
      this.fetchQualifying();
    },
    competitionDayId() {
      this.fetchCompetitionDay();
    },
  },
  methods: {
    async fetchDriftEvent(): Promise<void> {
      this.setLoading("driftEvent", true);
      const r = await apiDriftEvent.getDriftEventById(this.eventId);
      this.driftEvent = r;
      this.setLoading("driftEvent", false);
    },
    async fetchDriftSeason(): Promise<void> {
      this.setLoading("season", true);
      const r = await apiDriftSeason.getDriftSeasonById(this.seasonId);
      this.season = r;
      this.setLoading("season", false);
    },
    async fetchQualifying(): Promise<void> {
      if(!this.qualifyingId) {
        this.qualifying = null;
        return;
      }
      this.setLoading("qualifying", true);
      const r = await apiQualifying.getQualifyingById(this.qualifyingId);
      this.qualifying = r;
      this.setLoading("qualifying", false);
    },
    async fetchCompetitionDay(): Promise<void> {
      if (!this.competitionDayId) {
        this.competitionDay = null;
        return;
      }
      this.setLoading("competitionDay", true);
      const r = await apiCompetitionDay.getCompetitionDayById(
        this.competitionDayId
      );
      this.competitionDay = r;
      this.setLoading("competitionDay", false);
    },
    async fetchDrivers(): Promise<void> {
      this.setLoading("drivers", true);
      const r = await apiDrivers.getAllDrivers();
      this.allDriversList = r;
      this.setLoading("drivers", false);
    },
    setLoading(key: keyof IData["loading"], loading: boolean): void {
      this.loading[key] = loading;
    },

    isViewSelected(view: string): boolean {
      return this.queryParams?.view === view;
    },
  },
};
</script>

<style lang="less" scoped>
.component-DriftEventPage {
  h1 {
    font-size: 2.6rem;
    text-align: center;
    color: var(--green-1);
    margin: 0;
  }
  .event-details,
  .no-data {
    font-size: 1.5rem;
    text-align: center;
    margin: 0;
  }

  .event-details {
    .track {
      font-size: 1.2rem;
      font-weight: 400;
    }
    .city {
      font-size: 1.2rem;
    }
  }

  .select-view-section {
    max-width: 1400px;
    margin: auto;
  }

  .view-section {
    margin-top: 24px;
  }
}
</style>
