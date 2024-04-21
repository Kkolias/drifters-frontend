<template>
  <div class="component-DriftEventAdminView">
    <LoadingIndicator v-if="loading" />

    <DriftEventAdminViewQualifyingSection
      :qualifyingItem="driftEvent?.qualifying"
      :eventId="id"
      @reload="fetchData"
    />
    <DriftEventAdminViewCompetitionDaySection
      :competitionDayItem="driftEvent?.competitionDay"
      :eventId="id"
      @reload="fetchData"
    />
  </div>
</template>

<script lang="ts">
import type { IDriftEvent } from "~/interfaces/drift-event.interface";
import service from "./AdminView.service";

interface IData {
  loading: boolean;
  driftEvent: IDriftEvent | null;
}

export default {
  props: {
    id: { type: String, default: "" },
  },
  data: (): IData => ({
    loading: false,

    driftEvent: null,
  }),
  mounted() {
    this.fetchData();
  },
  methods: {
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
