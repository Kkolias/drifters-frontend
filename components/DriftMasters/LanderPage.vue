<template>
  <div class="component-DriftMastersLanderPage">
    <div class="content-wrapper">
      <div class="hero-section">
        <h1>{{ textContent.title }}</h1>
      </div>
      <div class="about-section">
        <h2>{{ textContent.welcome }}</h2>
        <p>{{ textContent.about }}</p>
      </div>
      <div class="section-end"></div>

      <div class="current-season-section">
        <h2>{{ textContent.latestResults }}</h2>
        <p>{{ textContent.subText }}</p>
        <div v-if="loading" class="loading-wrapper">
          <LoadingIndicator class="loading" />
        </div>
        <NuxtLink
          v-if="newestSeason"
          :to="getSeasonLink(newestSeason)"
          class="view-results link"
        >
          {{ textContent.view }} {{ newestSeasonYear }}
          {{ textContent.results }}
        </NuxtLink>
        <p>{{ textContent.pastSeasons }}</p>
      </div>
      <div class="section-end"></div>
      <div class="past-season-section">
        <h2>{{ textContent.pastSeasonsText }}</h2>
        <p>{{ textContent.pastSeasonsSubText }}</p>
        <div v-if="loading" class="loading-wrapper">
          <LoadingIndicator class="loading" />
        </div>
        <div class="list">
          <NuxtLink
            v-for="season in perviousSeasons"
            :to="getSeasonLink(season)"
            class="view-results link"
          >
            {{ textContent.view }} {{ season.year }}
            {{ textContent.results }}
          </NuxtLink>
          <p>{{ textContent.moreSeasonsComing }}</p>
        </div>
        <div class="section-end"></div>

        <div class="upcoming-events">
          <h2>{{ textContent.upcoming }}</h2>
          <p>{{ textContent.dontMiss }}</p>

          <table class="scoreboard-table">
            <thead>
              <tr>
                <th>{{ textContent.date }}</th>
                <th>{{ textContent.event }}</th>
                <th>{{ textContent.location }}</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(event, index) in currentSeasonEventList" :key="index">
                <td>
                  <NuxtLink :to="event.link" class="button blank">
                    <span> {{ event.date }} </span>
                  </NuxtLink>
                </td>
                <td>
                  <NuxtLink :to="event.link" class="button blank">
                    <span>{{ event.name }}</span>
                  </NuxtLink>
                </td>
                <td>
                  <NuxtLink :to="event.link" class="button blank">
                    <span>{{ event.country }}</span>
                  </NuxtLink>
                </td>
              </tr>
            </tbody>
          </table>

          <NuxtLink
            v-if="newestSeason"
            :to="getSeasonLink(newestSeason)"
            class="view-results link"
          >
            {{ textContent.fullSchedule }}
          </NuxtLink>
          <!-- <DriftSeasonEventTimetable v-for="event in upcomingEvents" :key="event.id" :driftEvent="event" /> -->
        </div>
        <div class="section-end"></div>
        <div class="about-drift-masters-section">
          <h2>{{ textContent.aboutDriftMasters }}</h2>
          <p>{{ textContent.aboutSubText }}</p>
          <ul>
            <li>{{ textContent.listOne }}</li>
            <li>{{ textContent.listTwo }}</li>
            <li>{{ textContent.listThree }}</li>
          </ul>
        </div>
        <div class="section-end"></div>
        <div class="watch-drift-masters-section">
          <h2>{{ textContent.howToWatch }}</h2>
          <p>{{ textContent.howToWatchText }}</p>
          <ul>
            <li>
              <b>{{ textContent.watchOneBold }}</b
              >{{ textContent.watchOne }}
              <a
                class="link"
                :href="DMYoutubeLink"
                target="_blank"
                rel="noopener noreferrer"
                >{{ textContent.youtube }}</a
              >
            </li>
            <li>
              <b>{{ textContent.watchTwoBold }}</b
              >{{ textContent.watchTwo }}
              <a
                class="link"
                :href="redBullTvLink"
                target="_blank"
                rel="noopener noreferrer"
                >{{ textContent.redBullTv }}</a
              >
            </li>
            <li>
              <b>{{ textContent.watchThreeBold }}</b
              >{{ textContent.watchThree }}
              <a
                class="link"
                :href="DMInstagramLink"
                target="_blank"
                rel="noopener noreferrer"
                >{{ textContent.instagram }}</a
              >&nbsp;
              <a
                class="link"
                :href="DMFacebookLink"
                target="_blank"
                rel="noopener noreferrer"
                >{{ textContent.facebook }}</a
              >
              {{ textContent.and }}
              <a
                class="link"
                :href="tikkitokkiLink"
                target="_blank"
                rel="noopener noreferrer"
                >{{ textContent.tiktok }}</a
              >
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { DriftSerie } from "~/enums/drift-serie.enum";
import type { IDriftEvent } from "~/interfaces/drift-event.interface";
import type { IDriftSeason } from "~/interfaces/drift-season.interface";
import Language from "~/mixins/language.vue";
import apiDriftSeason from "~/utils/drifting/api-drift-season";
import countryLang from "~/lang/country.lang";

const translations = {
  fi: {
    title: "Drift Masters - Drifting Championship & Tulokset",
    welcome: "Tervetuloa Drift Masters European Championship Hubiin",
    about: `Drift Masters, aiemmin tunnettu nimellä Drift Masters European Championship (DMEC), on Euroopan johtava drifting-sarja, joka nyt kehittyy globaaliksi brändiksi. Täältä löydät kaiken tarvittavan tietääksesi mestaruudesta, mukaan lukien menneet ja nykyiset kaudet, tulokset, tapahtumatiedot ja kuinka seurata toimintaa suorana.`,
    latestResults: "Viimeisimmät Drift Masters -tulokset",
    subText: "Pysy ajan tasalla viimeisimmistä tuloksista nykyiseltä kaudelta:",
    view: "Katso",
    results: "tulokset",
    pastSeasons: "Menneitä kausia varten katso täydellinen lista alla.",
    pastSeasonsText: "Drift Masters kaudet",
    pastSeasonsSubText:
      "Pääse käsiksi yksityiskohtaisiin tuloksiin ja sijoituksiin edellisiltä vuosilta:",
    moreSeasonsComing: "Lisää kausia tulossa pian!",
    upcoming: "Tulevat tapahtumat & Aikataulu",
    dontMiss:
      "Älä missaa mitään toimintaa! Tässä on aikataulu tulevalle kaudelle:",
    date: "Päivämäärä",
    event: "Tapahtuma",
    location: "Sijainti",
    fullSchedule: "Tarkemmat tiedot",
    aboutDriftMasters: "Tietoa Drift Masters European Championshipista",
    aboutSubText:
      "Drift Masters European Championship tunnetaan korkeatasoisesta kilpailusta, intensiivisistä taisteluista ja maailmanluokan kuljettajista. Mestaruustaistelu sisältää:",
    listOne: "Huippuluokan kuljettajia ympäri maailmaa",
    listTwo: "Ikonisia ratoja ja maailmanluokan drifting-areenoita",
    listThree:
      "Jännittäviä tandem-taisteluita, jotka tuomaroidaan nopeuden, kulman ja tyylin perusteella",
    howToWatch: "Kuinka katsoa Drift Mastersia",
    howToWatchText:
      "Haluatko katsoa toimintaa suorana? Tässä on, miten voit seurata mestaruutta:",
    watchOneBold: "Lajittelustriimi: ",
    watchOne: "Katso karsinnat ",
    youtube: "virallisella Drift Masters YouTube-kanavalla",
    watchTwoBold: "Bracket-striimi: ",
    watchTwo: "Katso top32-finaali ",
    redBullTv: "Red Bull TV:stä",
    watchThreeBold: "Sosiaalinen media: ",
    watchThree:
      "Seuraa viimeisimpiä päivityksiä ",
    and: "ja",
    instagram: "Instagramissa,",
    facebook: "Facebookissa",
    tiktok: "TikTokissa.",
  },
  en: {
    title: "Drift Masters  Drifting Championship & Results",
    welcome: "Welcome to Drift Masters European Championship Hub",
    about: `Drift Masters, formerly known as Drift Masters European Championship (DMEC), is Europe's premier drifting series, now evolving into a global brand. Here, you will find everything you need to know about the championship, including past and present seasons, results, event details, and how to follow the action live.`,
    latestResults: "Latest Drift Masters Results",
    subText: "Stay up to date with the latest results from the current season:",
    view: "View",
    results: "results",
    pastSeasons: "For past seasons, see the full list below.",
    pastSeasonsText: "Drift Masters Seasons",
    pastSeasonsSubText:
      "Access detailed results and standings from previous years:",
    moreSeasonsComing: "More seasons coming soon!",
    upcoming: "Upcoming Events & Schedule",
    dontMiss:
      "Don’t miss any action! Here’s the schedule for the upcoming season:",
    date: "Date",
    event: "Event",
    location: "Location",
    fullSchedule: "Full Schedule",
    aboutDriftMasters: "About Drift Masters European Championship",
    aboutSubText:
      "Drift Masters European Championship is known for its high-level competition, intense battles, and world-class drivers. The championship features:",
    listOne: "Top-tier drivers from around the world",
    listTwo: "Iconic tracks and world-class drifting venues",
    listThree: "Exciting tandem battles judged on speed, angle, and style",
    howToWatch: "How to Watch Drift Masters",
    howToWatchText:
      "Want to watch the action live? Here’s how you can follow the championship:",
    watchOneBold: "Qualifying Stream: ",
    watchOne: "Watch qualifyings on ",
    youtube: "Official Drift Masters YouTube",
    watchTwoBold: "Bracket Stream: ",
    watchTwo: "Watch top32 to final on ",
    redBullTv: "Red Bull TV",
    watchThreeBold: "Social Media: ",
    watchThree: "Follow the latest updates on ",
    and: "and",
    instagram: "Instagram,",
    facebook: "Facebook",
    tiktok: "TikTok.",
  },
};

const redBullTvLink =
  "https://www.redbull.com/int-en/event-series/drift-masters-european-championship";
const DMYoutubeLink = "https://www.youtube.com/@DriftMastersGrandPrix/streams";
const DMInstagramLink = "https://www.instagram.com/driftmasters.gp/";
const DMFacebookLink = "https://www.facebook.com/DriftMastersGP/";
const tikkitokkiLink = "https://www.tiktok.com/@driftmasters.gp";

interface IData {
  seasons: IDriftSeason[];
  loading: boolean;
  redBullTvLink: string;
  DMYoutubeLink: string;
  DMInstagramLink: string;
  DMFacebookLink: string;
  tikkitokkiLink: string;
}

export default {
  mixins: [Language],
  data: (): IData => ({
    seasons: [],
    loading: true,
    redBullTvLink,
    DMYoutubeLink,
    DMInstagramLink,
    DMFacebookLink,
    tikkitokkiLink,
  }),
  computed: {
    textContent() {
      return this.getTranslation(translations);
    },
    countryTextContent() {
      return this.getTranslation(countryLang);
    },
    sortedDriftSeasons(): IDriftSeason[] {
      return this.seasons.sort((a, b) => {
        const aYear = a.year;
        const bYear = b.year;
        if (aYear > bYear) return -1;
        if (aYear < bYear) return 1;
        return 0;
      });
    },
    newestSeason(): IDriftSeason | null {
      if (!this.sortedDriftSeasons.length) return null;

      return this.sortedDriftSeasons?.[0] || null;
    },
    newestSeasonYear(): number {
      return this.newestSeason?.year || 0;
    },
    perviousSeasons(): IDriftSeason[] {
      return this.sortedDriftSeasons.slice(1);
    },
    newestSeasonUpcomingEvents(): IDriftEvent[] {
      const events = this.newestSeason?.driftEvents || [];
      return events.filter((event) => new Date(event.startsAt) > new Date());
    },
    currentSeasonEventList(): {
      link: string;
      date: string;
      name: string;
      country: string;
    }[] {
      if (!this.newestSeason) return [];
      const season: IDriftSeason = this.newestSeason;
      const events = this.newestSeasonUpcomingEvents;
      return events.map((event) => ({
        link: this.pathToEvent(season, event),
        date: shortFormatDates(event.startsAt, event.endsAt),
        name: event.name,
        country: getCountryName(event.country, this.countryTextContent),
      }));
    },
  },
  mounted() {
    this.fetchSeasons();
  },
  methods: {
    getSeasonLink(season: IDriftSeason) {
      const slug = season.slug;
      return `/drift-season/${slug}`;
    },
    pathToEvent(season: IDriftSeason, event: IDriftEvent) {
      return `/drift-season/${season.slug}/event/${event.slug}#event-info`;
    },
    async fetchSeasons() {
      this.loading = true;
      const r = await apiDriftSeason.getAllBySerie(DriftSerie.dmec);
      this.seasons = r;
      this.loading = false;
    },
  },
};
</script>

<style lang="less" scoped>
.component-DriftMastersLanderPage {
  .content-wrapper {
    padding: 20px;
    max-width: 1000px;
    margin: auto;

    .hero-section {
      h1 {
        color: var(--green-1);
        text-align: center;
        font-size: 40px;
        margin-bottom: 100px;
      }
    }

    h2 {
      font-size: 26px;
      color: var(--green-1);
      text-align: center;
    }
    p {
      font-size: 18px;
    }

    .link {
      color: var(--green-1);
      font-size: 18px;
      text-decoration: underline;
    }

    .about-drift-masters-section,
    .watch-drift-masters-section {
      ul {
        padding-left: 20px;

        li {
          margin-bottom: 10px;
          font-size: 18px;
          font-weight: 400;
        }
      }
    }

    .section-end {
      width: 100%;
      height: 2px;
      background-color: var(--black-2);
      margin-top: 40px;
      margin-bottom: 40px;
    }

    .current-season-section {
      .loading-wrapper {
        .loading {
          position: relative;
          margin-top: 40px;
        }
      }
    }

    .list {
      display: flex;
      flex-direction: column;
      gap: 10px;
    }

    .scoreboard-table {
      margin-bottom: 10px;
    }
  }

  @media only screen and (max-width: 768px) {
    .content-wrapper {
      .hero-section {
        font-size: 28px;
      }

      h2 {
        font-size: 20px;
        text-align: left;
      }

      p {
        font-size: 14px;
      }
      .link {
        font-size: 14px;
      }

      .about-drift-masters-section,
      .watch-drift-masters-section {
        ul {
          li {
            font-size: 14px;
          }
        }
      }
    }
  }
}
</style>
