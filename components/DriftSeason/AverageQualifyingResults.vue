<template>
  <div class="component-DriftSeasonAverageQualifyingResults">
    <div class="explanation-container">
      <p class="subtext">{{ textContent.description }}</p>
      <p>
        <b>{{ textContent.pointsAllAverage }}:</b>
        {{ textContent.explanationPointsAllAverage }}
      </p>
      <p>
        <b>{{ textContent.pointsBestAverage }}:</b>
        {{ textContent.explanationPointsBestAverage }}
      </p>
      <p v-if="showAll" class="cta-text">{{ textContent.cta }}</p>
    </div>

    <LoadingIndicator v-if="loading" />
    <div v-else class="content">
      <button
        v-if="!showAll"
        class="blank show-all-toggle-overlay"
        @click="setShowAll(true)"
      >
        <span>{{ textContent.showWholeList }}</span>
      </button>
      <CheckboxButton
        class="show-multiple-event-drivers"
        :label="textContent.showMultipleEventDrivers"
        :checked="showMultipleEventDrivers"
        @onClick="showMultipleEventDrivers = !showMultipleEventDrivers"
      />
      <table class="scoreboard-table">
        <thead>
          <tr>
            <th></th>
            <th>{{ textContent.driver }}</th>
            <th>{{ textContent.pointsAllAverage }}</th>
            <th>{{ textContent.pointsBestAverage }}</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(result, index) in parsedAverageQualifyingResults"
            :key="result.driverId"
          >
            <td>
              <button
                class="blank"
                @click="selecteDriverQualifyingResult(result)"
              >
                {{ index + 1 }}.
              </button>
            </td>
            <td>
              <button
                class="blank"
                @click="selecteDriverQualifyingResult(result)"
              >
                {{ result.driverName }}
              </button>
            </td>
            <td>
              <button
                class="blank"
                @click="selecteDriverQualifyingResult(result)"
              >
                {{ parsePoint(result.averageAllRuns) }}
              </button>
            </td>
            <td>
              <button
                class="blank"
                @click="selecteDriverQualifyingResult(result)"
              >
                {{ parsePoint(result.averageBest) }}
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <DriftSeasonAverageQualifyingResultModal
      v-if="selectedDriverQualifyingResult"
      :driverQualifyingResult="selectedDriverQualifyingResult"
      @close="selecteDriverQualifyingResult(null)"
    />
  </div>
</template>

<script lang="ts">
import type { ISeasonAverageQualifyingResult } from "~/interfaces/drift-season.interface";
import type { IDriver } from "~/interfaces/driver.interface";
import language from "~/mixins/language.vue";
import apiDriftSeason from "~/utils/drifting/api-drift-season";

const translations = {
  fi: {
    driver: "Kuljettaja",
    pointsAllAverage: "Keskiarvo kaikista",
    pointsBestAverage: "Paras keskiarvo",
    description: `Kauden kuljettajien lajittelu pisteiden keskiarvollinen tilasto.`,
    explanationPointsAllAverage:
      "Kujettajan kauden jokaisen lajittelu vedon pistekeskiarvo.",
    explanationPointsBestAverage:
      "Kujettajan jokaisen tapahtuman parhaan lajittelu vedon pistekeskiarvo.",
    cta: "Klikkaa kuljettajaa nähdäksesi kauden lajittelutulokset",
    showMultipleEventDrivers:
      "Näytä kuljettajat, jotka ovat osallistuneet vähintään kahteen tapahtumaan",
    showWholeList: "Näytä koko lista klikkaamalla tästä",
  },
  en: {
    driver: "Driver",
    pointsAllAverage: "Average of all",
    pointsBestAverage: "Best average",
    description: `Season drivers sorting by average points statistics.`,
    explanationPointsAllAverage:
      "Driver's average points of each qualifying run of the season.",
    explanationPointsBestAverage:
      "Driver's best average points of each qualifying run of the season.",
    cta: "Click on driver to see season qualifying results",
    showMultipleEventDrivers:
      "Show drivers who have participated in at least two events",
    showWholeList: "Show whole list by clicking here",
  },
};

interface ISeasonAverageQualifyingResultWithDriverName
  extends ISeasonAverageQualifyingResult {
  driverName: string;
}

interface IData {
  loading: boolean;
  averageQualifyingResults: ISeasonAverageQualifyingResult[];

  showAll: boolean;
  isMobilePlatform: boolean;

  selectedDriverQualifyingResult: ISeasonAverageQualifyingResultWithDriverName | null;
  showMultipleEventDrivers: boolean;
}

export default {
  mixins: [language],
  props: {
    seasonSlug: {
      type: String,
      required: true,
    },
    allDriversList: {
      type: Array as () => IDriver[],
      required: true,
    },
  },
  data: (): IData => ({
    loading: true,
    averageQualifyingResults: [],

    showAll: false,
    isMobilePlatform: false,

    selectedDriverQualifyingResult: null,
    showMultipleEventDrivers: false,
  }),
  computed: {
    textContent() {
      return this.getTranslation(translations);
    },
    filteredAverageList(): ISeasonAverageQualifyingResult[] {
      if (!this.showMultipleEventDrivers) return this.averageQualifyingResults;

      return this.averageQualifyingResults.filter(
        (result) => result?.eventList?.length > 1
      );
    },
    parsedAverageQualifyingResults(): ISeasonAverageQualifyingResultWithDriverName[] {
      const parsed = this.filteredAverageList.map((result) => ({
        ...result,
        driverName: this.getDriverName(result.driverId),
      }));

      if (this.showAll) {
        return parsed;
      } else {
        return parsed.slice(0, 5);
      }
    },
  },
  async mounted() {
    await this.fetchAverageQualifyingResults();
  },
  methods: {
    selecteDriverQualifyingResult(
      result: ISeasonAverageQualifyingResultWithDriverName | null
    ) {
      this.selectedDriverQualifyingResult = result;
    },
    parsePoint(point: number) {
      return point.toFixed(2);
    },
    getDriverName(driverId: string): string {
      const driver = this.allDriversList.find((d) => d._id === driverId);
      return `${driver?.firstName} ${driver?.lastName}`;
    },
    async fetchAverageQualifyingResults() {
      this.setLoading(true);

      const r = await apiDriftSeason.getSeasonAverageQualifyingResults(
        this.seasonSlug
      );
      this.averageQualifyingResults = r;

      this.setLoading(false);
    },
    setLoading(val: boolean) {
      this.loading = val;
    },
    setShowAll(val: boolean) {
      this.showAll = val;
    },
  },
};
</script>

<style lang="less" scoped>
.component-DriftSeasonAverageQualifyingResults {
  .explanation-container {
    max-width: 700px;
    margin: auto;
    p {
      margin: 0;

      &.subtext {
        margin-bottom: 12px;
      }
      &.cta-text {
        margin-top: 24px;
      }

      b {
        color: var(--green-1);
      }
    }
  }
  .content {
    position: relative;
    margin-top: 12px;

    .show-multiple-event-drivers {
      max-width: 665px;
      margin: auto;
    }

    .show-all-toggle-overlay {
      max-width: 700px;
      width: 100%;
      position: absolute;
      top: 0;
      left: 50%;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.6);
      display: flex;
      justify-content: center;
      align-items: center;
      color: white;
      font-size: 1.5rem;
      cursor: pointer;
      transform: translateX(-50%);
      transition: opacity 0.25s ease-in-out;
      opacity: 0;
    }

    &:hover {
      .show-all-toggle-overlay {
        opacity: 1;
      }
    }

    @media only screen and (max-width: 1090px) {
      .show-all-toggle-overlay {
        opacity: 1;
        font-size: 16px;
      }
    }
  }
}
</style>
