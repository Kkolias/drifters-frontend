<template>
  <div class="component-DriftCompetitionDayView">
    <h1 v-if="!isLoading">{{ eventName }}</h1>
    <h3 v-if="!isLoading">
      Kisapäivä <span class="dates">{{ eventDates }}</span>
    </h3>
    <LoadingIndicator v-if="isLoading" />

    <div class="buttons-wrapper" v-if="!!scoreboard?.length">
      <button
        class="blank bracket-icon"
        :class="{ selected: showBracket }"
        @click="setShowBracket(true)"
      ></button>
      <button
        class="blank list-icon"
        :class="{ selected: !showBracket }"
        @click="setShowBracket(false)"
      ></button>
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
    />
  </div>
</template>

<script lang="ts">
import type {
  ICompetitionDay,
  IScoreBoardItem,
} from "~/interfaces/competition-day.interface";
import type { IDriver } from "~/interfaces/driver.interface";
import apiCompetitionDay from "~/utils/drifting/api-competition-day";

interface IData {
  competitionDay: ICompetitionDay | null;
  loading: boolean;

  showBracket: boolean;
}
export default {
  props: {
    qualifyingId: {
      type: String,
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
  },
  data: (): IData => ({
    competitionDay: null,
    loading: true,

    showBracket: true,
  }),
  computed: {
    scoreboard(): IScoreBoardItem[] {
      return this.competitionDay?.scoreBoard || [];
    },
    isLoading(): boolean {
      return this.loading || this.loadingDrivers;
    },
    eventDates(): string {
      const startsAt = this.competitionDay?.event?.startsAt || "";
      const endsAt = this.competitionDay?.event?.endsAt || "";

      const formattedStart = formatISODateToStringShort(startsAt);
      const formattedEnd = formatISODateToStringShort(endsAt);

      return `${formattedStart} - ${formattedEnd}`;
    },
    eventName(): string {
      return this.competitionDay?.event?.name || "";
    },
    parsedAllDriversList(): IParsedDriver[] {
      return parsedDriverList(this.allDriversList);
    },
  },
  mounted() {
    this.fetchData();
  },
  methods: {
    async fetchData(): Promise<void> {
      this.setLoading(true);
      const competitionDay = await apiCompetitionDay.getCompetitionDayById(
        this.qualifyingId
      );
      this.competitionDay = competitionDay;
      this.setLoading(false);
    },
    setLoading(val: boolean): void {
      this.loading = val;
    },
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

    .blank {
      width: 44px;
      height: 24px;
      transition: all 0.25s ease-in-out;

      &.bracket-icon {
        background: url("~/assets/svg/bracket-icon-unselected.svg") no-repeat
          center;
        background-size: 44px 24px;

        &.selected {
          background: url("~/assets/svg/bracket-icon.svg") no-repeat center;
        }
      }
      &:hover {
        transform: scale(1.1);
      }

      &.list-icon {
        background: url("~/assets/svg/list-icon-unselected.svg") no-repeat
          center;
        background-size: 44px 24px;
        &.selected {
          background: url("~/assets/svg/list-icon.svg") no-repeat center;
        }
      }
    }
  }
  margin-bottom: 100px;
}
</style>
