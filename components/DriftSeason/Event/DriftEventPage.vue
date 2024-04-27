<template>
  <div class="component-DriftEventPage">
    <div class="back-link-to-series">
      <NuxtLink class="blank button" to="/series">Takaisin sarjoihin</NuxtLink>
    </div>
    <LoadingIndicator v-if="isLoading" />
    <div class="content-wrapper" v-if="!isLoading">
      <h1>{{ serie }} {{ seasonYear }}</h1>
      <p class="event-details">
        {{ driftEventName }}
        <span class="city">{{ eventTrackCity }}</span>
      </p>
      <section class="select-view-section">
        <DriftSeasonEventDriftEventViewSelection
          v-if="!!season"
          :season="season"
        />
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
      <section class="view-section" v-if="isViewSelected('seasons')">
        <DriftSeriesList :selectedSeason="seasonId" />
      </section>
    </div>
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
    eventId: {
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
      driftEvent: true,
      season: true,
      qualifying: true,
      drivers: true,
      competitionDay: true,
    },
  }),
  computed: {
    isLoading(): boolean {
      return this.loading.season;
    },
    queryParams() {
      return this.$route.query;
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
    if (this.eventId) {
      this.fetchDriftEvent();
    }
    if (this.qualifyingId) {
      this.fetchQualifying();
    }
    if (this.competitionDayId) {
      this.fetchCompetitionDay();
    }
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
      if (!this.qualifyingId) {
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
  .back-link-to-series {
    max-width: 1400px;
    width: 100%;
    margin: auto;
    position: absolute;
    top: 42px;
    left: 50%;
    transform: translateX(-50%);

    .button {
      color: var(--white-1);
      font-weight: 700;
      margin-left: 26px;
      line-height: 20px;
      transition: 0.25s ease-in-out;

      &:before {
        content: "";
        position: absolute;
        background: url("~/assets/svg/arrow-grey.svg") no-repeat;
        background-size: contain;
        background-position: center;
        width: 20px;
        height: 20px;
        left: 0;
        top: 50%;
        transform: translateY(-50%) rotate(180deg);
        transition: 0.25s ease-in-out;
      }

      &:hover {
        color: var(--green-1);

        &:before {
          background-image: url("~/assets/svg/arrow-green.svg");
          transform: translateY(-50%) rotate(180deg) scale(1.05);
        }
      }
    }
  }
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
