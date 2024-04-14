<template>
  <div class="HeatEditForm">
    <form @submit.prevent="(e) => submit(e)">
      <div v-if="overViewErrorMessage.length" class="error-wrapper">
        <p class="error-message">{{ overViewErrorMessage }}</p>
      </div>

      <div class="input-wrapper">
        <label for="serie">Kisapäivä:</label>
        <input :value="competitionDayId" type="text" disabled id="country" />
      </div>

      <div class="input-wrapper">
        <label for="bracketNumber">Heat numero:</label>
        <input v-model="bracketNumber" type="text" id="bracketNumber" />
      </div>

      <div class="input-wrapper">
        <label for="heatType">Heat tyyppi:</label>
        <SingleSelect
          class="single-select"
          placeholderOption="Valitse"
          id="heatType"
          :value="heatType"
          :optionList="HeatTypeList"
          @select="selectHeatType"
        />
        <!-- <ErrorHover :errorMessage="errorTexts.name" /> -->
      </div>

      <div class="input-wrapper">
        <label for="driver1">1. Kuski:</label>
        <SingleSelect
          class="single-select"
          placeholderOption="Valitse"
          id="driver1"
          labelKey="name"
          valueKey="_id"
          :value="selectedDriver1Name"
          :optionList="parsedDriverList"
          @select="selectDriver1"
        />
        <!-- <ErrorHover :errorMessage="errorTexts.startsAt" /> -->
      </div>

      <div class="input-wrapper">
        <label for="driver2">2. Kuski:</label>
        <SingleSelect
          class="single-select"
          placeholderOption="Valitse"
          id="driver2"
          labelKey="name"
          valueKey="_id"
          :value="selectedDriver2Name"
          :optionList="parsedDriverList"
          @select="selectDriver2"
        />
        <!-- <ErrorHover :errorMessage="errorTexts.endsAt" /> -->
      </div>

      <div class="button-wrapper">
        <ButtonWithLoader
          buttonType="submit"
          :loading="loading"
          :disabled="!!overViewErrorMessage.length"
          @click="submit"
        >
          <span> Tallenna </span>
        </ButtonWithLoader>
      </div>
    </form>
  </div>
</template>

<script lang="ts">
import { HeatType } from "~/enums/heat-type.enum";
import type { IHeat } from "~/interfaces/competition-day.interface";
import type { IDriver } from "~/interfaces/driver.interface";
import apiCompetitionDay from "~/utils/drifting/api-competition-day";
import { parsedDriverList, type IParsedDriver } from "~/utils/driver.utils";

interface IData {
  loading: boolean;
  overViewErrorMessage: string;

  bracketNumber: number;
  heatType: HeatType;
  driver1Id: string;
  driver2Id: string;
}

export default {
  props: {
    competitionDayId: {
      type: String,
      required: true,
    },
    heat: {
      type: Object as PropType<IHeat>,
      required: true,
    },
    allDriversList: {
      type: Array as PropType<IDriver[]>,
      default: () => [],
    },
  },
  data: (): IData => ({
    loading: false,
    overViewErrorMessage: "",

    bracketNumber: 0,
    heatType: HeatType.top32,
    driver1Id: "",
    driver2Id: "",
  }),
  computed: {
    parsedDriverList(): IParsedDriver[] {
      return parsedDriverList(this.allDriversList);
    },
    selectedDriver1Name(): string {
      return (
        this.parsedDriverList.find((driver) => driver?._id === this.driver1Id)
          ?.name || ""
      );
    },
    selectedDriver2Name(): string {
      return (
        this.parsedDriverList.find((driver) => driver?._id === this.driver2Id)
          ?.name || ""
      );
    },
    HeatTypeList() {
      return Object.values(HeatType);
    },
  },
  mounted() {
    this.initData();
  },
  methods: {
    initData(): void {
      this.bracketNumber = this.heat.bracketNumber;
      this.heatType = this.heat.heatType;
      this.driver1Id = this.heat.driver1 as string;
      this.driver2Id = this.heat.driver2 as string;
    },

    selectHeatType(heatType: HeatType): void {
      this.heatType = heatType;
      this.setOverViewErrorMessage("");
    },
    selectDriver1(driver: IParsedDriver): void {
      this.driver1Id = driver._id;
      this.setOverViewErrorMessage("");
    },
    selectDriver2(driver: IParsedDriver): void {
      this.driver2Id = driver._id;
      this.setOverViewErrorMessage("");
    },
    setOverViewErrorMessage(message: string): void {
      this.overViewErrorMessage = message;
    },
    setLoading(val: boolean): void {
      this.loading = val;
    },
    async submit(e: Event) {
      if (this.loading) return;
      this.setLoading(true);
      e.preventDefault();

      const {
        competitionDayId,
        heat,
        bracketNumber,
        heatType,
        driver1Id,
        driver2Id,
      } = this;
      const heatId = heat._id;
      if (!driver1Id || !driver2Id || !heatId) {
        this.setOverViewErrorMessage("Täytä kaikki kentät.");
        return;
      }

      await apiCompetitionDay.updateHeat({
        competitionDayId,
        heatId,
        bracketNumber,
        heatType,
        driver1Id,
        driver2Id,
      });
      this.setLoading(false);
      this.$emit("reload");
    },
  },
};
</script>
