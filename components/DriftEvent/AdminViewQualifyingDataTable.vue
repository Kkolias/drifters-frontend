<template>
  <div class="component-AdminViewQualifyingDataTable">
    <LoadingIndicator v-if="loading.allDrivers" />
    <DataTable
      v-else
      :headerList="headerList"
      :dataList="dataList"
      @cellClick="cellClick"
    />
  </div>
</template>

<script lang="ts">
import type { IDriver } from "~/interfaces/driver.interface";
import type {
  IQualifying,
  IQualifyingResultItem,
} from "~/interfaces/qualifying.interface";
import service, {
  type IParsedQualifyingResultItem,
} from "./AdminViewQualifyingDataTable.service";

interface IData {
  allDrivers: IDriver[];
  loading: Record<string, boolean>;
}

export default {
  props: {
    qualifyingItem: {
      type: Object as PropType<IQualifying | null>,
    },
  },
  data: (): IData => ({
    allDrivers: [],
    loading: {
      allDrivers: false,
    },
  }),
  computed: {
    headerList() {
      return [
        {
          key: "orderNumber",
          name: "",
        },
        {
          key: "driverName",
          name: "Kuljettaja",
        },
        {
          key: "run1Points",
          name: "run1 line | angle | style",
          clickable: true,
        },
        {
            key: "run1Summary",
            name: "1 vedon yhteenveto"
        },
        {
          key: "run2Points",
          name: "run2 line | angle | style",
          clickable: true,
        },
        {
            key: "run2Summary",
            name: "2 vedon yhteenveto"
        },
      ];
    },
    parsedDriverList(): IParsedDriver[] {
      return parsedDriverList(this.allDrivers);
    },
    qualifyingResultList(): IQualifyingResultItem[] {
      console.log(this.qualifyingItem);
      return this.qualifyingItem?.resultList || [];
    },
    dataList(): IParsedQualifyingResultItem[] {
      return service.parsedDataList(
        this.qualifyingResultList,
        this.parsedDriverList
      );
    },
  },
  mounted() {
    this.fetchDrivers();
  },
  methods: {
    async fetchDrivers() {
      this.setLoading("allDrivers", true);
      const r = await service.getAllDrivers();
      this.allDrivers = r;
      this.setLoading("allDrivers", false);
    },

    cellClick(payload: any): void {
        console.log("cellClick", payload);

    },

    setLoading(key: string, value: boolean): void {
      this.loading[key] = value;
    },
  },
};
</script>

<style lang="less" scoped>
.component-AdminViewQualifyingDataTable {
  margin-bottom: 20px;
}
</style>
