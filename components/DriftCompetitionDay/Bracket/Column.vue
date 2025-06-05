<template>
  <div class="component-BracketColumn">
    <!-- {{ heatList }} -->
    <h3>{{ title }}</h3>
    <ul class="heat-list">
      <li
        v-for="number in heatNumberList"
        :key="number"
        class="heat"
        :class="{
          changed: changedHeatId === getHeatId(getHeatForNumber(number)),
        }"
        @click="showHeat(getHeatForNumber(number))"
      >
        <div v-if="isOmtNeeded(getHeatForNumber(number))" class="omt-indicator">
          <span>OMT</span>
        </div>
        <div
          class="lead driver"
          :class="{
            winner: isWinnerOfHeat(getHeatForNumber(number), 'driver1'),
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
  data: () => ({
    changedHeatId: null as string | null,

    lastHeatList: [] as IHeat[],
  }),

  // lisää prefix mistä luvusta aloitetaan runListissä bracketNumberina
  computed: {
    heatNumberList(): number[] {
      return Array.from(
        { length: this.runListLength },
        (_, i) => i + this.firstHeatNumber
      );
    },
  },
  watch: {
    heatList() {
      if (this.lastHeatList?.length) {
        const changedHeat = this.heatList?.find((heat) => {
          const lastHeat = this.lastHeatList?.find((i) => i?._id === heat?._id);

          const differingRun = heat?.runList?.find((run) => {
            const lastRun = lastHeat?.runList?.find((i) => i?._id === run?._id);

            const judgePointsChanged =
              run?.judgePoint1 !== lastRun?.judgePoint1 ||
              run?.judgePoint2 !== lastRun?.judgePoint2 ||
              run?.judgePoint3 !== lastRun?.judgePoint3;

            return judgePointsChanged;
          });
          return differingRun;
        });

        if (changedHeat) {
          this.changedHeatId = changedHeat._id;
        } else {
          this.changedHeatId = null;
        }
      }
      this.lastHeatList = [...this.heatList];
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

      if (!driverId) return false;

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
      if (typeof driverProp === "string") {
        const driver =
          this.allDriversList.find((d) => d._id === (driverProp as string)) ||
          null;
        return driver ? `${driver.firstName} ${driver.lastName}` : "N/A";
      }
      const firstName = driverProp?.firstName ?? "";
      const lastName = driverProp?.lastName ?? "";

      const name = `${firstName} ${lastName}`;
      return name ?? "N/A";
    },

    getBracketNumber(heat: IHeat): string {
      return `Heat ${heat?.bracketNumber ?? 0 + this.firstHeatNumber}`;
    },
    isOmtNeeded(heat: IHeat): boolean {
      const lastRun = heat?.runList?.[heat.runList.length - 1];
      if (!lastRun) return false;

      const judgePointsNotGiven =
        !lastRun.judgePoint1 && !lastRun.judgePoint2 && !lastRun.judgePoint3;

      return lastRun?.type === "omt" && judgePointsNotGiven;
    },
    getHeatId(heat: IHeat): string {
      return heat?._id || "";
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
      position: relative;

      .omt-indicator {
        position: absolute;
        top: -5px;
        left: -5px;
        width: 30px;
        height: 20px;
        background-color: var(--green-1);
        display: flex;
        align-items: center;
        justify-content: center;
        color: var(--black-1);
        font-weight: bold;
        font-size: 0.7rem;
        border-radius: 5px;
        z-index: 3;
      }

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


      &.changed {
        .winner {
          animation: indicateWinnerFlash 3s ease-in-out forwards;
        }
        .omt-indicator {
          animation: indicateOMTFlash 3s ease-in-out forwards;
        }
      }

      @keyframes indicateWinnerFlash {
        0% {
          background-color: var(--green-1-50);
          color: var(--black-1);
        }
        25% {
          background-color: var(--black-2);
          color: var(--white-1);
        }
        50% {
          background-color: var(--green-1-50);
          color: var(--black-1);
        }
        75% {
          background-color: var(--black-2);
          color: var(--white-1);
        }
        100% {
          background-color: var(--green-1-50);
          color: var(--black-1);
        }
      }

      @keyframes indicateOMTFlash {
        0% {
          opacity: 1;
        }
        25% {
          opacity: 0;
        }
        50% {
          opacity: 1;
        }
        75% {
          opacity: 0;
        }
        100% {
          opacity: 1;
        }
      }
    }
  }
}
</style>
