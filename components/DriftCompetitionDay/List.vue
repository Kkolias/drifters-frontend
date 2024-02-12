
<template>
    <div class="component-QualifyingList">
      <DataTable :headerList="headerList" :dataList="parsedDataList" />
    </div>
  </template>
  
  <script lang="ts">
  import apiCompetitionDay from "~/utils/drifting/api-competition-day";
import type { ICompetitionDay } from "~/interfaces/competition-day.interface";
  
  interface IData {
    competitionDays: ICompetitionDay[];
    loading: boolean;
  }
  
  export default {
    name: "CompetitionDayList",
    data: (): IData => ({
      competitionDays: [],
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
            name: "Tapahtuma",
            key: "eventId",
          },
        ];
      },
      parsedDataList(): any[] {
        return this.competitionDays.map((q) => ({
          _id: q._id,
          eventId: q.eventId,
        }));
      },
    },
    mounted() {
      this.fetchList();
    },
    methods: {
      async fetchList(): Promise<void> {
        this.setLoading(true);
        const competitionDays = await apiCompetitionDay.getAllCompetitionDays();
        this.setCompetitionDays(competitionDays);
        this.setLoading(false);
      },
      setCompetitionDays(competitionDays: ICompetitionDay[]): void {
        this.competitionDays = competitionDays;
      },
      setLoading(value: boolean): void {
        this.loading = value;
      },
    },
  };
  </script>
  