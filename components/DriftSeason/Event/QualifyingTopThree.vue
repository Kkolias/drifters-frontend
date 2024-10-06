<template>
  <div class="component-DriftSeasonEventBracketTopThree">
    <h2>{{textContent.qualifying}} Top 3</h2>
    <div class="top-three-list">
      <table class="scoreboard-table">
        <thead>
          <tr>
            <th>{{ textContent.position }}</th>
            <th>{{ textContent.driver }}</th>
            <th>{{ textContent.points }}</th>
            <!-- <th v-if="showRunStats" class="scores">{{ textContent.scores }}</th> -->
            <th :title="textContent.pointsFromPosition">
              {{ textContent.positionPoints }}
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(result, index) in eventTopThreeQuali" :key="result._id">
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
            <!-- <td v-if="showRunStats">{{ getPoints(result) }}</td> -->
            <td>{{ getChampionShipPoints(index) }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script lang="ts">
import type { DriftSerie } from "~/enums/drift-serie.enum";
import type { IDriver } from "~/interfaces/driver.interface";
import type {
  IQualifying,
  IQualifyingResultItem,
} from "~/interfaces/qualifying.interface";
import translations from "~/lang/components/QualifyingResultList.lang";
import language from "~/mixins/language.vue";


export default {
  mixins: [language],
  props: {
    qualifying: {
      type: Object as () => IQualifying,
      required: true,
    },
    driftSerie: {
      type: String as PropType<DriftSerie | null>,
      default: null,
    },
    allDriversList: {
      type: Array as PropType<IDriver[]>,
      required: true,
    },
  },
  computed: {
    textContent() {
      return this.getTranslation(translations);
    },
    eventTopThreeQuali(): IQualifyingResultItem[] {
      return this.qualifying?.resultList?.slice(0, 3) ?? [];
    },
  },
  methods: {
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
        const driver = this.allDriversList.find((d) => d?._id === resultItem.driver);

        const slug = driver?.slug || "";

        this.$router.push(`/drivers/${slug}`);
    //   this.$emit("select", resultItem?._id || "");
    },
    // driverProfileLink(resultItem: IScoreBoardItem): string {
    //   const slug = this.getDriver(resultItem)?.slug || "";
    //   return `/drivers/${slug}`;
    // },
  },
};
</script>

<style lang="less" scoped>
.component-DriftSeasonEventBracketTopThree {
  h2 {
    font-size: 24px;
    color: var(--green-1);
    text-align: center;
  }
}
</style>
