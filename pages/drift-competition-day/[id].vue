<template>
  <div class="page-drift-competition-day">
    <DriftCompetitionDayView
      :qualifyingId="qualifyingId"
      :allDriversList="allDriversList"
      :loadingDrivers="loadingDrivers"
    />
  </div>
</template>

<script lang="ts">
import type { IDriver } from "~/interfaces/driver.interface";
import apiDrivers from "~/utils/drifting/api-drivers";

interface IData {
  allDriversList: IDriver[];
  loadingDrivers: boolean;
}

export default {
  data: (): IData => ({
    allDriversList: [],
    loadingDrivers: false,
  }),
  computed: {
    qualifyingId(): string {
      return (this.$route?.params?.id as string) || "";
    },
  },
  mounted() {
    this.fetchDrivers();
  },
  methods: {
    async fetchDrivers(): Promise<void> {
      this.setLoadingDrivers(true);
      const drivers = await apiDrivers.getAllDrivers();
      this.allDriversList = drivers;
      this.setLoadingDrivers(false);
    },
    setLoadingDrivers(val: boolean): void {
      this.loadingDrivers = val;
    },
  },
};
</script>
