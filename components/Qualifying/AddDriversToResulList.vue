<template>
  <div class="component-QualifyingAddDriversToResultList">
    <Modal :value="true" @close="closeModal()">
      <div class="content">
        <h2>Lisää kuljettajia lajitteluun</h2>
        delete: {{ driverIdListToDelete }} new: {{ newSelectedDriverIdList }}
        <LoadingIndicator v-if="loading" />
        <DataTable
          v-else
          :headerList="headerList"
          :dataList="dataList"
          :selectable="true"
          @itemClick="handleSelectDriver"
        />
        <div class="button-wrapper">
          <button class="primary" @click="updateResultList()">Tallenna</button>
        </div>
      </div>
    </Modal>
  </div>
</template>

<script lang="ts">
import type { IQualifying } from "~/interfaces/qualifying.interface";
import service from "./AddDriversToResultList.service";
import type { IDriver } from "~/interfaces/driver.interface";
import { parsedDriverList } from "~/utils/driver.utils";

interface IData {
  allDrivers: IDriver[];
  loading: boolean;
  newSelectedDriverIdList: string[];
  driverIdListToDelete: string[];
}

export default {
  props: {
    qualifyingItem: {
      type: Object as PropType<IQualifying | null>,
    },
  },
  data: (): IData => ({
    allDrivers: [],
    loading: false,

    newSelectedDriverIdList: [],
    driverIdListToDelete: [],
  }),
  computed: {
    headerList() {
      return [
        {
          key: "name",
          name: "Nimi",
        },
      ];
    },
    dataList() {
      return parsedDriverList(this.allDrivers, this.selectedDriverIdList);
    },
    qualifyingId(): string {
      return this.qualifyingItem?._id || "";
    },
    currentSelectedDriverIdList(): string[] {
      return (
        (this.qualifyingItem?.resultList.map(
          (r) => r?.driver
        ) as unknown as string[]) || []
      );
    },
    selectedDriverIdList() {
      return [
        ...this.currentSelectedDriverIdList,
        ...this.newSelectedDriverIdList,
      ]?.filter((id) => !this.driverIdListToDelete.includes(id));
    },
  },
  mounted() {
    this.fetchDrivers();
  },
  methods: {
    async fetchDrivers() {
      this.setLoading(true);
      const r = await service.getAllDrivers();
      this.allDrivers = r;
      this.setLoading(false);
    },

    async updateResultList() {
      // TODO: handle unchecked drivers
      this.setLoading(true);

      await service.addDriversToResultList(
        this.qualifyingId,
        this.mapDriverIdWithOrderNumber(this.newSelectedDriverIdList)
      );
      await this.handleDeleteResult();

      this.reloadData();
      this.setLoading(false);
    },

    async handleDeleteResult() {
      await service.deleteResultList(
        this.qualifyingId,
        this.driverIdListToDelete
      );
    },

    mapDriverIdWithOrderNumber(
      newSelectedDriverIdList: string[]
    ): { id: string; orderNumber: number }[] {
      const prefix = this.currentSelectedDriverIdList?.length || 0;
      return newSelectedDriverIdList.map((id, index) => {
        return {
          id,
          orderNumber: index + 1 + prefix,
        };
      });
    },

    driverIdInOriginalList(driverId: string): boolean {
      const originalList = this
        .currentSelectedDriverIdList as unknown as string[];
      return originalList?.includes(driverId);
    },

    handleSelectDriver(driver: any): void {
      // if driver._id is in newSelectedDriverIdList, remove it from that list
      // if driver._id is in driverIdListToDelete, remove it from that list
      // if driver._id is in currentSelectedDriverIdList, add it to driverIdListToDelete
      // if driver._id is not in currentSelectedDriverIdList and not in driverIdListToDelete, add it to newSelectedDriverIdList
      const driverId = driver._id;
      if (this.newSelectedDriverIdList.includes(driverId)) {
        this.newSelectedDriverIdList = this.newSelectedDriverIdList.filter(
          (id) => id !== driverId
        );
      } else if (this.driverIdListToDelete.includes(driverId)) {
        this.driverIdListToDelete = this.driverIdListToDelete.filter(
          (id) => id !== driverId
        );
      } else if (this.driverIdInOriginalList(driverId)) {
        this.driverIdListToDelete = [...this.driverIdListToDelete, driverId];
      } else {
        this.newSelectedDriverIdList = [
          ...this.newSelectedDriverIdList,
          driverId,
        ];
      }
    },

    setLoading(val: boolean): void {
      this.loading = val;
    },
    reloadData(): void {
      (this.newSelectedDriverIdList = []), (this.driverIdListToDelete = []);
      this.$emit("reload");
    },
    closeModal(): void {
      this.$emit("closeModal");
    },
  },
};
</script>

<style lang="less" scoped>
.component-QualifyingAddDriversToResultList {
  .content {
    border: 2px solid var(--black-2);
    border-radius: 10px;
    padding: 24px;

    .button-wrapper {
      display: flex;
      justify-content: flex-end;
      margin-top: 24px;
    }
  }
}
</style>
