<template>
  <div class="component-BracketColumnFinal">
    <div class="flex-container" :class="{ 'one-column': !hasHeat3 }">
      <ul class="heat-list">
        <li
          class="heat"
          @click="showHeat(heat1)"
          :class="{ changed: changedHeatId === getHeatId(heat1) }"
        >
          <h3>Top 1 vs Top 4</h3>
          <div class="heat-wrapper">
            <div v-if="isOmtNeeded(heat1)" class="omt-indicator">
              <span>OMT</span>
            </div>
            <div
              class="lead driver"
              :class="{
                winner: isWinnerOfHeat(heat1, 'driver1'),
              }"
            >
              <p>
                {{ getDriver(heat1.driver1) }}
              </p>
            </div>
            <div class="heat-number">
              <p>Heat 1</p>
            </div>
            <div
              class="chase driver"
              :class="{
                winner: isWinnerOfHeat(heat1, 'driver2'),
              }"
            >
              <p>
                {{ getDriver(heat1.driver2) }}
              </p>
            </div>
          </div>
        </li>
        <li
          class="heat"
          @click="showHeat(heat2)"
          :class="{ changed: changedHeatId === getHeatId(heat2) }"
        >
          <h3>Top 2 vs Top 3</h3>
          <div class="heat-wrapper bronze">
            <div v-if="isOmtNeeded(heat2)" class="omt-indicator">
              <span>OMT</span>
            </div>
            <div
              class="lead driver"
              :class="{
                winner: isWinnerOfHeat(heat2, 'driver1'),
              }"
            >
              <p>
                {{ getDriver(heat2.driver1) }}
              </p>
            </div>
            <div class="heat-number">
              <p>Heat 2</p>
            </div>
            <div
              class="chase driver"
              :class="{
                winner: isWinnerOfHeat(heat2, 'driver2'),
              }"
            >
              <p>
                {{ getDriver(heat2.driver2) }}
              </p>
            </div>
          </div>
        </li>
      </ul>
      <ul class="heat-list" v-if="!!hasHeat3">
        <li
          class="heat"
          @click="showHeat(heat3)"
          :class="{ changed: changedHeatId === getHeatId(heat3) }"
        >
          <h3>Showdown {{ textContent.final }}</h3>
          <div class="heat-wrapper final">
            <div v-if="isOmtNeeded(heat3)" class="omt-indicator">
              <span>OMT</span>
            </div>
            <div
              class="lead driver"
              :class="{
                winner: isWinnerOfHeat(heat3, 'driver1'),
              }"
            >
              <p>
                {{ getDriver(heat3.driver1) }}
              </p>
            </div>
            <div class="heat-number">
              <p>Heat 3</p>
            </div>
            <div
              class="chase driver"
              :class="{
                winner: isWinnerOfHeat(heat3, 'driver2'),
              }"
            >
              <p>
                {{ getDriver(heat3.driver2) }}
              </p>
            </div>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script lang="ts">
import type { PropType } from "vue";
import type { IDriver } from "~/interfaces/driver.interface";
import type { IShowdownHeat } from "~/interfaces/qualifying-showdown.interface";
import Language from "~/mixins/language.vue";
import { getWinnerIdOfHeat } from "~/utils/getWinnerOfHeat";

const translations = {
  fi: {
    final: "Finaali",
  },
  en: {
    final: "Final",
  },
};

export default {
  mixins: [Language],
  props: {
    heatList: {
      type: Array as PropType<IShowdownHeat[]>,
      default: () => [],
    },
    allDriversList: {
      type: Array as PropType<IDriver[]>,
      default: () => [],
    },
  },
  data: () => ({
    currentHeatList: [] as IShowdownHeat[],

    lastHeatList: [] as IShowdownHeat[],
    changedHeatId: null as string | null,
  }),
  // lisää prefix mistä luvusta aloitetaan runListissä bracketNumberina
  computed: {
    textContent() {
      return this.getTranslation(translations);
    },
    hasHeat3(): boolean {
      const heat3 = this.getHeatForNumber(3);
      return !!heat3?._id;
    },
    heat1() {
      return this.getHeatForNumber(1);
    },
    heat2() {
      return this.getHeatForNumber(2);
    },
    heat3() {
      return this.getHeatForNumber(3);
    },
  },
  mounted() {
    this.currentHeatList = this.heatList || [];
    this.lastHeatList = [...this.currentHeatList];
    this.$socket.on("qualifying-showdown:updated", (data) => {
      const heatList = data?.updatedResults?.heatList || [];
      this.currentHeatList = heatList;
      this.handleUpdatedHeat();
    });
  },

  methods: {
    handleUpdatedHeat() {
      const changedHeat = this.currentHeatList?.find((heat) => {
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

      this.lastHeatList = [...this.currentHeatList];
    },
    showHeat(heat: IShowdownHeat) {
      this.$emit("showHeat", heat?._id);
    },
    isWinnerOfHeat(heat: IShowdownHeat, driverType: string): boolean {
      const driver1 = heat?.driver1;
      const driver2 = heat?.driver2;
      if (!driver1 || !driver2) return false;
      const driverId = driverType === "driver1" ? driver1 : driver2;

      const winnerId = getWinnerIdOfHeat(heat);
      return winnerId === driverId;
    },
    getHeatId(heat): string {
      return heat ? heat._id : "";
    },
    getHeatForNumber(number: number): any {
      return (
        this.currentHeatList.find((heat) => heat.bracketNumber === number) || {
          driver1: "",
          driver2: "",
        }
      );
    },
    getDriver(driverProp: any): string {
      if (!driverProp) return "";
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
    isOmtNeeded(heat: IShowdownHeat): boolean {
      const lastRun = heat?.runList?.[heat.runList.length - 1];
      if (!lastRun) return false;

      const judgePointsNotGiven =
        !lastRun.judgePoint1 && !lastRun.judgePoint2 && !lastRun.judgePoint3;

      return lastRun?.type === "omt" && judgePointsNotGiven;
    },
  },
};
</script>

<style lang="less" scoped>
.component-BracketColumnFinal {
  height: 100%;

  .flex-container {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    margin: auto;

    &.one-column {
      grid-template-columns: 1fr;
    }

    @media only screen and (max-width: 500px) {
      grid-template-columns: 1fr;
    }
  }

  .heat-list {
    width: 180px;
    list-style: none;
    margin: auto;
    padding: 0 10px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: 30px;
    height: 100%;

    .heat {
      &:first-child {
        margin-top: 42px;
      }
      h3 {
        text-align: center;
        margin: 0;
        padding: 10px;
        // border-radius: 10px 10px 0 0;
      }
      .heat-wrapper {
        list-style: none;
        margin: 0;
        padding: 6px;
        background: var(--black-2);
        border-radius: 10px;
        min-width: 100px;
        position: relative;

        .omt-indicator {
          position: absolute;
          top: -10px;
          left: -15px;
          width: 40px;
          height: 30px;
          background-color: var(--green-1);
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--black-1);
          font-weight: bold;
          font-size: 14px;
          border-radius: 5px;
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
          background: var(--black-2);
          color: var(--white-1);

          &.winner {
            border: 1px solid var(--green-1);
            background: var(--green-1-50);
            color: var(--black-dark);
          }
        }

        &.final {
          background: var(--white-2);
          color: var(--black-dark);

          .driver {
            border: 1px solid var(--black-dark);
          }
        }
      }

      &.changed {
        .heat-wrapper {
          .winner {
            animation: indicateWinnerFlash 3s ease-in-out forwards;
          }

          .omt-indicator {
            animation: indicateOMTFlash 3s ease-in-out forwards;
          }
        }
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
</style>
