<template>
  <div class="component-DriverSeasonsSection">
    <LoadingIndicator v-if="loading" />
    <div class="content" v-if="!loading">
      <h2>Sarjat, joissa {{ driverName }} on mukana</h2>
      <div class="serie-list-container">
        <ul>
          <li
            v-for="(serieWithSeasonStats, index) in driftSerieSeasonList"
            :key="index"
          >
            <DriversDriverSerieSeasons :serieWithSeasonStats="serieWithSeasonStats" />
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import type { PropType } from "vue";
import { DRIFT_SERIES_LABEL } from "~/constants/drift-series";
import { DriftSerie } from "~/enums/drift-serie.enum";
import {
  type IDriverSeasonStats,
  type ILeaderboardWithSeasonInfo,
} from "~/interfaces/drift-season.interface";

export interface IDriftSerieSeasonList {
  serieName: string;
  leaderboards: ILeaderboardWithSeasonInfo[];
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
  computed: {
    driftSerieSeasonList(): IDriftSerieSeasonList[] {
      const serieList = Object.values(DriftSerie);

      const seasonStatsBySerie = serieList.map((serie) => {
        const leaderboards =
          this.driverStats?.leaderboards?.filter(
            (leaderboard) => leaderboard?.seasonInfo?.serie === serie
          ) || [];
        return {
          serieName: DRIFT_SERIES_LABEL[serie],
          leaderboards,
        };
      });

      return seasonStatsBySerie;
    },
  },
};
</script>

<style lang="less" scoped>
.component-DriverSeasonsSection {
  max-width: 500px;
  margin: auto;
  margin-top: 12px;

  border: 2px solid var(--black-2);
  padding: 12px;
  border-radius: 10px;
  padding-left: 24px;
  padding-right: 24px;

  h2 {
    text-align: center;
    font-size: 30px;
  }
}
</style>
