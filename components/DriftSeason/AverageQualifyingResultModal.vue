<template>
  <div class="component-DriftSeasonAverageQualifyingResultModal">
    <Modal :value="true" @close="closeModal()">
      <div class="content" slot="content">
        <h1>{{ driverName }}</h1>
        <p class="average-points all">
         {{ textContent.pointsAllAverage }}: 
          <span class="green">{{ averageAllRuns }}</span>
        </p>
        <p class="average-points best">
          {{ textContent.pointsBestAverage }}:
          <span class="green">{{ averageBestRuns }}</span>
        </p>

        <div class="results-by-event">
          <h2>{{ textContent.pointsPerEvent }}</h2>
          <table class="scoreboard-table">
            <thead>
              <tr>
                <th>{{ textContent.event }}</th>
                <th>{{ textContent.run1 }}</th>
                <th>{{ textContent.run2 }}</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="result in driverQualifyingResult.eventList"
                :key="result.eventId"
              >
                <td>{{ result.eventName }}</td>
                <td>{{ result.pointsRun1 }}</td>
                <td>{{ result.pointsRun2 }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </Modal>
  </div>
</template>

<script lang="ts">
import type { ISeasonAverageQualifyingResult } from "~/interfaces/drift-season.interface";
import language from "~/mixins/language.vue";

const translations = {
  fi: {
    driver: "Kuljettaja",
    pointsAllAverage: "Kaikkien vetojen keskiarvo",
    pointsBestAverage: "Parhaiden vetojen keskiarvo",
    pointsPerEvent: "Pisteet tapahtumittain",
    event: "Tapahtuma",
    run1: "Veto 1",
    run2: "Veto 2",
  },
  en: {
    driver: "Driver",
    pointsAllAverage: "Average of all runs",
    pointsBestAverage: "Average of best runs",
    pointsPerEvent: "Points per event",
    event: "Event",
    run1: "Run 1",
    run2: "Run 2",
  }
};

interface ISeasonAverageQualifyingResultWithDriverName
  extends ISeasonAverageQualifyingResult {
  driverName: string;
}

export default {
  mixins: [language],
  props: {
    driverQualifyingResult: {
      type: Object as () => ISeasonAverageQualifyingResultWithDriverName,
      required: true,
    },
  },
  computed: {
    textContent() {
      return this.getTranslation(translations);
    },
    driverName(): string {
      return this.driverQualifyingResult.driverName;
    },
    averageAllRuns(): number {
      const value = this.driverQualifyingResult.averageAllRuns;
      return Math.round(value * 100) / 100;
    },
    averageBestRuns(): number {
      const value = this.driverQualifyingResult.averageBest;
      return Math.round(value * 100) / 100;
    },
  },
  methods: {
    closeModal() {
      this.$emit("close");
    },
  },
};
</script>

<style lang="less" scoped>
.component-DriftSeasonAverageQualifyingResultModal {
  .content {
    border: 2px solid var(--black-2);
    border-radius: 10px;
    padding: 24px 12px;
    max-width: 350px;
    min-width: 350px;
    margin: auto;
    background-color: var(--black-1);

    @media only screen and (max-width: 380px) {
      max-width: 300px;
      min-width: 80vw;
    }

    h1 {
      font-size: 24px;
      margin: 0;
      color: var(--green-1);
      text-align: center;
      margin-bottom: 12px;
    }

    h2 {
      font-size: 18px;
      margin: 0;
      color: var(--green-1);
      margin-bottom: 12px;
      text-align: center;
      margin-top: 24px;
    }

    .average-points {
      margin: 0;
      font-size: 16px;
      color: var(--white-1);
      margin-bottom: 6px;
      text-align: center;

      .green {
        font-weight: 700;
        color: var(--green-1);
        font-size: 18px;
      }
    }

    table {
      thead {
        tr {
          th {
            font-size: 12px;
          }
        }
      }
      tbody {
        tr {
          td {
            font-size: 14px;
          }
        }
      }
    }
  }
}
</style>
