<template>
  <div class="component-DriftSeasonList">
    <LoadingIndicator v-if="loading" />
        <div v-if="!loading" class="permit-list-wrapper">
            <DataTable :headerList="headerList" :dataList="parsedSeasonList" />
        </div>
  </div>
</template>

<script lang="ts">
import type { IDriftSeason } from "~/interfaces/drift-season.interface";
import apiDriftSeason from "~/utils/drifting/api-drift-season";

interface AllSeasonsData {
  seasonList: IDriftSeason[];
  loading: boolean;
}
export default {
  data: (): AllSeasonsData => ({
    seasonList: [],
    loading: true,
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
          name: "Sarja",
          key: "serie",
        },
        {
          name: "Vuosi",
          key: "year",
        },
      ];
    },
    parsedSeasonList(): IDriftSeason[] {
      return (
        this.seasonList?.map((season) => {
          const id = season?._id || "";
          const link = `/drift-season/${id}`;

          return {
            ...season,
            link,
          };
        }) || []
      );
    },
  },
  mounted() {
    this.fetchSeasons();
  },
  methods: {
    async fetchSeasons() {
      this.setLoading(true);
      const seasons = await apiDriftSeason.getAllDriftSeasons();
      this.setSeasonList(seasons);
      this.setLoading(false);
    },
    setSeasonList(seasons: IDriftSeason[]): void {
      this.seasonList = seasons;
    },
    setLoading(value: boolean): void {
      this.loading = value;
    },
  },
};
</script>
