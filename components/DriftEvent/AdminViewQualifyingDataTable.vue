<template>
  <div class="component-AdminViewQualifyingDataTable">
    <LoadingIndicator v-if="loading.allDrivers" />
    <DataTable
      v-else
      :headerList="headerList"
      :dataList="dataList"
      @cellClick="cellClick"
    />
    <QualifyingRunPointModal
      v-if="showRunPointModal"
      :qualifyingResultItem="(selectedResultItem as IQualifyingResultItem)"
      :qualifyingId="qualifyingId"
      :selectedRun="selectedRunNumber"
      @success="updateQualifyingData"
      @closeModal="closeRunPointModal()"
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
  showRunPointModal: boolean;
  selectedResultItem: IQualifyingResultItem | null;
  selectedRunNumber: number;
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
    showRunPointModal: false,

    selectedResultItem: null,
    selectedRunNumber: 1,
  }),
  computed: {
    qualifyingId(): string {
      return this.qualifyingItem?._id || "";
    },
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
          name: "1 vedon yhteenveto",
        },
        {
          key: "run2Points",
          name: "run2 line | angle | style",
          clickable: true,
        },
        {
          key: "run2Summary",
          name: "2 vedon yhteenveto",
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

      const selectedResultId = payload.data._id;
      const selectedResultItem = this.qualifyingResultList.find(
        (item) => item._id === selectedResultId
      );
      console.log(selectedResultItem)
      this.setSelectedResultItem(selectedResultItem as IQualifyingResultItem);

      const selectedRunNumber = payload?.key === "run1Points" ? 1 : 2;
      this.setSelectedRunNumber(selectedRunNumber);

      this.setShowRunPointModal(true);
    },

    updateQualifyingData(_updatedData: IQualifying): void {
      //   this.$emit("updateQualifyingData", updatedData);
      this.closeRunPointModal();
      this.$emit("reload");
    },

    closeRunPointModal(): void {
      this.setSelectedResultItem(null);
      this.setSelectedRunNumber(1);
      this.setShowRunPointModal(false);
    },

    setLoading(key: string, value: boolean): void {
      this.loading[key] = value;
    },
    setSelectedRunNumber(value: number): void {
      this.selectedRunNumber = value;
    },
    setSelectedResultItem(value: IQualifyingResultItem | null): void {
      this.selectedResultItem = value;
    },
    setShowRunPointModal(value: boolean): void {
      this.showRunPointModal = value;
    },
  },
};
</script>

<style lang="less" scoped>
.component-AdminViewQualifyingDataTable {
  margin-bottom: 100px;
}
</style>
