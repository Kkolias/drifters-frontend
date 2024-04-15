<template>
  <div class="component-QualifyingView">
    <h1>{{ eventName }}</h1>
    <h3>Lajittelu</h3>
    <LoadingIndicator v-if="loading" />

    <QualifyingResultList
      v-if="qualifying"
      :qualifyingResults="qualifying.resultList"
      :allDriversList="allDriversList"
      @select="setResultId"
    />

    {{ selectedResultItem }}

    <QualifyingResultSummary
      v-if="!!selectedResultItem"
      :qualifyingResultItem="(selectedResultItem as IQualifyingResultItem)"
      @close="setResultId('')"
    />
  </div>
</template>

<script lang="ts">
import type { IDriver } from "~/interfaces/driver.interface";
import type {
  IQualifying,
  IQualifyingResultItem,
} from "~/interfaces/qualifying.interface";
import apiDrivers from "~/utils/drifting/api-drivers";
import apiQualifying from "~/utils/drifting/api-qualifying";

interface IData {
  qualifying: IQualifying | null;
  allDriversList: IDriver[];
  loading: boolean;
  loadingDrivers: boolean;
}

export default {
  props: {
    qualifyingId: {
      type: String,
      required: true,
    },
  },
  data: (): IData => ({
    qualifying: null,
    allDriversList: [],
    loading: false,
    loadingDrivers: false,
  }),
  computed: {
    selectedResultId(): string {
      const r = (this.$route?.query?.result as string) || "";
      console.log(r)
      return r
    },
    selectedResultItem(): IQualifyingResultItem | null {
      const item =
        this.qualifying?.resultList?.find(
          (r) => r?._id === this.selectedResultId
        ) || null;
    
        console.log(item);
      if (!item) return null;

      const driver = this.allDriversList?.find(
        (d) => d?._id === item?.driver
      ) as IDriver;
      return {
        ...item,
        driver,
      };
    },
    eventName(): string {
      return this.qualifying?.event?.name || "";
    },
  },
  mounted() {
    this.fetchDrivers();
    this.fetchQualifying();
  },
  methods: {
    async fetchQualifying(): Promise<void> {
      this.setLoading(true);
      const r = await apiQualifying.getQualifyingById(this.qualifyingId);
      this.qualifying = r;
      this.setLoading(false);
    },
    async fetchDrivers(): Promise<void> {
      this.setLoadingDrivers(true);
      const drivers = await apiDrivers.getAllDrivers();
      this.allDriversList = drivers;
      this.setLoadingDrivers(false);
    },
    setLoading(val: boolean): void {
      this.loading = val;
    },
    setLoadingDrivers(val: boolean): void {
      this.loadingDrivers = val;
    },
    setResultId(id: string): void {
      this.$router.push({
        query: {
          result: id,
        },
      });
    },
  },
};
</script>

<style lang="less" scoped>
.component-QualifyingView {
  h1 {
    font-size: 3rem;
    text-align: center;
    margin-bottom: 8px;
    color: var(--green-1);
  }
  h3 {
    margin: 0;
    font-size: 1.8rem;
    text-align: center;
    margin-bottom: 16px;
  }
}
</style>
