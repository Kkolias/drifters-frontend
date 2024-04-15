<template>
  <div class="component-QualifyingResultList">
    <table>
      <thead>
        <tr>
          <th>Sija</th>
          <th>Kuljettaja</th>
          <th>Pisteet</th>
          <th class="scores">(Linja | Kulma |Tyyli)</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(result, index) in qualifyingResults" :key="result._id">
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
          <td>{{ getPoints(result) }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script lang="ts">
import type { IDriver } from "~/interfaces/driver.interface";
import type { IQualifyingResultItem } from "~/interfaces/qualifying.interface";

export default {
  props: {
    qualifyingResults: {
      type: Array as PropType<IQualifyingResultItem[]>,
      required: true,
    },
    allDriversList: {
      type: Array as PropType<IDriver[]>,
      required: true,
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
    handleClick(resultItem: IQualifyingResultItem): void {
      this.$emit("select", resultItem?._id || "");
    },
  },
};
</script>

<style lang="less" scoped>
.component-QualifyingResultList {
  table {
    max-width: 700px;
    width: 100%;
    border-collapse: separate;
    border-spacing: 0 4px;
    margin: 0 auto;
    margin-bottom: 100px;

    thead {
      th {
        padding: 10px;
        font-size: 1.2rem;

        &.scores {
          font-size: 1rem;
        }
      }
    }

    tbody {
      tr {
        td {
          background: var(--black-2);
          padding: 6px;
          font-size: 1.2rem;
          line-height: 1.4rem;
          text-align: center;

          &:first-child {
            border-radius: 10px 0 0 10px;
          }
          &:last-child {
            border-radius: 0 10px 10px 0;
          }
        }
      }
    }
  }
}
</style>
