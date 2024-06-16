<template>
  <div class="component-BracketColumn">
    <!-- {{ heatList }} -->
    <h3>{{ title }}</h3>
    <ul class="heat-list">
      <li v-for="number in heatNumberList" :key="number" class="heat" @click="showHeat(getHeatForNumber(number))">
        <div
          class="lead driver"
          :class="{
            winner: isWinnerOfHeat(getHeatForNumber(number), 'driver1'),
            clown: isPelimies(getHeatForNumber(number).driver2),
          }"
        >
          <p>
            {{ getDriver(getHeatForNumber(number).driver1) }}
          </p>
        </div>
        <div class="heat-number">
          <p>Heat {{ number }}</p>
        </div>
        <div
          class="chase driver"
          :class="{
            winner: isWinnerOfHeat(getHeatForNumber(number), 'driver2'),
            clown: isPelimies(getHeatForNumber(number).driver2),
          }"
        >
          <p>
            {{ getDriver(getHeatForNumber(number).driver2) }}
          </p>
        </div>
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import type { PropType } from "vue";
import type { IHeat } from "~/interfaces/competition-day.interface";
import type { IDriver } from "~/interfaces/driver.interface";
import { getWinnerIdOfHeat } from "~/utils/getWinnerOfHeat";

export default {
  props: {
    title: {
      type: String,
      required: true,
    },
    competitionDayId: {
      type: String,
      required: true,
    },
    heatList: {
      type: Array as PropType<IHeat[]>,
      default: () => [],
    },
    allDriversList: {
      type: Array as PropType<IDriver[]>,
      default: () => [],
    },
    runListLength: {
      type: Number,
      default: 0,
    },
    firstHeatNumber: {
      type: Number,
      default: 0,
    },
  },

  // lisää prefix mistä luvusta aloitetaan runListissä bracketNumberina
  computed: {
    // firstHeatNumber(): number {
    //   return this.heatList[0]?.bracketNumber || 0;
    // },
    heatNumberList(): number[] {
      return Array.from(
        { length: this.runListLength },
        (_, i) => i + this.firstHeatNumber
      );
    },
  },
  methods: {
    showHeat(heat: IHeat) {
      this.$emit("showHeat", heat?._id);
    },
    isWinnerOfHeat(heat: IHeat, driverType: string): boolean {
      const driver1 = heat?.driver1;
      const driver2 = heat?.driver2;
      // if (!driver1 || !driver2) return false;
      const driverId = driverType === "driver1" ? driver1 : driver2;

      if(!driverId) return false;

      const winnerId = getWinnerIdOfHeat(heat);
      return winnerId === driverId;
    },
    getHeatForNumber(number: number): any {
      return (
        this.heatList.find((heat) => heat.bracketNumber === number) || {
          driver1: "",
          driver2: "",
        }
      );
    },
    getDriver(driverProp: any): string {
        if(typeof driverProp === 'string') {

            const driver =
            this.allDriversList.find((d) => d._id === driverProp as string) || null;
            return driver ? `${driver.firstName} ${driver.lastName}` : "N/A";
        }
        const firstName = driverProp?.firstName ?? '';
        const lastName = driverProp?.lastName ?? '';

        if(this.isPelimies(driverProp)) return  `${firstName} ${lastName}`
        const name = `${firstName} ${lastName}`;
        return name ?? 'N/A';
    },
    isPelimies(driverProp: any): boolean {
      const isMondelloPark = this.competitionDayId === "666e179f3cb6e6f25a78fe08";
      const isPelimies = driverProp?._id === "665898af0b7030b5088af8f7";
      return isMondelloPark && isPelimies && this.firstHeatNumber > 9;
    },
    getBracketNumber(heat: IHeat): string {
      return `Heat ${heat?.bracketNumber ?? 0 + this.firstHeatNumber}`;
    },
  },
};
</script>

<style lang="less" scoped>
.component-BracketColumn {
  height: calc(100% - 40px); // vittu en tiä miks mutta ei kyllä kiinnostakkaan

  h3 {
    text-align: center;
    margin: 0 6px;
    padding: 4px;
    background: var(--black-2);
    border-radius: 10px;
    margin-bottom: 6px;
  }
  .heat-list {
    list-style: none;
    margin: auto;
    padding: 0 10px;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    gap: 6px;
    height: 100%;

    .heat {
      list-style: none;
      margin: 0;
      padding: 6px;
      background: var(--black-2);
      border-radius: 10px;
      min-width: 100px;

      .heat-number {
        text-align: center;
        font-weight: bold;
      }

      p {
        margin: 6px;
        font-size: 13px;
        text-align: center;

      }
      .driver {
        border: 1px solid var(--white-1);
        border-radius: 10px;
        position: relative;

        &.winner {
          border: 1px solid var(--green-1);
          background: var(--green-1-50);
          color: var(--black-dark);
        }

        &.clown {
          &:before {
            content: "🤡";
            position: absolute;
            top: -8px;
            right: -8px;
          }
        }
      }
    }
  }
}
</style>
