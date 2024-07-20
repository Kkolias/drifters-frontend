<template>
  <div class="component-DriverSeasonsSection">
    <LoadingIndicator v-if="loading" />
    <div class="content" v-if="!loading">
      <h2>Sarjat ja kaudet, joissa {{ driverName }} on mukana</h2>
      <p class="subtext">
        Tästä osiosta näet kuljettajan {{ driverName }} sijoitukset eri sarjojen
        ja kausien aikana. Listassa näkyvät kuljettajan saavutukset Drift Masters European Championship tai
        Drift SM Pro -sarjoissa, mukaan lukien sijoitukset ja kerätyt pisteet.
        Klikkaamalla kunkin sarjan kautta voit tarkastella yksityiskohtaisesti,
        miten kuljettaja on pärjännyt kyseisenä vuotena.
      </p>
      <div class="serie-list-container">
        <ul>
          <li
            v-for="(serieWithSeasonStats, index) in seriesWithSeasons"
            :key="index"
          >
            <DriversDriverSerieSeasons
              :serieWithSeasonStats="serieWithSeasonStats"
              :isOpen="isListOpen(serieWithSeasonStats.serie)"
              :driverId="driverId"
              @toggleListOpen="toggleListOpen"
            />
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import type { PropType } from "vue";
import {
  type IDriverSeasonStats,
  type ILeaderboardWithSeasonInfo,
} from "~/interfaces/drift-season.interface";
import service, { type ISeasonsOfSerie } from "./DriverSeasonSection.service";
import type { DriftSerie } from "~/enums/drift-serie.enum";

export interface IDriftSerieSeasonList {
  serieName: string;
  leaderboards: ILeaderboardWithSeasonInfo[];
}

interface IData {
  openedLists: DriftSerie[];
}

export default {
  props: {
    driverName: {
      type: String,
      required: true,
    },
    driverId: {
      type: String,
      required: true,
    },
    driverStats: {
      type: Object as PropType<IDriverSeasonStats>,
      required: true,
    },
    loading: {
      type: Boolean,
      default: false,
    },
  },
  data: (): IData => ({
    openedLists: [],
  }),
  computed: {
    seriesWithSeasons(): ISeasonsOfSerie[] {
      const r = service.parseSeriesWithSeasons(this.driverStats, this.driverId);
      return r;
    },
  },
  watch: {
    seriesWithSeasons: {
      immediate: true,
      handler() {
        const firstSerie = this.seriesWithSeasons[0]?.serie;
        if (firstSerie) {
          this.openedLists = [firstSerie];
        }
      },
    },
  },
  methods: {
    isListOpen(serie: DriftSerie): boolean {
      return this.openedLists.includes(serie);
    },
    toggleListOpen(index: DriftSerie): void {
      if (this.isListOpen(index)) {
        this.openedLists = this.openedLists.filter((i) => i !== index);
      } else {
        this.openedLists.push(index);
      }
    },
  },
};
</script>

<style lang="less" scoped>
.component-DriverSeasonsSection {
  max-width: 548px;
  margin: auto;
  margin-top: 12px;

  .subtext {
    text-align: center;
    margin-left: 12px;
    margin-right: 12px;

    @media only screen and (max-width: 1090px) {
      font-size: 14px;
    }
  }

  .serie-list-container {
    ul,
    li {
      list-style: none;
      padding: 0;
      margin: 0;
    }

    li {
      margin-top: 12px;
    }
  }

  h2 {
    text-align: center;
    font-size: 30px;

    @media only screen and (max-width: 1090px) {
      margin-top: 20px;
      font-size: 20px;
    }
  }
}
</style>
