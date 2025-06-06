<template>
  <div class="component-BracketView">
    <p class="subtitle">{{ textContent.bracketText }}</p>
    <p class="subtitle small">
      {{ textContent.moreInfo }}
    </p>
    <!-- <pre>
          {{ heatListTop16Left }}
      </pre> -->
    <div class="scroll-container">
      <div class="bracket-container">
        <div class="top-thirty-two">
          <DriftCompetitionDayBracketColumn
            :competitionDayId="competitionDayId"
            :heatList="heatListTop32Left"
            :allDriversList="allDriversList"
            :runListLength="8"
            :firstHeatNumber="1"
            title="Top 32"
            @showHeat="showHeat"
          />
        </div>
        <div class="top-sexteen">
          <DriftCompetitionDayBracketColumn
            :competitionDayId="competitionDayId"
            :heatList="heatListTop16Left"
            :allDriversList="allDriversList"
            :runListLength="4"
            :firstHeatNumber="17"
            title="Top 16"
            @showHeat="showHeat"
          />
        </div>
        <div class="top-eight">
          <DriftCompetitionDayBracketColumn
            :competitionDayId="competitionDayId"
            :heatList="heatListTop8Left"
            :allDriversList="allDriversList"
            :runListLength="2"
            :firstHeatNumber="25"
            title="Top 8"
            @showHeat="showHeat"
          />
        </div>
        <div class="top-four">
          <DriftCompetitionDayBracketColumn
            :competitionDayId="competitionDayId"
            :heatList="heatListTop4Left"
            :allDriversList="allDriversList"
            :runListLength="1"
            :firstHeatNumber="29"
            title="Top 4"
            @showHeat="showHeat"
          />
        </div>
        <div class="final">
          <DriftCompetitionDayBracketColumnFinalBronze
            :competitionDayId="competitionDayId"
            :heatList="heatListFinalAndBronze"
            :allDriversList="allDriversList"
            @showHeat="showHeat"
          />
        </div>

        <div class="top-four">
          <DriftCompetitionDayBracketColumn
            :competitionDayId="competitionDayId"
            :heatList="heatListTop4Right"
            :allDriversList="allDriversList"
            :runListLength="1"
            :firstHeatNumber="30"
            title="Top 4"
            @showHeat="showHeat"
          />
        </div>
        <div class="top-eight">
          <DriftCompetitionDayBracketColumn
            :competitionDayId="competitionDayId"
            :heatList="heatListTop8Right"
            :allDriversList="allDriversList"
            :runListLength="2"
            :firstHeatNumber="27"
            title="Top 8"
            @showHeat="showHeat"
          />
        </div>
        <div class="top-sexteen">
          <DriftCompetitionDayBracketColumn
            :competitionDayId="competitionDayId"
            :heatList="heatListTop16Right"
            :allDriversList="allDriversList"
            :runListLength="4"
            :firstHeatNumber="21"
            title="Top 16"
            @showHeat="showHeat"
          />
        </div>
        <div class="top-thirty-two">
          <DriftCompetitionDayBracketColumn
            :competitionDayId="competitionDayId"
            :heatList="heatListTop32Right"
            :allDriversList="allDriversList"
            :runListLength="8"
            :firstHeatNumber="9"
            title="Top 32"
            @showHeat="showHeat"
          />
        </div>
      </div>
      <DriftCompetitionDayBracketBattleOverview
        v-if="selectedHeatItem"
        :heatItem="selectedHeatItem"
        @close="closeHeatModal()"
      />
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
import Language from "~/mixins/language.vue";

const translations = {
  fi: {
    bracketText: "Tulokset kaavio muodossa.",
    moreInfo:
      "Näet parien tarkemmat tulokset valitsemalla haluamasi heatin. UUTTA: Näet nyt myös kuljettajien voitto jakauman klikkaamalla haluamasi heatin!",
  },
  en: {
    bracketText: "Results in bracket format.",
    moreInfo:
      "You can see more detailed results by selecting the heat you want. NEW: You can now also see the drivers' win distribution by clicking on the heat you want!",
  },
};

export default {
  mixins: [Language],
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
  data: () => ({
    heatList: [] as IHeat[],
  }),
  computed: {
    textContent() {
      return this.getTranslation(translations);
    },
    selectedHeatItem(): IHeat | null {
      const selectedHeatId = this.$route?.query?.["heat"];

      const match =
        this.heatList?.find((heat) => heat?._id === selectedHeatId) || null;
      return match;
    },
    competitionDayId(): string {
      return this.competitionDayItem?._id || "";
    },
    initialHeatList(): IHeat[] {
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
      return (
        this.heatList?.filter(
          (heat) =>
            heat.heatType === HeatType.final ||
            heat.heatType === HeatType.bronze
        ) || []
      );
    },
  },
  mounted() {
    this.heatList = this.initialHeatList || [];
    this.$socket.on("bracket-results:updated", (data) => {
      const heatList = data?.competitionDay?.heatList || [];
      if (heatList?.length) {
        this.heatList = heatList;
      }
    });
  },
  methods: {
    closeHeatModal(): void {
      this.$router.push({
        hash: this.$route.hash,
        query: {
          ...this.$route.query,
          heat: "",
        },
      });
    },
    showHeat(id: string): void {
      this.$router.push({
        hash: this.$route.hash,
        query: { ...this.$route.query, heat: id },
      });
    },
  },
};
</script>

<style lang="less" scoped>
.component-BracketView {
  .subtitle {
    max-width: 700px;
    margin: auto;
    margin-bottom: 24px;

    &.small {
      margin-bottom: 18px;
      font-size: 16px;
    }
  }
  .bracket-container {
    display: grid;
    grid-template-columns: repeat(9, 1fr);
    overflow-x: auto;
    max-width: 1400px;
    margin: auto;
  }
  .scroll-container {
    touch-action: pinch-zoom;
  }
}
</style>
