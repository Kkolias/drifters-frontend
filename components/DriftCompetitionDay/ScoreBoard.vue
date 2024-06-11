<template>
  <div class="component-CompetitionDayScoreboard">
    <p class="subtitle">
      Kilpailun tulokset ja sijoituksesta saatavat mestaruuspisteet.
    </p>
    <table class="scoreboard-table">
      <thead>
        <tr>
          <th>Sija</th>
          <th>Kuljettaja</th>
          <th title="Sijoituksesta saatavat mestaruuspisteet">Pisteet</th>
          <!-- <th>Pisteet</th>
          <th class="scores">(Linja | Kulma |Tyyli)</th> -->
        </tr>
      </thead>
      <tbody>
        <tr v-for="(result, index) in scoreboard" :key="index">
          <td>{{ index + 1 }}.</td>
          <td>
            {{ getDriverName(result) }}
          </td>
          <td>{{ getFormattedPoints(index) }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script lang="ts">
import type { DriftSerie } from "~/enums/drift-serie.enum";
import type { IScoreBoardItem } from "~/interfaces/competition-day.interface";
import { getBattlesPositionPointBySerie } from "~/utils/getBattlePointsForSerie";

export default {
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
  methods: {
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
      const points = getBattlesPositionPointBySerie(this.driftSerie, place)
      return points;
    },
  },
};
</script>

