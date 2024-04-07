<template>
  <div class="component-AdminBracketView">
    <!-- <pre>
        {{ heatListTop32Sorted }}
    </pre> -->
    <DriftCompetitionDayAdminBracketColumn
      :heatList="heatListTop32Sorted"
      :allDriversList="allDriversList"
      :runListLength="8"
    />
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
  },
};
</script>

<style lang="less" scoped>
.component-AdminBracketView {
}
</style>
