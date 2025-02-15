<template>
  <div class="component-DriftEventPage margin-12">
    <div class="back-link-to-series">
      <NuxtLink class="blank button" :to="seasonOverviewPath">{{
        textContent.seasonOverview
      }}</NuxtLink>
    </div>
    <LoadingIndicator v-if="isLoading" />
    <div class="content-wrapper" v-if="!isLoading">
      <h1 class="big-header">
        {{ serie }} {{ seasonYear }} {{ country }} - {{ driftEventName }}
        {{ textContent.results }}
        <!-- {{ serie }} {{ seasonYear }} {{ eventTrackCity }} {{ textContent.results }} -->
      </h1>
      <!-- <h2 class="event-details">{{ textContent.event }} {{ driftEventName }}</h2>
      <h2 class="event-details">{{ textContent.track }} {{ eventTrackCityShort }}</h2>
      <h2 class="event-details">{{ textContent.dates }} {{ eventDates }}</h2> -->
      <section class="select-view-section">
        <DriftSeasonEventDriftEventViewSelection
          v-if="!!season"
          :navigationList="navigationList"
          :season="season"
          :eventSlug="eventSlug"
          :hasShowdown="hasShowdown"
        />
      </section>
      <section class="view-section" v-if="isViewSelected('events')">
        <DriftSeasonEventList v-if="!!season" :season="season" :eventSlug="eventSlug" />
      </section>
      <section class="view-section" v-if="isViewSelected('event-info')">
        <DriftSeasonEventInfo
          v-if="driftEvent"
          :driftEvent="driftEvent"
          :bracketScoreboard="competitionDayScoreboard"
          :driftSerie="driftSerie"
          :isFinished="isEventFinished"
          :seasonSlug="seasonSlug"
          :nextEvent="nextEvent"
          :allDriversList="allDriversList"
          :qualifying="(qualifying as IQualifying)"
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
        <p v-else class="no-data">{{ textContent.informationMissing }}</p>
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
        <p v-else class="no-data">{{ textContent.informationMissing }}</p>
      </section>
      <section class="view-section" v-if="isViewSelected('battles')">
        <DriftCompetitionDayDriftBattlesView
          v-if="competitionDay"
          :competitionDay="competitionDay"
          :loadingDrivers="loading.drivers"
          :loadingCompetitionDay="loading.competitionDay"
          :driftSerie="driftSerie"
        />
        <p v-else class="no-data">{{ textContent.informationMissing }}</p>
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
    </div>
  </div>
</template>

<script lang="ts">
import { DRIFT_SERIES_LABEL } from "~/constants/drift-series";
import type { DriftSerie } from "~/enums/drift-serie.enum";
import type { ICompetitionDay, IScoreBoardItem } from "~/interfaces/competition-day.interface";
import type { IDriftEvent } from "~/interfaces/drift-event.interface";
import type { IDriftSeason } from "~/interfaces/drift-season.interface";
import type { IDriver } from "~/interfaces/driver.interface";
import type { ScoreboardItem } from "~/interfaces/leaderboard.interface";
import type { IQualifying } from "~/interfaces/qualifying.interface";
import Language from "~/mixins/language.vue";
import { useDriversStore } from "~/store/drivers";
import apiCompetitionDay from "~/utils/drifting/api-competition-day";
import apiDriftEvent from "~/utils/drifting/api-drift-event";
import apiDriftSeason from "~/utils/drifting/api-drift-season";
import apiQualifying from "~/utils/drifting/api-qualifying";
import translations from "~/lang/components/DriftSeasonEventDriftEventPage.lang";
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
    countryTextContent() {
      return this.getTranslation(countryTranslations);
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
    navigationList() {
      return [
        { label: this.textContent.eventInfo, key: "event-info" },
        { label: this.textContent.qualifying, key: "qualifying" },
        { label: this.textContent.showdown, key: "qualifying-showdown" },
        { label: this.textContent.bracket, key: "battles" },
        { label: this.textContent.scoreboard, key: "standings" },
        { label: this.textContent.events, key: "events" },
        { label: this.textContent.otherSeasons, key: "seasons" },
      ];
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
    seasonOverviewPath(): string {
      return `/drift-season/${this.seasonSlug}`;
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
    country(): string {
      const country = this.driftEvent?.country || "";
      return getCountryName(country, this.countryTextContent);
    },
    eventTrack(): string {
      return this.driftEvent?.track || "";
    },
    eventCity(): string {
      return this.driftEvent?.city || "";
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
    this.setInitialView();
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
    setInitialView(): void {
      const hasHash = !!this.$route.hash;
      if (!hasHash) {
        this.$router.push({
          hash: "#event-info",
        });
      }
    },
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
