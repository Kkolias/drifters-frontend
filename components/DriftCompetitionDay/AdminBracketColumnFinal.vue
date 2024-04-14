<template>
  <div class="component-AdminBracketColumnFinal">
    <ul class="heat-list">
      <li class="heat" @click="setSelectedHeat(getHeatForNumber(32))">
        <h3>Finaali</h3>
        <div class="heat-wrapper final">
          <div class="lead driver" :class="{ winner: isWinnerOfHeat(getHeatForNumber(32), 'driver1')}">
            <p>
              {{ getDriver(getHeatForNumber(32).driver1) }}
            </p>
          </div>
          <div class="heat-number">
            <p>Heat 32</p>
          </div>
          <div class="chase driver" :class="{ winner: isWinnerOfHeat(getHeatForNumber(32), 'driver2')}">
            <p>
              {{ getDriver(getHeatForNumber(32).driver2) }}
            </p>
          </div>
        </div>
      </li>
      <li class="heat" @click="setSelectedHeat(getHeatForNumber(31))">
        <h3>Pronssi</h3>
        <div class="heat-wrapper bronze">
          <div class="lead driver" :class="{ winner: isWinnerOfHeat(getHeatForNumber(31), 'driver1')}">
            <p>
              {{ getDriver(getHeatForNumber(31).driver1) }}
            </p>
          </div>
          <div class="heat-number">
            <p>Heat 32</p>
          </div>
          <div class="chase driver" :class="{ winner: isWinnerOfHeat(getHeatForNumber(31), 'driver2')}">
            <p>
              {{ getDriver(getHeatForNumber(31).driver2) }}
            </p>
          </div>
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
  data: (): IData => ({
    selectedHeat: null,
  }),
  // lisää prefix mistä luvusta aloitetaan runListissä bracketNumberina
  computed: {},
  methods: {
    isWinnerOfHeat(heat: IHeat, driverType: string): boolean {
      const driver1 = heat?.driver1;
      const driver2 = heat?.driver2;
      if (!driver1 || !driver2) return false;
      const driverId = driverType === "driver1" ? driver1 : driver2;

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
      const driver =
        this.allDriversList.find((d) => d._id === driverId) || null;
      return driver ? `${driver.firstName} ${driver.lastName}` : "N/A";
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
.component-AdminBracketColumnFinal {
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
