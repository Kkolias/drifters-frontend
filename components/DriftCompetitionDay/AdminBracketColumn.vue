<template>
  <div class="component-AdminBracketColumn">
    <h3>{{ title }}</h3>
    <ul class="heat-list">
      <li
        v-for="number in heatNumberList"
        :key="number"
        class="heat"
        @click="setSelectedHeat(getHeatForNumber(number))"
      >
        <div class="lead driver" :class="{ winner: isWinnerOfHeat(getHeatForNumber(number), 'driver1')}">
          <p>
            {{ getDriver(getHeatForNumber(number).driver1) }}
          </p>
        </div>
        <div class="heat-number">
          <p>Heat {{ number }}</p>
        </div>
        <div class="chase driver" :class="{ winner: isWinnerOfHeat(getHeatForNumber(number), 'driver2')}">
          <p>
            {{ getDriver(getHeatForNumber(number).driver2) }}
          </p>
        </div>
      </li>
    </ul>

    <DriftCompetitionDayAdminHeatJudgetModal
      v-if="selectedHeat"
      :competitionDayId="competitionDayId"
      :heat="(selectedHeat as IHeat)"
      :allDriversList="allDriversList"
      @close="setSelectedHeat(null)"
      @reload="reload()"
    />
  </div>
</template>

<script lang="ts">
import type { PropType } from "vue";
import type { IHeat } from "~/interfaces/competition-day.interface";
import type { IDriver } from "~/interfaces/driver.interface";
import { getWinnerIdOfHeat } from "~/utils/getWinnerOfHeat";

interface IData {
  selectedHeat: IHeat | null;
}

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
  data: (): IData => ({
    selectedHeat: null,
  }),
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
    isWinnerOfHeat(heat: IHeat, driverType: string): boolean {
      const driverId = driverType === 'driver1' ? heat.driver1 : heat.driver2

      const winnerId = getWinnerIdOfHeat(heat)
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
    getDriver(driverId: string): string {
      if (this.runListLength === 4) {
        console.log(driverId);
      }
      const driver =
        this.allDriversList.find((d) => d._id === driverId) || null;
      return driver ? `${driver.firstName} ${driver.lastName}` : "N/A";
    },
    getBracketNumber(heat: IHeat): string {
      return `Heat ${heat?.bracketNumber ?? 0 + this.firstHeatNumber}`;
    },
    setSelectedHeat(heat: IHeat | null): void {
      this.selectedHeat = heat;
    },
    reload(): void {
      this.$emit("reload");
    },
  },
};
</script>

<style lang="less" scoped>
.component-AdminBracketColumn {
  height: 100%;

  h3 {
    text-align: center;
    margin: 0;
    padding: 10px;
    background: var(--black-2);
    // border-radius: 10px 10px 0 0;
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

        &.winner {
          border: 1px solid var(--green-1);
          background: var(--green-1-50);
          color: var(--black-dark);
        }
      }
    }
  }
}
</style>
