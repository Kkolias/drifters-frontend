<template>
  <div class="component-QualifyingResultList">
    <CheckboxButton
      :label="textContent.showPoints"
      :checked="showPoints"
      @onClick="showPoints = !showPoints"
    />
    <table class="scoreboard-table">
      <thead>
        <tr>
          <th>{{ textContent.position }}</th>
          <th>{{ textContent.driver }}</th>
          <th>{{ textContent.points }}</th>
          <th v-if="showRunStats" class="scores">{{ textContent.scores }}</th>
          <th v-if="showPoints" :title="textContent.pointsFromPosition">
            {{ textContent.positionPoints }}
          </th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="(result, index) in qualifyingResults"
          :key="result._id"
          :class="{ 'score-updated': scoreHasChanged(result) }"
        >
          <td>
            <button class="blank" @click="handleClick(result)">
              {{ index + 1 }}.
            </button>
          </td>
          <td>
            <button class="blank" @click="handleClick(result)">
              {{ getDriverName(result) }}
            </button>
          </td>
          <td>
            <button class="blank" @click="handleClick(result)">
              {{ getHighestPoints(result) }}
            </button>
          </td>
          <td v-if="showRunStats">{{ getPoints(result) }}</td>
          <td v-if="showPoints">{{ getChampionShipPoints(index) }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script lang="ts">
import type { DriftSerie } from "~/enums/drift-serie.enum";
import type { IDriver } from "~/interfaces/driver.interface";
import type { IQualifyingResultItem } from "~/interfaces/qualifying.interface";
import { getQualifyingPositionPointBySerie } from "~/utils/getQualifyingPointsForSerie";
import translations from "~/lang/components/QualifyingResultList.lang";
import Language from "~/mixins/language.vue";

export default {
  mixins: [Language],
  props: {
    qualifyingResults: {
      type: Array as PropType<IQualifyingResultItem[]>,
      required: true,
    },
    allDriversList: {
      type: Array as PropType<IDriver[]>,
      required: true,
    },
    driftSerie: {
      type: String as PropType<DriftSerie | null>,
      default: null,
    },
    showRunStats: {
      type: Boolean,
      default: true,
    },
  },
  data: () => ({
    showPoints: false,

    lastResultListState: [] as IQualifyingResultItem[],
    changedResultIds: [] as string[],
  }),
  computed: {
    textContent() {
      return this.getTranslation(translations);
    },
  },
  watch: {
    qualifyingResults() {
      console.log("qualifyingResults changed", this.qualifyingResults);
      if (!this.lastResultListState?.length) {
        this.lastResultListState = [...this.qualifyingResults];
      } else {
        const resultsWithChangedRunPoints = this.qualifyingResults.filter(
          (result, index) => {
            const lastResult = this.lastResultListState?.find(
              (i) => i?._id === result._id
            );
            if (!lastResult) return false;
            const hasChangedRun1Points =
              result.run1Points !== lastResult.run1Points;
            const hasChangedRun2Points =
              result.run2Points !== lastResult.run2Points;
            return hasChangedRun1Points || hasChangedRun2Points;
          }
        );

        const changedIds = resultsWithChangedRunPoints.map(
          (result) => result._id
        );
        this.changedResultIds = changedIds;
        this.lastResultListState = [...this.qualifyingResults];
      }
    },
  },
  methods: {
    scoreHasChanged(resultItem: IQualifyingResultItem): boolean {
      return this.changedResultIds.includes(resultItem?._id || "");
    },
    getDriverName(resultItem: IQualifyingResultItem): string {
      const driverId = resultItem?.driver;
      const driver = this.allDriversList.find((d) => d?._id === driverId);
      return `${driver?.firstName} ${driver?.lastName}`;
    },
    getHighestPoints(resultItem: IQualifyingResultItem): number {
      return resultItem?.highestPoints ?? 0;
    },
    getPoints(resultItem: IQualifyingResultItem): string {
      const run1Points = resultItem?.run1Points ?? 0;
      const run2Points = resultItem?.run2Points ?? 0;
      const higherRun =
        run2Points > run1Points ? resultItem?.run2 : resultItem?.run1;

      return `${higherRun?.line ?? 0} | ${higherRun?.angle ?? 0} | ${
        higherRun?.style ?? 0
      }`;
    },
    getChampionShipPoints(index: number): string {
      // 1st-8th get points, 1st gets 8 and 8th gets 1
      // const pointsForPlace = [8, 7, 6, 5, 4, 3, 2, 1];

      // if (index >= pointsForPlace.length) return "0";
      const position = index + 1;
      const pointsForPlace = getQualifyingPositionPointBySerie(
        this.driftSerie,
        position
      );
      return `+${pointsForPlace}`;
    },
    handleClick(resultItem: IQualifyingResultItem): void {
      this.$emit("select", resultItem?._id || "");
    },
  },
};
</script>

<style lang="less" scoped>
.component-QualifyingResultList {
  margin-top: 24px;
  margin-bottom: 8px;
  max-width: 700px;
  margin: auto;
  .input-wrapper {
    @media only screen and (max-width: 768px) {
      font-size: 12px;
    }
  }

  .scoreboard-table {
    tbody {
      tr {
        &.score-updated {
          td {
            animation: indicateChangeFlash 3s ease-in-out forwards;
          }
        }
      }
    }
  }

  @keyframes indicateChangeFlash {
    0% {
      background-color: var(--black-2);
      color: var(--white-1);
    }
    25% {
      background-color: var(--green-1);
      color: var(--black-1);
    }
    50% {
      background-color: var(--black-2);
      color: var(--white-1);
    }
    75% {
      background-color: var(--green-1);
      color: var(--black-1);
    }
    100% {
      background-color: var(--black-2);
      color: var(--white-1);
    }
  }
}
</style>
