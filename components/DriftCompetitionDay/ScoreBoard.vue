<template>
  <div class="component-CompetitionDayScoreboard">
    <table class="scoreboard-table">
      <thead>
        <tr>
          <th>Sija</th>
          <th>Kuljettaja</th>
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
  },
};
</script>
