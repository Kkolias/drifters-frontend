<template>
  <div class="component-DriftSeasonPointsChart">
    <MultiSelect
      class="multi-select"
      :selectedIdList="selectedDriverIds"
      :optionList="driverOptionList"
      valueKey="value"
      placeholderOption="Valitse verrattavat"
      @select="setSelectedDriverIdsAndResetChart"
    />
    <div class="chart-container">
      <canvas id="myChart"></canvas>
    </div>
  </div>
</template>

<script lang="ts">
import type { ScoreboardItem } from "~/interfaces/leaderboard.interface";
import { Chart } from "chart.js/auto";
import apiDriftLeaderboard from "~/utils/drifting/api-drift-leaderboard";
import type { IDriftEvent } from "~/interfaces/drift-event.interface";
import service from "./DriftSeasonPointsChart.service";

export default {
  props: {
    seasonId: {
      type: String,
      required: true,
    },
    eventList: {
      type: Array as () => IDriftEvent[],
      default: () => [],
    },
  },
  data: (): any => ({
    chartData: {},
    scoreboard: [] as ScoreboardItem[],

    selectedDriverIds: [] as string[],
    selectedDriversChanged: false,

    chart: null,

    interval: null,
  }),
  async mounted() {
    await this.fetchEventScores();
    this.drawChart();
    this.chartUpdateLoop();
  },
  computed: {
    driverOptionList() {
      return service.driverOptionList(this.scoreboard);
    },
  },
  unmounted() {
    clearInterval(this.interval);
  },
  methods: {
    chartUpdateLoop() {
      this.interval = setInterval(() => {
        if (this.selectedDriversChanged) {
          this.selectedDriversChanged = false;
          this.resetChartData();
        }
      }, 2000);
      this.interval;
    },
    drawChart() {
      const ctx = document.getElementById("myChart") as any;
      const chart = new Chart(ctx, this.chartData);
      this.chart = chart;
      this.chart.draw();
    },
    async fetchEventScores() {
      const r = await apiDriftLeaderboard.getEventScores(this.seasonId);
      this.scoreboard = r;
      this.setDefaultTop3();

      const dataSet = service.getEventScoresData(
        this.scoreboard,
        this.eventList,
        this.selectedDriverIds
      );
      this.chartData = dataSet;
    },
    setDefaultTop3() {
      const top3 = this.scoreboard.slice(0, 3);
      const defaultDriverIds = top3.map((item: any) => item.driver?._id);
      this.selectedDriverIds = defaultDriverIds;
    },
    setSelectedDriverIds(selectedIds: string[]) {
      this.selectedDriverIds = selectedIds;
    },
    setSelectedDriverIdsAndResetChart(selectedIds: string[]) {
      this.setSelectedDriverIds(selectedIds);
      this.selectedDriversChanged = true;
    },
    resetChartData() {
      const dataSet = service.getEventScoresData(
        this.scoreboard,
        this.eventList,
        this.selectedDriverIds
      );
      this.chartData = dataSet;
      // destroy old chart
      if (this.chart) {
        this.chart.destroy();
        this.chart = null;
      }
      this.drawChart();
    },
  },
};
</script>

<style lang="less" scoped>
.component-DriftSeasonPointsChart {
  max-width: 800px;
  margin: auto;
  width: 100%;
  .multi-select {
    max-width: 250px;
    min-width: 180px;
    margin: 0 30px;
  }
  .chart-container {
    height: 400px;
  }

  // canvas {
  //     max-width: 800px;
  //     max-height: 400px;
  //     width: 100%;
  //     margin: 0 auto;
  // }
}
</style>
