<template>
  <div class="component-QualifyingAddDriversToResultList">
    <Modal :value="true" @close="closeModal()">
      <div class="content">
        <div class="selection-container">
          <div v-if="stepNumber === 1" class="driver-select-list step-1">
            <p>Lisää kuljettajia lajitteluun</p>
            <!-- delete: {{ driverIdListToDelete }} new: {{ newSelectedDriverIdList }} -->
            <LoadingIndicator v-if="loading" />
            <DataTable
              class="data-table modal-scrollable"
              v-else
              :headerList="headerList"
              :dataList="dataList"
              :selectable="true"
              :showSearch="true"
              @itemClick="handleSelectDriver"
            />
          </div>
          <div v-if="stepNumber === 2" class="driver-order-list step-2">
            <p>Valittujen lähtöjärjestys</p>
            <div class="draggable-wrapper">
              <!-- {{ driverOrderList }} -->
              <draggable
                class="draggable"
                ghost-class="ghost"
                v-model="driverOrderList"
                @change="handleDraggableEnd"
              >
                <!-- <div
                  class="list-group-item"
                  v-for="element in driverOrderList"
                  :key="element.id"
                >
                  {{ element.id }}
                </div> -->
                <tr
                  class="list-group-item"
                  v-for="(driver, index) in driverOrderList"
                  :key="driver.id"
                >
                  <td>{{ index + 1 }}.</td>
                  <td>
                    {{ driverName(driver.driverId) }}
                  </td>
                  <td class="draggable-handle">≡</td>
                </tr>
              </draggable>
            </div>
          </div>
        </div>
        <div class="button-wrapper">
          <button class="primary" @click="handleSubmit()">Tallenna</button>
        </div>
      </div>
    </Modal>
  </div>
</template>

<script lang="ts">
import type {
  IQualifying,
  IQualifyingResultItem,
} from "~/interfaces/qualifying.interface";
import service from "./AddDriversToResultList.service";
import type { IDriver } from "~/interfaces/driver.interface";
import { parsedDriverList } from "~/utils/driver.utils";
import { VueDraggableNext } from "vue-draggable-next";

interface IData {
  allDrivers: IDriver[];
  loading: boolean;
  newSelectedDriverIdList: string[];
  driverIdListToDelete: string[];
  stepNumber: number;
  driverOrderList: { id: string; driverId: string }[];
}

export default {
  components: {
    draggable: VueDraggableNext,
  },
  props: {
    qualifyingItem: {
      type: Object as PropType<IQualifying | null>,
    },
    scoreboardDriverIdListWorstToBest: {
      type: Array as PropType<string[]>,
      default: () => [],
    },
  },
  data: (): IData => ({
    allDrivers: [],
    loading: false,

    newSelectedDriverIdList: [],
    driverIdListToDelete: [],

    stepNumber: 1,

    // for step 2
    driverOrderList: [],
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
    orderedAllDriversList(): IDriver[] {
      const foundOrderedDrivers = this.scoreboardDriverIdListWorstToBest
        ?.map((id) => this.allDrivers?.find((d) => d?._id === id))
        ?.filter((i) => i) as IDriver[];

      const notFoundDrivers = this.allDrivers.filter(
        (d) => !this.scoreboardDriverIdListWorstToBest.includes(d._id)
      );

      return [...foundOrderedDrivers, ...notFoundDrivers];
    },
    dataList() {
      return parsedDriverList(
        this.orderedAllDriversList,
        this.selectedDriverIdList
      );
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
    qualifyingResultList(): IQualifyingResultItem[] {
      return this.qualifyingItem?.resultList || [];
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
  watch: {
    qualifyingResultList: {
      handler() {
        this.setDriverOrderList();
      },
      immediate: true,
    },
    driverOrderList() {
      console.log("driverOrderList changed", this.driverOrderList);
    }
  },
  methods: {
    setDriverOrderList() {
      const sortedResultList = this.qualifyingResultList.sort(
        (a, b) => a.orderNumber - b.orderNumber
      );
      this.driverOrderList = sortedResultList.map((item) => ({
        id: item._id,
        driverId: item.driver as string,
      }));
    },
    async fetchDrivers() {
      this.setLoading(true);
      const r = await service.getAllDrivers();
      this.allDrivers = r;
      this.setLoading(false);
    },

    handleSubmit() {
      if (this.stepNumber === 1) {
        this.stepNumber = 2;
        this.updateResultList();
      } else if (this.stepNumber === 2) {
        this.saveDriverResultListOrder();
      }
    },

    async updateResultList() {
      // TODO: handle unchecked drivers
      if (
        !this.newSelectedDriverIdList?.length &&
        !this.driverIdListToDelete?.length
      )
        return;
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

    driverName(driverId: string): string {
      // console.log(this.allDrivers)
      const driverMatch = this.allDrivers?.find((d) => d._id === driverId);
      // console.log("driver", driverMatch);
      return `${driverMatch?.firstName || ""} ${driverMatch?.lastName || ""}`;
    },

    async saveDriverResultListOrder(): Promise<void> {
      const newOrderList = this.driverOrderList.map((item, index) => ({
        id: item.id,
        orderNumber: index + 1,
      }));
      console.log("newOrderList", newOrderList);
      // return
      this.setLoading(true);

      await service.updateDriverResultListOrder(
        this.qualifyingId,
        newOrderList
      );
      this.setLoading(false);
      this.$emit("reload");
      this.closeModal();
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

    handleDraggableEnd(event: any): void {
      // This method is called when the drag-and-drop operation ends
      // You can handle any additional logic here if needed
      console.log("Drag ended", event);
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
    background: var(--black-1);

    .selection-container {
      // display: flex;
      // justify-content: center;

      .driver-select-list,
      .driver-order-list {
        padding: 0 12px;

        .draggable-wrapper {
          max-height: 50vh;
          overflow-y: auto;
          .draggable {
            border-collapse: collapse;
          }
          .ghost {
            color: var(--green-1);
          }
          .list-group-item {
            border: 1px solid var(--green-1);
            cursor: grab;

            td {
              padding: 3px;
            }
          }
        }
      }
    }

    // .data-table {
    //   max-height: 50vh;
    //   overflow-y: auto;
    // }

    .button-wrapper {
      display: flex;
      justify-content: flex-end;
      margin-top: 24px;
    }
  }
}
</style>
