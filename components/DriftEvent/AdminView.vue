<template>
  <div class="component-DriftEventAdminView">
    <LoadingIndicator v-if="loading" />
    <div v-if="!loading">
      <DriftEventAdminViewQualifyingSection
        :qualifyingItem="driftEvent?.qualifying"
        :eventId="id"
        @reload="fetchData"
      />
      <DriftEventAdminViewQualifyingShowdownSection
        :qualifyingShowdownItem="driftEvent?.qualifyingShowdown"
        :eventId="id"
        :allDriversList="allDriversList"
        @reload="fetchData"
      />
      <DriftEventAdminViewCompetitionDaySection
        :competitionDayItem="driftEvent?.competitionDay"
        :eventId="id"
        :allDriversList="allDriversList"
        @reload="fetchData"
      />
    </div>
  </div>
</template>

<script lang="ts">
import type { IDriftEvent } from "~/interfaces/drift-event.interface";
import service from "./AdminView.service";
import apiDrivers from "~/utils/drifting/api-drivers";
import type { IDriver } from "~/interfaces/driver.interface";

interface IData {
  loading: boolean;
  driftEvent: IDriftEvent | null;

  allDriversList: IDriver[];
}

export default {
  props: {
    id: { type: String, default: "" },
  },
  data: (): IData => ({
    loading: true,

    driftEvent: null,

    allDriversList: [],
  }),
  mounted() {
    this.fetchData();
    this.fetchDrivers();
  },
  methods: {
    async fetchDrivers(): Promise<void> {
      const drivers = await apiDrivers.getAllDrivers();
      this.allDriversList = drivers;
    },
    async fetchData() {
      this.loading = true;
      const data = await service.getDriftEventById(this.id);
      this.driftEvent = data;
      this.loading = false;
    },
  },
};
</script>

<style lang="less" scoped>
.component-DriftEventAdminView {
}
</style>
