<template>
  <div class="component-AdminBracketColumn">
    <ul class="heat-list">
      <li v-for="number in runListLength" :key="number" class="heat">
        <div class="lead driver">
          <p>
            {{ getDriver(getHeatForNumber(number).driver1) }}
          </p>
        </div>
        <div class="heat-number">
          <p>{{ getBracketNumber(getHeatForNumber(number)) }}</p>
        </div>
        <div class="chase driver">
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

export default {
  props: {
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
  },
  computed: {
    firstHeatNumber(): number {
      return this.heatList[0]?.bracketNumber || 0;
    },
  },
  methods: {
    getHeatForNumber(number: number): any {
      return (
        this.heatList.find((heat) => heat.bracketNumber === number) || {
          driver1: "",
          driver2: "",
        }
      );
    },
    getDriver(driverId: string): string {
        console.log({a: this.allDriversList, b: driverId})
      const driver =
        this.allDriversList.find((d) => d._id === driverId) || null;
      return driver ? `${driver.firstName} ${driver.lastName}` : "N/A";
    },
    getBracketNumber(heat: IHeat): string {
      return `Heat ${heat?.bracketNumber ?? 0 + this.firstHeatNumber}`;
    },
  },
};
</script>

<style lang="less" scoped>
.component-AdminBracketColumn {
  height: 100%;
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

      // &:nth-child(odd) {
      //   margin-top: 12px;
      //   position: relative;

      //   &:before {
      //     content: "";
      //     position: absolute;
      //     left: calc(100% + 17px);
      //     top: 50%;
      //     width: 15px;
      //     height: 99%;
      //     border-top: 2px solid var(--white-1);
      //     border-right: 2px solid var(--white-1);
      //     border-radius: 0 10px 0 0;
      //     transform: translateX(-100%);
      //   }
      // }

      // &:nth-child(even) {
      //   position: relative;

      //   &:before {
      //     content: "";
      //     position: absolute;
      //     left: calc(100% + 17px);
      //     bottom: 50%;
      //     width: 15px;
      //     height: 99%;
      //     border-bottom: 2px solid var(--white-1);
      //     border-right: 2px solid var(--white-1);
      //     border-radius: 0 0 10px 0;
      //     transform: translateX(-100%);
      //   }
      // }

      .heat-number {
        text-align: center;
        font-weight: bold;
      }

      p {
        margin: 6px;
        font-size: 14px;
      }
      .driver {
        border: 1px solid var(--white-1);
        border-radius: 10px;

      }
    }
  }
}
</style>
