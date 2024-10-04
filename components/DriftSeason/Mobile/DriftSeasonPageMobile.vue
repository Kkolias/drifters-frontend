<template>
  <div class="component-DriftEventPage">
    <LoadingIndicator v-if="isLoading" />
    <div class="content-wrapper" v-if="!isLoading">
      <section class="hero-section">
        <h1 class="big-header">{{ serie }} {{ seasonYear }}</h1>
        <p class="subtext">{{ textContent.overview }}</p>
      </section>
      <section class="select-view-section">
        <DriftSeasonMobileViewSelection
          v-if="!!season"
          :season="season"
          :navigationList="navigationList"
        />
      </section>
      <div class="contents margin-12">
        <section class="view-section" v-if="isViewSelected('events')">
          <DriftSeasonEventList v-if="!!season" :season="season" />
        </section>
        <section class="view-section" v-if="isViewSelected('stats')">
          <DriftSeasonPointsChart :eventList="eventList" :seasonId="seasonId" />
        </section>
        <section class="view-section" v-if="isViewSelected('leaderboard')">
          <LeaderboardScoreboardView
            v-if="season"
            :loading="loading.drivers || loading.season"
            :scoreboard="scoreboard"
            :seasonYear="seasonYear"
            :seasonName="seasonName"
            :allDriversList="allDriversList"
          />
        </section>
        <section class="view-section" v-if="isViewSelected('seasons')">
          <DriftSeriesList :selectedSeason="seasonId" />
        </section>
      </div>
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
import Language from "~/mixins/language.vue";
import { useDriversStore } from "~/store/drivers";
import apiDriftSeason from "~/utils/drifting/api-drift-season";

const translations = {
  fi: {
    overview: "Kauden yhteenveto",
    events: "Tapahtumat",
    stats: "Tilastot",
    leaderboard: "Pistetaulukko",
    seasons: "Muut kaudet",
  },
  en: {
    overview: "Season overview",
    events: "Events",
    stats: "Stats",
    leaderboard: "Scoreboard",
    seasons: "Other seasons",
  },
};

interface IData {
  driftEvent: IDriftEvent | null;
  season: IDriftSeason | null;

  competitionDay: ICompetitionDay | null;
  qualifying: IQualifying | null;

  loading: {
    driftEvent: boolean;
    season: boolean;
    qualifying: boolean;
    drivers: boolean;
    competitionDay: boolean;
  };
}

export default {
  mixins: [Language],
  props: {
    seasonSlug: {
      type: String,
      required: true,
    },
  },
  data: (): IData => ({
    driftEvent: null,
    season: null,
    qualifying: null,
    competitionDay: null,

    loading: {
      driftEvent: true,
      season: true,
      qualifying: true,
      drivers: true,
      competitionDay: true,
    },
  }),
  computed: {
    textContent() {
      return this.getTranslation(translations);
    },
    navigationList() {
      return [
        {
          label: this.textContent.overview,
          key: "events",
        },
        {
          label: this.textContent.stats,
          key: "stats",
        },
        {
          label: this.textContent.leaderboard,
          key: "leaderboard",
        },
        {
          label: this.textContent.seasons,
          key: "seasons",
        },
      ];
    },
    isLoading(): boolean {
      return this.loading.season;
    },
    queryParams() {
      return this.$route.query;
    },
    allDriversList(): IDriver[] {
      return useDriversStore().getDrivers;
    },
    seasonId(): string {
      return this.season?._id || "";
    },
    eventList(): IDriftEvent[] {
      return this.season?.driftEvents || [];
    },
    seasonYear(): string {
      return `${this.season?.year}` || "";
    },
    seasonName(): string {
      const serie = this.season?.serie || "";
      return DRIFT_SERIES_LABEL[serie as keyof typeof DRIFT_SERIES_LABEL] || "";
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
  methods: {
    async fetchDriftSeason(): Promise<void> {
      this.setLoading("season", true);
      const r = await apiDriftSeason.getDriftSeasonBySlug(this.seasonSlug);
      this.season = r;
      this.setLoading("season", false);
    },
    async fetchDrivers(): Promise<void> {
      this.setLoading("drivers", true);
      await useDriversStore().fetchDrivers();
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
  .hero-section {
    min-height: 80px;

    .subtext {
      text-align: center;
      color: var(--green-1);
      margin: 0;
      font-weight: 700;
    }

    .back-link-to-series {
      max-width: 1400px;
      width: 100%;
      margin: auto;
      position: absolute;
      top: 80px;
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
  }

  h1 {
    font-size: 2.6rem;
    text-align: center;
    color: var(--green-1);
    margin: 0 auto;
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
    position: sticky;
    top: 64px;
    z-index: 2;
  }

  .view-section {
    margin-top: 24px;
  }
}
</style>
