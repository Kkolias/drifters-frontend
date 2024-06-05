<template>
  <div class="component-DriverSeasonsSection">
    <LoadingIndicator v-if="loading" />
    <div class="content" v-if="!loading">
      <pre>
      {{ seasons }}
    </pre
      >
    </div>
  </div>
</template>

<script lang="ts">
import type { IDriver } from "~/interfaces/driver.interface";
import type { PropType } from "vue";
import { type IDriftSeason } from "~/interfaces/drift-season.interface";
import apiDriftSeason from "~/utils/drifting/api-drift-season";

interface IData {
  seasons: IDriftSeason[];
  loading: boolean;
}

export default {
  props: {
    driver: {
      type: Object as PropType<IDriver>,
      required: true,
    },
  },
  data: (): IData => ({
    seasons: [],
    loading: true,
  }),
  computed: {
    driverId(): string {
      return this.driver?._id || "";
    },
  },
  mounted() {
    this.fetchSeasonsByDriverId();
  },
  methods: {
    async fetchSeasonsByDriverId(): Promise<void> {
      this.setLoading(true);
      const seasons = await apiDriftSeason.getAllByDriverId(this.driverId);
      this.seasons = seasons;
      this.setLoading(false);
    },
    setLoading(value: boolean) {
      this.loading = value;
    },
  },
};
</script>

<style lang="less" scoped>
.compoent-DriverSeasonsSection {
}
</style>
