<template>
  <div class="component-CompetitionDayScoreboard">
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
import type { IScoreBoardItem } from "~/interfaces/competition-day.interface";

export default {
  props: {
    scoreboard: {
      type: Array as PropType<IScoreBoardItem[]>,
      default: () => [],
    },
  },
  methods: {
    getDriverName(resultItem: IScoreBoardItem): string {
      const driver = resultItem?.driver;
      return `${driver?.firstName} ${driver?.lastName}`;
    },
    getFormattedPoints(index: number): string {
      const points = this.getPointsForBattlePlacement(index);
      if(points === 0) return `0`;
      return `+${points}`;
    },
    getPointsForBattlePlacement(index: number): number {
      // 1st +100, 2nd +88, 3rd 76, 4th 64, 5th-8th 48, 9th-16th 32, 17th-32nd 16
      const place = index + 1
      if(place === 1) return 100
      if(place === 2) return 88
      if(place === 3) return 76
      if(place === 4) return 64
      if(place >= 5 && place <= 8) return 48
      if(place >= 9 && place <= 16) return 32
      if(place >= 17 && place <= 32) return 16
      return 0
    },
  },
};
</script>
