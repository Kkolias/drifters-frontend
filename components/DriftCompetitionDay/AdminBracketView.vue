<template>
  <div class="component-AdminBracketView">
    <!-- <pre>
        {{ heatListTop16Left }}
    </pre> -->
    <div class="bracket-container">
      <div class="top-thirty-two">
        <DriftCompetitionDayAdminBracketColumn
          :competitionDayId="competitionDayId"
          :heatList="heatListTop32Left"
          :allDriversList="allDriversList"
          :runListLength="8"
          :firstHeatNumber="1"
          title="Top 32"
          @reload="reload()"
        />
      </div>
      <div class="top-sexteen">
        <DriftCompetitionDayAdminBracketColumn
          :competitionDayId="competitionDayId"
          :heatList="heatListTop16Left"
          :allDriversList="allDriversList"
          :runListLength="4"
          :firstHeatNumber="17"
          title="Top 16"
          @reload="reload()"
        />
      </div>
      <div class="top-eight">
        <DriftCompetitionDayAdminBracketColumn
          :competitionDayId="competitionDayId"
          :heatList="heatListTop8Left"
          :allDriversList="allDriversList"
          :runListLength="2"
          :firstHeatNumber="25"
          title="Top 8"
          @reload="reload()"
        />
      </div>
      <div class="top-four">
        <DriftCompetitionDayAdminBracketColumn
          :competitionDayId="competitionDayId"
          :heatList="heatListTop4Left"
          :allDriversList="allDriversList"
          :runListLength="1"
          :firstHeatNumber="29"
          title="Top 4"
          @reload="reload()"
        />
      </div>
      <div class="final">
        <DriftCompetitionDayAdminBracketColumnFinal
          :competitionDayId="competitionDayId"
          :heatList="heatListFinalAndBronze"
          :allDriversList="allDriversList"
          @reload="reload()"
        />
      </div>

      <div class="top-four">
        <DriftCompetitionDayAdminBracketColumn
          :competitionDayId="competitionDayId"
          :heatList="heatListTop4Right"
          :allDriversList="allDriversList"
          :runListLength="1"
          :firstHeatNumber="30"
          title="Top 4"
          @reload="reload()"
        />
      </div>
      <div class="top-eight">
        <DriftCompetitionDayAdminBracketColumn
          :competitionDayId="competitionDayId"
          :heatList="heatListTop8Right"
          :allDriversList="allDriversList"
          :runListLength="2"
          :firstHeatNumber="27"
          title="Top 8"
          @reload="reload()"
        />
      </div>
      <div class="top-sexteen">
        <DriftCompetitionDayAdminBracketColumn
          :competitionDayId="competitionDayId"
          :heatList="heatListTop16Right"
          :allDriversList="allDriversList"
          :runListLength="4"
          :firstHeatNumber="21"
          title="Top 16"
          @reload="reload()"
        />
      </div>
      <div class="top-thirty-two">
        <DriftCompetitionDayAdminBracketColumn
          :competitionDayId="competitionDayId"
          :heatList="heatListTop32Right"
          :allDriversList="allDriversList"
          :runListLength="8"
          :firstHeatNumber="9"
          title="Top 32"
          @reload="reload()"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { HeatType } from "~/enums/heat-type.enum";
import type {
  ICompetitionDay,
  IHeat,
} from "~/interfaces/competition-day.interface";
import type { IDriver } from "~/interfaces/driver.interface";

export default {
  props: {
    competitionDayItem: {
      type: Object as PropType<ICompetitionDay | null>,
      default: () => null,
    },
    allDriversList: {
      type: Array as PropType<IDriver[]>,
      default: () => [],
    },
  },
  computed: {
    competitionDayId(): string {
      return this.competitionDayItem?._id || "";
    },
    heatList(): IHeat[] {
      return this.competitionDayItem?.heatList || [];
    },
    heatListTop32Sorted(): IHeat[] {
      const heatList =
        this.heatList.filter((heat) => heat.heatType === HeatType.top32) || [];
      return heatList.sort((a, b) => a?.bracketNumber - b.bracketNumber);
    },
    heatListTop32Left(): IHeat[] {
      // returns first 8 of heatListTop32Sorted
      return this.heatListTop32Sorted.slice(0, 8);
    },
    heatListTop32Right(): IHeat[] {
      // returns last 8 of heatListTop32Sorted
      return this.heatListTop32Sorted.slice(8, 16);
    },
    heatListTop16Sorted(): IHeat[] {
      const heatList = this.heatList.filter(
        (heat) => heat.heatType === HeatType.top16
      );
      return heatList.sort((a, b) => a?.bracketNumber - b.bracketNumber);
    },
    heatListTop16Left(): IHeat[] {
      return this.heatListTop16Sorted.slice(0, 4);
    },
    heatListTop16Right(): IHeat[] {
      return this.heatListTop16Sorted.slice(4, 8);
    },
    heatListTop8Sorted(): IHeat[] {
      const heatList = this.heatList.filter(
        (heat) => heat.heatType === HeatType.top8
      );
      return heatList.sort((a, b) => a?.bracketNumber - b.bracketNumber);
    },
    heatListTop8Left(): IHeat[] {
      return this.heatListTop8Sorted.slice(0, 2);
    },
    heatListTop8Right(): IHeat[] {
      return this.heatListTop8Sorted.slice(2, 4);
    },
    heatListTop4Sorted(): IHeat[] {
      const heatList = this.heatList.filter(
        (heat) => heat.heatType === HeatType.top4
      );
      return heatList.sort((a, b) => a?.bracketNumber - b.bracketNumber);
    },
    heatListTop4Left(): IHeat[] {
      return this.heatListTop4Sorted.slice(0, 1);
    },
    heatListTop4Right(): IHeat[] {
      return this.heatListTop4Sorted.slice(1, 2);
    },
    heatListFinalAndBronze(): IHeat[] {
      return this.heatList?.filter(
        (heat) =>
          heat.heatType === HeatType.final || heat.heatType === HeatType.bronze
      ) || [];
    },
  },
  methods: {
    reload(): void {
      this.$emit("reload");
    },
  },
};
</script>

<style lang="less" scoped>
.component-AdminBracketView {
  .bracket-container {
    display: grid;
    grid-template-columns: repeat(9, 1fr);
    align-items: space-between;
  }
}
</style>
