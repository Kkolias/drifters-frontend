<template>
  <div class="component-BracketColumnFinal">
    <div class="flex-container" :class="{ 'one-column': !hasHeat3 }">
      <ul class="heat-list">
        <li class="heat" @click="showHeat(getHeatForNumber(1))">
          <h3>Top 1 vs Top 4</h3>
          <div class="heat-wrapper">
            <div
              class="lead driver"
              :class="{
                winner: isWinnerOfHeat(getHeatForNumber(1), 'driver1'),
              }"
            >
              <p>
                {{ getDriver(getHeatForNumber(1).driver1) }}
              </p>
            </div>
            <div class="heat-number">
              <p>Heat 1</p>
            </div>
            <div
              class="chase driver"
              :class="{
                winner: isWinnerOfHeat(getHeatForNumber(1), 'driver2'),
              }"
            >
              <p>
                {{ getDriver(getHeatForNumber(1).driver2) }}
              </p>
            </div>
          </div>
        </li>
        <li class="heat" @click="showHeat(getHeatForNumber(2))">
          <h3>Top 2 vs Top 3</h3>
          <div class="heat-wrapper bronze">
            <div
              class="lead driver"
              :class="{
                winner: isWinnerOfHeat(getHeatForNumber(2), 'driver1'),
              }"
            >
              <p>
                {{ getDriver(getHeatForNumber(2).driver1) }}
              </p>
            </div>
            <div class="heat-number">
              <p>Heat 2</p>
            </div>
            <div
              class="chase driver"
              :class="{
                winner: isWinnerOfHeat(getHeatForNumber(2), 'driver2'),
              }"
            >
              <p>
                {{ getDriver(getHeatForNumber(2).driver2) }}
              </p>
            </div>
          </div>
        </li>
      </ul>
      <ul class="heat-list" v-if="!!hasHeat3">
        <li class="heat" @click="showHeat(getHeatForNumber(3))">
          <h3>Showdown {{ textContent.final }}</h3>
          <div class="heat-wrapper final">
            <div
              class="lead driver"
              :class="{
                winner: isWinnerOfHeat(getHeatForNumber(3), 'driver1'),
              }"
            >
              <p>
                {{ getDriver(getHeatForNumber(3).driver1) }}
              </p>
            </div>
            <div class="heat-number">
              <p>Heat 3</p>
            </div>
            <div
              class="chase driver"
              :class="{
                winner: isWinnerOfHeat(getHeatForNumber(3), 'driver2'),
              }"
            >
              <p>
                {{ getDriver(getHeatForNumber(3).driver2) }}
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
  // lisää prefix mistä luvusta aloitetaan runListissä bracketNumberina
  computed: {
    textContent() {
      return this.getTranslation(translations);
    },
    hasHeat3(): boolean {
      const heat3 = this.getHeatForNumber(3);
      return !!heat3?._id;
    },
  },
  methods: {
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
    }
  }
}
</style>
