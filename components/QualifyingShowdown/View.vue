<template>
  <div class="component-BracketView">
    <p class="subtitle">
      {{ textContent.previewText }}
    </p>
    <p class="subtitle">
      {{ textContent.pointsText }}
    </p>
    <p class="subtitle small">
      {{ textContent.moreInfo }}
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
import translations from "~/lang/components/QualifyingShowdownView.lang";
import Language from "~/mixins/language.vue";

export default {
  mixins: [Language],
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
    textContent() {
      return this.getTranslation(translations);
    },
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
