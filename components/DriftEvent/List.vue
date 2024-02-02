<template>
  <div class="component-DriftEventList">
    <DataTable :headerList="headerList" :dataList="parsedDataList" />
  </div>
</template>

<script lang="ts">
import apiDriftEvent from "~/utils/drifting/api-drift-event";
import { type IDriftEvent } from "../../interfaces/drift-event.interface";

interface DriverListData {
  driftEventList: IDriftEvent[];
  loading: boolean;
}

export default {
  name: "DriftEventList",
  data: (): DriverListData => ({
    driftEventList: [],
    loading: false,
  }),
  computed: {
    headerList() {
      return [
        {
          name: "Id",
          key: "_id",
          isLink: true,
        },
        {
          name: "Lajittelut",
          key: "qualifying",
        },
        {
          name: "Kilpailut",
          key: "competitionDay",
        },
      ];
    },
    parsedDataList(): any[] {
      return this.driftEventList.map((event) => ({
        _id: event._id,
        qualifying: event.qualifying || "-",
        competitionDay: event.competitionDay || "-",
      }));
    },
  },
  mounted() {
    this.fetchEvents();
  },
  methods: {
    async fetchEvents(): Promise<void> {
      this.setLoading(true);
      const drivers = await apiDriftEvent.getAllDriftSeasons();
      this.setDriftEventList(drivers);
      this.setLoading(false);
    },
    setDriftEventList(events: IDriftEvent[]): void {
      this.driftEventList = events;
    },
    setLoading(value: boolean): void {
      this.loading = value;
    },
  },
};
</script>
