
<template>
    <div class="component-QualifyingList">
      <DataTable :headerList="headerList" :dataList="parsedDataList" />
    </div>
  </template>
  
  <script lang="ts">
import type { ILeaderboard } from "~/interfaces/leaderboard.interface";
import apiDriftLeaderboard from "~/utils/drifting/api-drift-leaderboard";

  interface IData {
    leaderboardList: ILeaderboard[];
    loading: boolean;
  }
  
  export default {
    name: "LeaderoardList",
    data: (): IData => ({
      leaderboardList: [],
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
            name: "Kausi",
            key: "seasonId",
          },
        ];
      },
      parsedDataList(): any[] {
        return this.leaderboardList.map((q) => ({
          _id: q._id,
          seasonId: q.seasonId,
          link: `/leaderboard/${q._id}`,
        }));
      },
    },
    mounted() {
      this.fetchList();
    },
    methods: {
      async fetchList(): Promise<void> {
        this.setLoading(true);
        const leaderboardList = await apiDriftLeaderboard.getAllCompetitionDays();
        this.setLeaderboardList(leaderboardList);
        this.setLoading(false);
      },
      setLeaderboardList(leaderboardList: ILeaderboard[]): void {
        this.leaderboardList = leaderboardList;
      },
      setLoading(value: boolean): void {
        this.loading = value;
      },
    },
  };
  </script>
  