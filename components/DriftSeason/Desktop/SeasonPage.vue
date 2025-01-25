<template>
  <div class="component-DriftEventPage margin-12">
    <div class="back-link-to-series">
      <NuxtLink class="blank button" to="/series">{{
        textContent.backToSeries
      }}</NuxtLink>
    </div>
    <LoadingIndicator v-if="isLoading" />
    <div class="content-wrapper" v-if="!isLoading">
      <h1 class="big-header">{{ serie }} {{ seasonYear }} {{ textContent.results }}</h1>
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
      <section
        v-if="isSeasonFinished"
        class="view-section scroll-section"
        id="top-three"
      >
        <h2 class="section-header">{{ textContent.topThree }}</h2>
        <DriftSeasonDesktopTopThree
          :scoreboard="scoreboard"
          :driverList="allDriversList"
          :seasonYear="seasonYear"
        />
      </section>
      <section class="view-section scroll-section" id="events">
        <h2 class="section-header">{{ textContent.events }}</h2>
        <DriftSeasonEventList v-if="!!season" :season="season" />
      </section>
      <section class="view-section scroll-section" id="stats">
        <h2 class="section-header">{{ textContent.seasonStats }}</h2>
        <h3 class="section-sub-header">{{ textContent.scoreChart }}</h3>
        <DriftSeasonPointsChart :eventList="eventList" :seasonId="seasonId" />
        <h3 class="section-sub-header">{{ textContent.qualifyingAverage }}</h3>
        <DriftSeasonAverageQualifyingResults
          :allDriversList="allDriversList"
          :seasonSlug="seasonSlug"
        />
      </section>
      <section class="view-section scroll-section" id="standings">
        <h2 class="section-header">{{ textContent.seasonScoreboard }}</h2>
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
        <h2 class="section-header">{{ textContent.otherSeasons }}</h2>
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
import Language from "~/mixins/language.vue";
import { useDriversStore } from "~/store/drivers";
import apiDriftSeason from "~/utils/drifting/api-drift-season";
import translations from "~/lang/components/DriftSeasonDesktopSeasonPage.lang";

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
    isSeasonFinished(): boolean {
      return this.season?.isFinished || false;
    },
    textContent() {
      return this.getTranslation(translations);
    },
    navigationList(): { label: string; key: string }[] {
      const output = [
        {
          label: this.textContent.events,
          key: "events",
        },
        {
          label: this.textContent.stats,
          key: "stats",
        },
        {
          label: this.textContent.scoreboard,
          key: "standings",
        },
        {
          label: this.textContent.otherSeasons,
          key: "seasons",
        },
      ];
      if (this.isSeasonFinished) {
        return [
          {
            label: this.textContent.topThree,
            key: "top-three",
          },
          ...output,
        ];
      }
      return output;
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

      &:not(:last-child) {
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
    }
    .section-header {
      text-align: center;
      font-size: 2rem;
      color: var(--green-1);
      margin: 0;
    }
    .section-sub-header {
      text-align: center;
      font-size: 20px;
      color: var(--white-1);
      margin: 0;
      margin-top: 24px;
      margin-bottom: 12px;
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

    @media only screen and (min-width: 1500px) {
      right: 300px;
    }
    @media only screen and (min-width: 1650px) {
      right: 400px;
    }
  }

  .view-section {
    margin-top: 24px;
  }
}
</style>
