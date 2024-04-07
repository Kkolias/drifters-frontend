<template>
  <div class="component-AdminBracketView">
    <!-- <pre>
        {{ heatListTop32Sorted }}
    </pre> -->
    <div class="bracket-container">
      <div class="top-thirty-two">
        <DriftCompetitionDayAdminBracketColumn
          :heatList="heatListTop32Left"
          :allDriversList="allDriversList"
          :runListLength="8"
        />
      </div>
      <div class="top-sexteen">
        <DriftCompetitionDayAdminBracketColumn
          :heatList="[]"
          :allDriversList="allDriversList"
          :runListLength="4"
        />
      </div>
      <div class="top-eight">
        <DriftCompetitionDayAdminBracketColumn
          :heatList="[]"
          :allDriversList="allDriversList"
          :runListLength="2"
        />
      </div>
      <div class="top-four">
        <DriftCompetitionDayAdminBracketColumn
          :heatList="[]"
          :allDriversList="allDriversList"
          :runListLength="1"
        />
      </div>
      <div class="final"></div>

      <div class="top-four">
        <DriftCompetitionDayAdminBracketColumn
          :heatList="[]"
          :allDriversList="allDriversList"
          :runListLength="1"
        />
      </div>
      <div class="top-eight">
        <DriftCompetitionDayAdminBracketColumn
          :heatList="[]"
          :allDriversList="allDriversList"
          :runListLength="2"
        />
      </div>
      <div class="top-sexteen">
        <DriftCompetitionDayAdminBracketColumn
          :heatList="[]"
          :allDriversList="allDriversList"
          :runListLength="4"
        />
      </div>
      <div class="top-thirty-two">
        <DriftCompetitionDayAdminBracketColumn
          :heatList="heatListTop32Right"
          :allDriversList="allDriversList"
          :runListLength="8"
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
