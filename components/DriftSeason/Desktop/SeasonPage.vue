<template>
  <div class="component-DriftEventPage margin-12">
    <div class="back-link-to-series">
      <NuxtLink class="blank button" to="/series">Takaisin sarjoihin</NuxtLink>
    </div>
    <LoadingIndicator v-if="isLoading" />
    <div class="content-wrapper" v-if="!isLoading">
      <h1 class="big-header">{{ serie }} {{ seasonYear }}</h1>
      <p class="event-details">
        {{ driftEventName }}
        <span class="city">{{ eventTrackCity }}</span>
      </p>
      <section class="select-view-section">
        <DriftSeasonDesktopViewSelection
          v-if="!!season"
          :navigationList="navigationList"
        />
      </section>
      <section class="view-section scroll-section" id="events">
        <h2 class="section-header">Tapahtumat</h2>
        <DriftSeasonEventList v-if="!!season" :season="season" />
      </section>
      <section class="view-section scroll-section" id="stats">
        <h2 class="section-header">Kauden Tilastot</h2>
        <DriftSeasonPointsChart :eventList="eventList" :seasonId="seasonId" />
      </section>
      <section class="view-section scroll-section" id="leaderboard">
        <h2 class="section-header">Kauden Pistetaulukko</h2>
        <LeaderboardScoreboardView
          v-if="season"
          :loading="loading.drivers || loading.season"
          :scoreboard="scoreboard"
          :seasonYear="seasonYear"
          :seasonName="seasonName"
          :allDriversList="allDriversList"
        />
      </section>
      <section class="view-section scroll-section" id="seasons">
        <h2 class="section-header">Muut kaudet</h2>
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
import { useDriversStore } from "~/store/drivers";
import apiDriftSeason from "~/utils/drifting/api-drift-season";

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
    navigationList(): { label: string; key: string }[] {
      return [
        {
          label: "Tapahtumat",
          key: "events",
        },
        {
          label: "Tilastot",
          key: "stats",
        },
        {
          label: "Pistetaulukko",
          key: "leaderboard",
        },
        {
          label: "Muut kaudet",
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
  async mounted() {
    this.fetchDrivers();
    await this.fetchDriftSeason();
    // scroll to selected section on mount
    this.$nextTick(() => {
      if (this.$route.hash) {
        const el = document.querySelector(this.$route.hash);
        if (el) {
          el.scrollIntoView({ behavior: "auto", block: "start" });
        }
      }
    });
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
  h1 {
    font-size: 2.6rem;
    text-align: center;
    color: var(--green-1);
    margin: 0 auto;
  }
  section {
    &.scroll-section {
      position: relative;
      padding-top: 80px;
      padding-bottom: 50px;

      &:after {
        content: "";
        max-width: 800px;
        width: calc(100% - 24px);
        padding: 0 12px;
        height: 2px;
        background: var(--green-1);
        position: absolute;
        bottom: 0;
        left: 50%;
        transform: translateX(-50%);
        opacity: 0.5;
      }
    }
    .section-header {
      text-align: center;
      font-size: 2rem;
      color: var(--green-1);
      margin: 0;
    }
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
    position: fixed;
    top: 80px;
    right: 200px;
    transform: translateX(100%);
    z-index: 2;
  }

  .view-section {
    margin-top: 24px;
  }
}
</style>
