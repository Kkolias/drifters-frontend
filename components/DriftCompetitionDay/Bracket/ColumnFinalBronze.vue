<template>
  <div class="component-BracketColumnFinal">
    <ul class="heat-list">
      <li class="heat">
        <h3>Finaali</h3>
        <div class="heat-wrapper final">
          <div
            class="lead driver"
            :class="{ winner: isWinnerOfHeat(getHeatForNumber(32), 'driver1') }"
          >
            <p>
              {{ getDriver(getHeatForNumber(32).driver1) }}
            </p>
          </div>
          <div class="heat-number">
            <p>Heat 32</p>
          </div>
          <div
            class="chase driver"
            :class="{ winner: isWinnerOfHeat(getHeatForNumber(32), 'driver2') }"
          >
            <p>
              {{ getDriver(getHeatForNumber(32).driver2) }}
            </p>
          </div>
        </div>
      </li>
      <li class="heat">
        <h3>Pronssi</h3>
        <div class="heat-wrapper bronze">
          <div
            class="lead driver"
            :class="{ winner: isWinnerOfHeat(getHeatForNumber(31), 'driver1') }"
          >
            <p>
              {{ getDriver(getHeatForNumber(31).driver1) }}
            </p>
          </div>
          <div class="heat-number">
            <p>Heat 32</p>
          </div>
          <div
            class="chase driver"
            :class="{ winner: isWinnerOfHeat(getHeatForNumber(31), 'driver2') }"
          >
            <p>
              {{ getDriver(getHeatForNumber(31).driver2) }}
            </p>
          </div>
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
  },
  // lisää prefix mistä luvusta aloitetaan runListissä bracketNumberina
  computed: {},
  methods: {
    isWinnerOfHeat(heat: IHeat, driverType: string): boolean {
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

  .heat-list {
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
