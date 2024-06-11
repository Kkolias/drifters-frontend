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
          name: "Nimi",
          key: "name",
        },
        {
          name: "Maa",
          key: "country",
        },
        {
          name: "Kaupunki",
          key: "city",
        },
        {
          name: "Kausi ID",
          key: "seasonId",
        }
      ];
    },
    parsedDataList(): any[] {
      return this.driftEventList.map((event) => ({
        _id: event._id,
        name: event?.name,
        city: event?.city,
        country: event?.country,
        seasonId: event?.seasonId,
      }));
    },
  },
  mounted() {
    this.fetchEvents();
  },
  methods: {
    async fetchEvents(): Promise<void> {
      this.setLoading(true);
      const drivers = await apiDriftEvent.getAllDriftEvents();
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
