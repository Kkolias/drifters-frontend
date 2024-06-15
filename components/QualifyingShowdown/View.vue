<template>
  <div class="component-BracketView">
    <p class="subtitle">
      Qualifying Showdown on Drift Masters European Championship -sarjan uusi
      osio, jossa lajittelun top 4 kuskit ottavat mittaa toisistaan kahtena
      parina.
    </p>
    <p class="subtitle">
      Parhaalle jaossa on 4 mestaruuspistettä, toiselle 3, kolmannelle 2 ja
      neljännelle 1.
    </p>
    <p class="subtitle small">
      Näet tarkemmat tulokset valitsemalla haluamasi heatin.
    </p>
    <!-- <pre>
            {{ heatListTop16Left }}
        </pre> -->
    <div class="scroll-container">
      <div class="bracket-container">
        <QualifyingShowdownBracketView
          :heatList="heatList"
          :allDriversList="allDriversList"
          @showHeat="showHeat"
        />
      </div>
      <DriftCompetitionDayBracketBattleOverview
        v-if="selectedHeatItem"
        :heatItem="selectedHeatItem"
        :isShowdown="true"
        @close="closeHeatModal()"
      />
    </div>
  </div>
</template>

<script lang="ts">
import type { IDriver } from "~/interfaces/driver.interface";
import type {
  IQualifyingShowdownItem,
  IShowdownHeat,
} from "~/interfaces/qualifying-showdown.interface";

export default {
  props: {
    qualifyingShowdown: {
      type: Object as PropType<IQualifyingShowdownItem | null>,
      default: () => null,
    },
    allDriversList: {
      type: Array as PropType<IDriver[]>,
      default: () => [],
    },
  },
  computed: {
    selectedHeatItem(): IShowdownHeat | null {
      const selectedHeatId = this.$route?.query?.["heat"];

      const match =
        this.heatList?.find((heat) => heat?._id === selectedHeatId) || null;

      if (!match) return null;

      const driver1 = this.allDriversList?.find(
        (d) => d._id === match?.driver1
      ) as IDriver;
      const driver2 = this.allDriversList?.find(
        (d) => d._id === match?.driver2
      ) as IDriver;

      return {
        ...match,
        driver1: driver1,
        driver2: driver2,
      };
    },
    heatList(): IShowdownHeat[] {
      return this.qualifyingShowdown?.heatList || [];
    },
  },
  methods: {
    closeHeatModal(): void {
      this.$router.push({
        query: {
          ...this.$route.query,
          heat: "",
        },
      });
    },
    showHeat(id: string): void {
      this.$router.push({ query: { ...this.$route.query, heat: id } });
    },
  },
};
</script>

<style lang="less" scoped>
.component-BracketView {
  .subtitle {
    max-width: 700px;
    margin: auto;
    margin-top: 18px;

    &.small {
      margin-top: 24px;
      font-size: 16px;
    }
  }
  .bracket-container {
    max-width: 400px;
    width: 100%;
    margin: auto;
  }
}
</style>
