<template>
  <div class="component-QualifyingView">
    <LoadingIndicator v-if="isLoading" />
    <h3>{{ qualifyingDate }}</h3>
    <p class="subtitle">Lajittelun tulokset, parhaan vedon pisteet ja tuloksesta saatavat mestaruuspisteet.</p>
    <p class="subtitle small">Näe tarkemmat pisteet valitsemalla kuljettaja</p>

    <QualifyingResultList
      v-if="qualifying"
      :qualifyingResults="qualifying.resultList"
      :allDriversList="allDriversList"
      :driftSerie="driftSerie"
      :showRunStats="showRunStats"
      @select="setResultId"
    />
    <QualifyingResultSummary
      v-if="!!selectedResultItem"
      :qualifyingResultItem="(selectedResultItem as IQualifyingResultItem)"
      :showRunStats="showRunStats"
      @close="setResultId('')"
    />
  </div>
</template>

<script lang="ts">
import type { PropType } from "vue";
import { DriftSerie } from "~/enums/drift-serie.enum";
import type { IDriver } from "~/interfaces/driver.interface";
import type {
  IQualifying,
  IQualifyingResultItem,
} from "~/interfaces/qualifying.interface";
import { formatISODateToStringShort } from "~/utils/time";

interface IData {
  qualifying: IQualifying | null;
  loading: boolean;
}

export default {
  props: {
    qualifying: {
      type: Object as PropType<IQualifying>,
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
    loadingQualifying: {
      type: Boolean,
      default: false,
    },
    driftSerie: {
      type: String as PropType<DriftSerie | null>,
      default: null,
    },
  },
  computed: {
    showRunStats(): boolean {
      return this.driftSerie !== DriftSerie.driftsmpro
    },
    isLoading(): boolean {
      return this.loadingQualifying || this.loadingDrivers;
    },
    qualifyingDate(): string {
      const date = this.qualifying?.date ||''
      if (!date) return "";
      return `Päivämäärä: ${formatISODateToStringShort(date)}`;
    },
    
    selectedResultId(): string {
      const r = (this.$route?.query?.result as string) || "";
      return r;
    },
    selectedResultItem(): IQualifyingResultItem | null {
      const item =
        this.qualifying?.resultList?.find(
          (r) => r?._id === this.selectedResultId
        ) || null;

      if (!item) return null;

      const driver = this.allDriversList?.find(
        (d) => d?._id === item?.driver
      ) as IDriver;
      return {
        ...item,
        driver,
      };
    },
    eventName(): string {
      return this.qualifying?.event?.name || "";
    },
  },
  methods: {
    setResultId(id: string): void {
      this.$router.push({
        query: {
          ...this.$route.query,
          result: id,
        },
      });
    },
  },
};
</script>

<style lang="less" scoped>
.component-QualifyingView {
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

  .subtitle {
    margin-top: 0px;
    font-size: 1.1rem;
    text-align: center;
    margin-bottom: 16px;

    &.small {
      font-size: 1rem;
    }
  }

  @media only screen and (max-width: 768px) {
    h3 {
      font-size: 18px;
    }
    .subtitle, .subtitle.small {
      font-size: 12px;
    }
  }
}
</style>
