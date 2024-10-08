<template>
  <div class="component-CompetitionDayScoreboard">
    <p class="subtitle">
      {{ textContent.title }}
    </p>
    <table class="scoreboard-table">
      <thead>
        <tr>
          <th>{{ textContent.placement }}</th>
          <th>{{ textContent.driver }}</th>
          <th title="Sijoituksesta saatavat mestaruuspisteet">
            {{ textContent.points }}
          </th>
          <!-- <th>Pisteet</th>
          <th class="scores">(Linja | Kulma |Tyyli)</th> -->
        </tr>
      </thead>
      <tbody>
        <tr v-for="(result, index) in scoreboard" :key="index">
          <td>
            <NuxtLink :to="driverProfileLink(result)" class="button blank">
              <span> {{ index + 1 }}. </span>
            </NuxtLink>
          </td>
          <td>
            <NuxtLink :to="driverProfileLink(result)" class="button blank">
              <span>{{ getDriverName(result) }}</span>
            </NuxtLink>
          </td>
          <td>
            <NuxtLink :to="driverProfileLink(result)" class="button blank">
              <span>{{ getFormattedPoints(index) }}</span>
            </NuxtLink>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script lang="ts">
import type { DriftSerie } from "~/enums/drift-serie.enum";
import type { IScoreBoardItem } from "~/interfaces/competition-day.interface";
import type { IDriver } from "~/interfaces/driver.interface";
import Language from "~/mixins/language.vue";
import { getBattlesPositionPointBySerie } from "~/utils/getBattlePointsForSerie";

const translations = {
  fi: {
    title: "Kaavion tulokset ja sijoituksesta saatavat mestaruuspisteet.",
    placement: "Sija",
    driver: "Kuljettaja",
    points: "Pisteet",
  },
  en: {
    title: "Scoreboard results and championship points from placement.",
    placement: "Placement",
    driver: "Driver",
    points: "Points",
  },
};

export default {
  mixins: [Language],
  props: {
    scoreboard: {
      type: Array as PropType<IScoreBoardItem[]>,
      default: () => [],
    },
    driftSerie: {
      type: String as PropType<DriftSerie | null>,
      default: null,
    },
  },
  computed: {
    textContent() {
      return this.getTranslation(translations);
    },
  },
  methods: {
    driverProfileLink(resultItem: IScoreBoardItem): string {
      const slug = this.getDriver(resultItem)?.slug || "";
      return `/drivers/${slug}`;
    },
    getDriver(resultItem: IScoreBoardItem): IDriver {
      return resultItem?.driver as IDriver;
    },
    getDriverName(resultItem: IScoreBoardItem): string {
      const driver = resultItem?.driver;
      return `${driver?.firstName} ${driver?.lastName}`;
    },
    getFormattedPoints(index: number): string {
      const points = this.getPointsForBattlePlacement(index);
      if (points === 0) return `0`;
      return `+${points}`;
    },
    getPointsForBattlePlacement(index: number): number {
      // 1st +100, 2nd +88, 3rd 76, 4th 64, 5th-8th 48, 9th-16th 32, 17th-32nd 16
      const place = index + 1;
      const points = getBattlesPositionPointBySerie(this.driftSerie, place);
      return points;
    },
  },
};
</script>
