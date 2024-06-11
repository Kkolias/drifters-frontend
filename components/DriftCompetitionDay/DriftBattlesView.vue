<template>
  <div class="component-DriftCompetitionDayView">
    <LoadingIndicator v-if="isLoading" />
    <h3>{{ battlesDate }}</h3>
    <div class="buttons-wrapper" v-if="!!scoreboard?.length">
      <button
        class="bracket-icon"
        :class="[showBracket ? 'primary' : 'secondary']"
        @click="setShowBracket(true)"
      >
        Bracket
      </button>
      <button
        class="list-icon"
        :class="[!showBracket ? 'primary' : 'secondary']"
        @click="setShowBracket(false)"
      >
        Lista
      </button>
      <!-- <button
        class="blank bracket-icon"
        :class="{ selected: showBracket }"
        @click="setShowBracket(true)"
      ></button>
      <button
        class="blank list-icon"
        :class="{ selected: !showBracket }"
        @click="setShowBracket(false)"
      ></button> -->
    </div>

    <DriftCompetitionDayBracketView
      v-if="competitionDay && showBracket"
      :competitionDayItem="competitionDay"
      :allDriversList="parsedAllDriversList"
      :loadingDrivers="loadingDrivers"
    />
    <DriftCompetitionDayScoreBoard
      v-if="!!scoreboard?.length && !showBracket"
      :scoreboard="scoreboard"
      :driftSerie="driftSerie"
    />
  </div>
</template>

<script lang="ts">
import type { DriftSerie } from "~/enums/drift-serie.enum";
import type {
  ICompetitionDay,
  IScoreBoardItem,
} from "~/interfaces/competition-day.interface";
import type { IDriver } from "~/interfaces/driver.interface";

interface IData {
  showBracket: boolean;
}
export default {
  props: {
    competitionDay: {
      type: Object as PropType<ICompetitionDay>,
      required: true,
    },
    allDriversList: {
      type: Array as PropType<IDriver[]>,
      default: () => [],
    },
    loadingDrivers: {
      type: Boolean,
      default: false,
    },
    loadingCompetitionDay: {
      type: Boolean,
      default: false,
    },
    driftSerie: {
      type: String as PropType<DriftSerie | null>,
      default: null,
    },
  },
  data: (): IData => ({
    showBracket: true,
  }),
  computed: {
    scoreboard(): IScoreBoardItem[] {
      return this.competitionDay?.scoreBoard || [];
    },
    isLoading(): boolean {
      return this.loadingCompetitionDay || this.loadingDrivers;
    },
    battlesDate(): string {
      const date = this.competitionDay?.date || "";
      if (!date) return "";
      return `Päivämäärä: ${formatISODateToStringShort(date)}`;
    },
    eventName(): string {
      return this.competitionDay?.event?.name || "";
    },
    parsedAllDriversList(): IParsedDriver[] {
      return parsedDriverList(this.allDriversList);
    },
  },
  methods: {
    setShowBracket(val: boolean): void {
      this.showBracket = val;
    },
  },
};
</script>

<style lang="less" scoped>
.component-DriftCompetitionDayView {
  h1 {
    font-size: 3rem;
    text-align: center;
    margin-bottom: 8px;
    color: var(--green-1);
  }
  h3 {
    margin: 0;
    font-size: 1.8rem;
    text-align: center;
    margin-bottom: 16px;

    .dates {
      margin-left: 8px;
      font-size: 1.4rem;
      font-weight: 400;
      color: var(--grey-1);
    }
  }

  .buttons-wrapper {
    display: flex;
    justify-content: flex-start;
    gap: 20px;
    margin: auto;
    margin-bottom: 20px;
    max-width: 1400px;

    // .blank {
    // width: 48px;
    // height: 28px;
    // transition: all 0.25s ease-in-out;

    // &.bracket-icon {
    //   background: url("~/assets/svg/bracket-icon-unselected.svg") no-repeat
    //     center;
    //   background-size: 44px 24px;

    //   &.selected {
    //     background: url("~/assets/svg/bracket-icon.svg") no-repeat center;
    //   }
    // }
    // &:hover {
    //  &.bracket-icon {
    //   background-size: 46px 26px;
    //  }
    //   // transform: scale(1.1);
    // }

    // &.list-icon {
    //   background: url("~/assets/svg/list-icon-unselected.svg") no-repeat
    //     center;
    //   background-size: 44px 24px;
    //   &.selected {
    //     background: url("~/assets/svg/list-icon.svg") no-repeat center;
    //   }
    // }
    // }
  }
  margin-bottom: 100px;
}
</style>
