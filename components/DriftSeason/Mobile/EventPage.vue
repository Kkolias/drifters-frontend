<template>
  <div class="component-DriftEventPage">
    <LoadingIndicator v-if="isLoading" />
    <div class="content-wrapper" v-if="!isLoading">
      <section class="hero-section">
        <h1 class="big-header">
          {{ serie }} {{ seasonYear }} {{ eventCountry }}
        </h1>
        <p class="subtext">{{ driftEventName }} {{ textContent.results }}</p>
        <NuxtLink class="to-season-overview" :to="seasonOverviewLink">{{
          textContent.seasonOverview
        }}</NuxtLink>
        <DriftEventLiveUpdatesStatus v-if="showLiveStatus" :isLiveUpdates="isLiveUpdates" />
        <DriftEventCancelled v-if="isCancelled" />
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
          <DriftSeasonEventList
            v-if="!!season"
            :season="season"
            :eventSlug="eventSlug"
          />
        </section>
        <section class="view-section" v-if="isViewSelected('qualifying')">
          <QualifyingViewWrapper
            v-if="qualifying"
            :qualifying="qualifying"
            :loadingQualifying="loading.qualifying"
            :loadingDrivers="loading.drivers"
            :driftSerie="driftSerie"
            :allDriversList="allDriversList"
          />
          <p v-else class="no-data">Tietoja puuttuu</p>
        </section>
        <section
          class="view-section"
          v-if="isViewSelected('qualifying-showdown')"
        >
          <QualifyingShowdownView
            v-if="qualifyingShowdown"
            :qualifyingShowdown="qualifyingShowdown"
            :loadingDrivers="loading.drivers"
            :allDriversList="allDriversList"
            :loadingCompetitionDay="loading.competitionDay"
          />
          <p v-else class="no-data">Tietoja puuttuu</p>
        </section>
        <section class="view-section" v-if="isViewSelected('battles')">
          <DriftCompetitionDayDriftBattlesView
            v-if="competitionDay"
            :competitionDay="competitionDay"
            :loadingDrivers="loading.drivers"
            :loadingCompetitionDay="loading.competitionDay"
            :driftSerie="driftSerie"
          />
          <p v-else class="no-data">Tietoja puuttuu</p>
        </section>
        <section class="view-section" v-if="isViewSelected('standings')">
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
        <section class="view-section" v-if="isViewSelected('event-info')">
          <DriftSeasonEventInfo
            v-if="driftEvent"
            :driftEvent="driftEvent"
            :seasonSlug="seasonSlug"
            :nextEvent="nextEvent"
            :allDriversList="allDriversList"
            :qualifying="(qualifying as IQualifying)"
            :bracketScoreboard="competitionDayScoreboard"
            :driftSerie="driftSerie"
            :isFinished="isEventFinished"
          />
        </section>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { DRIFT_SERIES_LABEL } from "~/constants/drift-series";
import type { DriftSerie } from "~/enums/drift-serie.enum";
import type {
  ICompetitionDay,
  IScoreBoardItem,
} from "~/interfaces/competition-day.interface";
import type { IDriftEvent } from "~/interfaces/drift-event.interface";
import type { IDriftSeason } from "~/interfaces/drift-season.interface";
import type { IDriver } from "~/interfaces/driver.interface";
import type { ScoreboardItem } from "~/interfaces/leaderboard.interface";
import type { IQualifying } from "~/interfaces/qualifying.interface";
import { useDriversStore } from "~/store/drivers";
import apiCompetitionDay from "~/utils/drifting/api-competition-day";
import apiDriftEvent from "~/utils/drifting/api-drift-event";
import apiDriftSeason from "~/utils/drifting/api-drift-season";
import apiQualifying from "~/utils/drifting/api-qualifying";
import translations from "~/lang/components/DriftSeasonEventDriftEventPage.lang";
import Language from "~/mixins/language.vue";
import countryTranslations from "~/lang/country.lang";

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
    eventSlug: {
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
    showLiveStatus(): boolean {
      return isEventTwoDaysAhead(this.driftEvent);
    },
    isCancelled(): boolean {
      return this.driftEvent?.isCancelled || false;
    },
    isLiveUpdates(): boolean {
      return this.driftEvent?.liveUpdates || false;
    },
    competitionDayScoreboard(): IScoreBoardItem[] {
      return this.competitionDay?.scoreBoard || [];
    },
    isEventFinished(): boolean {
      return this.driftEvent?.isFinished || false;
    },
    textContent() {
      return this.getTranslation(translations);
    },
    countryTextContent() {
      return this.getTranslation(countryTranslations);
    },
    nextEvent() {
      const eventList = this.season?.driftEvents || [];
      const sortedByStartsAt = eventList.sort(
        (a, b) =>
          new Date(a.startsAt).getTime() - new Date(b.startsAt).getTime()
      );

      const indexOfCurrentEvent = sortedByStartsAt.findIndex(
        (e) => e.slug === this.eventSlug
      );

      const nextEvent = sortedByStartsAt?.[indexOfCurrentEvent + 1] || null;
      return nextEvent;
    },
    seasonOverviewLink(): string {
      return `/drift-season/${this.seasonSlug}?view=events`;
    },
    navigationList() {
      return [
        {
          label: this.textContent.eventInfo,
          key: "event-info",
        },
        {
          label: this.textContent.qualifying,
          key: "qualifying",
        },
        {
          label: this.textContent.showdown,
          key: "qualifying-showdown",
        },
        {
          label: this.textContent.bracket,
          key: "battles",
        },
        {
          label: this.textContent.events,
          key: "events",
        },
        {
          label: this.textContent.scoreboard,
          key: "standings",
        },
        {
          label: this.textContent.otherSeasons,
          key: "seasons",
        },
      ]?.filter((nav) => {
        if (!this.hasShowdown) {
          return nav.key !== "qualifying-showdown";
        }
        return true;
      });
    },
    eventText(): string {
      const eventName = this.driftEventName;
      const country = this.eventCountry;
      return `${eventName} - ${country}`;
    },
    driftSerie(): DriftSerie | null {
      return this.season?.serie || null;
    },
    seasonId(): string {
      return this.season?._id || "";
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
    qualifyingId(): string {
      return this.driftEvent?.qualifying?._id || "";
    },
    competitionDayId(): string {
      return this.driftEvent?.competitionDay?._id || "";
    },
    qualifyingShowdown() {
      return this.driftEvent?.qualifyingShowdown || null;
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
    eventCountry(): string {
      const country = this.driftEvent?.country || "";
      return getCountryName(country, this.countryTextContent);
    },
    eventTrackCity(): string {
      if (!this.eventCity || !this.eventTrack) return " - ";
      return ` - ${this.eventTrackCityShort} - `;
    },
    eventTrackCityShort(): string {
      if (!this.eventCity || !this.eventTrack) return " - ";
      return `${this.eventTrack}, ${this.eventCity}`;
    },
    eventDates(): string {
      const start = this.driftEvent?.startsAt || "";
      const end = this.driftEvent?.endsAt || "";

      const startDate = formatISODateToStringShort(start);
      const endDate = formatISODateToStringShort(end);

      return `${startDate} - ${endDate}`;
    },
    hasShowdown(): boolean {
      return !!this.driftEvent?.qualifyingShowdown;
    },
  },
  mounted() {
    this.fetchDriftSeason();
    this.fetchDrivers();
    if (this.eventSlug) {
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
    eventSlug() {
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
      const r = await apiDriftEvent.getDriftEventBySlug(this.eventSlug);
      this.driftEvent = r;
      this.setLoading("driftEvent", false);
    },
    async fetchDriftSeason(): Promise<void> {
      this.setLoading("season", true);
      const r = await apiDriftSeason.getDriftSeasonBySlug(this.seasonSlug);
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
      await useDriversStore().fetchDrivers();
      this.setLoading("drivers", false);
    },
    setLoading(key: keyof IData["loading"], loading: boolean): void {
      this.loading[key] = loading;
    },

    isViewSelected(view: string): boolean {
      // return this.queryParams?.view === view;
      // using hash
      return this.$route.hash === `#${view}`;
    },
  },
};
</script>

<style lang="less" scoped>
.component-DriftEventPage {
  .hero-section {
    min-height: 90px;

    .subtext {
      text-align: center;
      color: var(--green-1);
      margin: 0;
      font-size: 18px;
      font-weight: 400;
      margin-top: 8px;
    }

    .to-season-overview {
      display: block;
      text-align: center;
      font-size: 14px;
      text-decoration: underline;
      margin-top: 10px;
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
    margin-top: 4px;
  }

  .select-view-section {
    max-width: 1400px;
    margin: auto;
    position: sticky;
    top: 64px;
    z-index: 1;
  }

  .view-section {
    margin-top: 24px;
  }

  .thank-you-section {
    max-width: 800px;
    margin: auto;
    padding: 0 12px;
    h2 {
      color: var(--green-1);
      font-size: 2rem;
      text-align: center;
    }

    p {
      font-size: 1.2rem;
      margin: 0;
      text-align: center;
      margin-bottom: 24px;
    }
  }
}
</style>
