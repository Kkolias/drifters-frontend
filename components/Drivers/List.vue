<template>
  <div class="component-AllFishingPermits">
    <LoadingIndicator v-if="loading" />
    <div class="permit-list-wrapper">
      <DataTable :headerList="headerList" :dataList="parsedDriverList" />
    </div>
  </div>
</template>

<script lang="ts">
// import apiDrivers from "../../utils/drifting/api-drivers";
import type { ICar, IDriver } from "~/interfaces/driver.interface";
import { useDriversStore } from "~/store/drivers";

interface AllDriversData {
  // driverList: IDriver[]
  //   loading: boolean;
}

export default {
  data: (): AllDriversData => ({
    // driverList: [],
    // loading: false,
  }),
  computed: {
    headerList() {
      return [
        // {
        //   name: "Id",
        //   key: "_id",
        //   isLink: true,
        // },
        {
          name: "Etunimi",
          key: "firstName",
          isLink: true,
        },
        {
          name: "Sukunimi",
          key: "lastName",
          isLink: true,
        },
        {
          name: "Syntymäpäivä",
          key: "birthday",
        },
        {
          name: "Maa",
          key: "nationality",
        },
        {
          name: "Autot",
          key: "carNames",
        },
      ];
    },
    loading(): boolean {
      return useDriversStore().getLoading;
    },
    driverList(): IDriver[] {
      return useDriversStore().getDrivers;
    },
    parsedDriverList(): IDriver[] {
      return (
        this.driverList?.map((driver) => {
          // const id = driver?._id || "";
          const nameAsLink = driver?.slug || "";
          const link = `/drivers/${nameAsLink}`;

          const carNames = driver?.cars
            ?.map((car: ICar) => `${car.model} ${car.engine}`)
            ?.join(", ");

          return {
            ...driver,
            link,
            carNames,
          };
        }) || []
      );
    },
  },
  mounted() {
    // this.fetchDrivers();
    useDriversStore().fetchDrivers();
  },
  methods: {
    // async fetchDrivers() {
    //   this.setLoading(true);
    //   const drivers = await apiDrivers.getAllDrivers();
    //   this.setDriverList(drivers);
    //   this.setLoading(false);
    // },
    setDriverList(drivers: IDriver[]): void {
      this.driverList = drivers;
    },
    setLoading(value: boolean): void {
      this.loading = value;
    },
  },
};
</script>

<style lang="less" scoped>
.component-AllFishingPermits {
  .permit-list-wrapper {
    table {
      // th,
      // td {
      //     border: 2px solid var(--green-1);
      // }
    }
  }
}
</style>
