<template>
  <div class="component-AllDriversList">
    <LoadingIndicator v-if="loading" />
    <div class="input-section-wrapper">
      <div class="input-wrapper">
        <input type="text" placeholder="Etsi..." v-model="searchTerm" />
        <button
          class="empty-input"
          :class="{ empty: searchTerm.length }"
          @click="searchTerm = ''"
        ></button>
      </div>
    </div>
    <div class="list-wrapper">
      <!-- <DataTable :headerList="headerList" :dataList="parsedDriverList" /> -->
      <table class="scoreboard-table">
        <thead>
          <tr>
            <th class="race-number">Numero</th>
            <th>Kuljettaja</th>
            <th>Maa</th>
            <!-- <th>Sarjat</th> -->
          </tr>
        </thead>
        <tbody>
          <tr v-for="(driver, index) in filteredDriverList" :key="index">
            <td class="race-number">
              <NuxtLink :to="driver.link" class="button blank">
                {{ driver.raceNumber }}
              </NuxtLink>
            </td>
            <td class="name">
              <NuxtLink :to="driver.link" class="button blank">
                {{ driver.name }}
              </NuxtLink>
            </td>
            <td>
              <NuxtLink class="button blank" :to="driver.link">
                {{ getCountryName(driver.nationality) }}
              </NuxtLink>
            </td>
            <!-- <td>
              <NuxtLink class="button blank" to="/"> sarjat </NuxtLink>
            </td> -->
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script lang="ts">
import type { IDriver } from "~/interfaces/driver.interface";
import { useDriversStore } from "~/store/drivers";

interface IParsedDriver extends IDriver {
  name: string;
  link: string;
}

interface AllDriversData {
  searchTerm: string;
}

export default {
  data: (): AllDriversData => ({
    searchTerm: "",
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
    filteredDriverList(): IParsedDriver[] {
      if (!this.searchTerm?.length) return this.parsedDriverList;
      return (
        this.parsedDriverList?.filter((driver) => {
          return this.matchSearchTerm(this.searchTerm, driver.name);
        }) || []
      );
    },
    parsedDriverList(): IParsedDriver[] {
      return (
        this.driverList?.map((driver) => {
          // const id = driver?._id || "";
          const nameAsLink = driver?.slug || "";
          const link = `/drivers/${nameAsLink}`;
          const name = this.getDriverName(driver);

          return {
            ...driver,
            link,
            name,
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
    matchSearchTerm(searchTerm: string, stringToMatch: string): boolean {
      const parsedSearchTerm = searchTerm?.replaceAll(" ", "").toLowerCase();
      const parsedStringToMatch = stringToMatch
        ?.replaceAll(" ", "")
        .toLowerCase();
      return parsedStringToMatch.includes(parsedSearchTerm);
    },
    getDriverName(driver: IDriver): string {
      return `${driver?.firstName} ${driver?.lastName}`;
    },
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
.component-AllDriversList {
  .input-section-wrapper {
    max-width: 700px;
    margin: auto;
  }

  .input-section-wrapper,
  .list-wrapper {
    padding: 0 12px;
  }
  .input-wrapper {
    position: relative;
    width: 180px;

    input {
      width: 180px;
      padding: 0 28px 0 8px;
      background: transparent;
      border: 1px solid var(--white-1);
      height: 28px;

      &:focus {
        border: 1px solid var(--green-1);

        & + .empty-input {
          &:not(.empty) {
            background-image: url("~/assets/svg/magnifying-glass-green.svg");
          }
        }
      }
    }

    .empty-input {
      position: absolute;
      right: 0;
      top: 0;
      bottom: 0;
      width: 30px;
      height: 28px;
      background: url("~/assets/svg/magnifying-glass-white.svg");
      background-size: 20px;
      background-repeat: no-repeat;
      background-position: center;
      transition: all 0.25s ease-in-out;

      // &:hover {
      //   background-image: url("~/assets/svg/magnifying-glass-green.svg");
      // }

      &.empty {
        background: url("~/assets/svg/close-icon-white.svg");
        background-size: 15px;
        background-repeat: no-repeat;
        background-position: center;

        &:hover {
          background-image: url("~/assets/svg/close-icon-green.svg");
        }
      }
    }
  }
  table {
    thead,
    tbody {
      tr {
        .race-number {
          width: 80px;
        }
        .name {
          width: 400px;

          @media only screen and (max-width: 600px) {
            width: 200px;
          }
          @media only screen and (max-width: 400px) {
            width: 150px;
          }
        }
      }
    }
    thead {
      tr {
        th {
          font-size: 16px;
        }
      }
    }
  }
}
</style>
