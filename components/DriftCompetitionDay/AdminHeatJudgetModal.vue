<template>
  <div class="component-AdminHeatJudgeModal">
    <Modal :value="true" @close="closeModal()">
      <div class="form-wrapper">
        <h1>Uusi Drift event</h1>
        <form @submit.prevent="(e) => submit(e)">
          <div v-if="overViewErrorMessage.length" class="error-wrapper">
            <p class="error-message">{{ overViewErrorMessage }}</p>
          </div>

          <div class="input-wrapper">
            <label for="serie">Kisapäivä:</label>
            <input
              :value="competitionDayId"
              type="text"
              disabled
              id="country"
            />
          </div>

          <div class="input-wrapper">
            <label for="judgePoint1">1. Tuomaripiste:</label>
            <SingleSelect
              class="single-select"
              placeholderOption="Valitse"
              id="judgePoint1"
              :value="getSelectedDriverName(judgePoints.judgePoint1)"
              :optionList="judgePointOptions"
              @select="giveJudgePoint1"
            />
            <!-- <ErrorHover :errorMessage="errorTexts.name" /> -->
          </div>

          <div class="input-wrapper">
            <label for="judgePoint2">2. Tuomaripiste:</label>
            <SingleSelect
              class="single-select"
              placeholderOption="Valitse"
              id="judgePoint2"
              :value="getSelectedDriverName(judgePoints.judgePoint2)"
              :optionList="judgePointOptions"
              @select="giveJudgePoint2"
            />
            <!-- <ErrorHover :errorMessage="errorTexts.startsAt" /> -->
          </div>

          <div class="input-wrapper">
            <label for="judgePoint3">3. Tuomaripiste:</label>
            <SingleSelect
              class="single-select"
              placeholderOption="Valitse"
              id="judgePoint3"
              :value="getSelectedDriverName(judgePoints.judgePoint3)"
              :optionList="judgePointOptions"
              @select="giveJudgePoint3"
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
    </Modal>
  </div>
</template>

<script lang="ts">
import type { PropType } from "vue";
import { JudgePoint } from "~/enums/judge-point.enum";
import type { IHeat } from "~/interfaces/competition-day.interface";
import type { IDriver } from "~/interfaces/driver.interface";
import apiCompetitionDay from "~/utils/drifting/api-competition-day";

interface JudgePointsNotNull {
  judgePoint1: JudgePoint;
  judgePoint2: JudgePoint;
  judgePoint3: JudgePoint;
}

interface IData {
  loading: boolean;
  overViewErrorMessage: string;
  judgePoints: {
    judgePoint1: JudgePoint | null;
    judgePoint2: JudgePoint | null;
    judgePoint3: JudgePoint | null;
  };
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

    judgePoints: {
      judgePoint1: null,
      judgePoint2: null,
      judgePoint3: null,
    },
  }),
  computed: {
    heatId(): string {
      return this.heat._id;
    },
    runId(): string {
      // last item in heat.runList and its id
      return this.heat?.runList?.[this.heat?.runList?.length - 1]?._id || "";
    },
    judgePointOptions(): string[] {
      return [JudgePoint.driver1, JudgePoint.driver2, JudgePoint.omt];
    },
    driver1Name(): string {
      const driver =
        this.allDriversList.find(
          (driver) => driver._id === this.heat.driver1
        ) || null;
      if (!driver) return "";

      return `${driver.firstName} ${driver.lastName}`;
    },
    driver2Name(): string {
      const driver =
        this.allDriversList.find(
          (driver) => driver._id === this.heat.driver2
        ) || null;
      if (!driver) return "";

      return `${driver.firstName} ${driver.lastName}`;
    },
  },
  methods: {
    closeModal() {
      this.$emit("close");
    },
    getSelectedDriverName(judgePoint: JudgePoint | null): string {
      if (!judgePoint) return "";
      if (judgePoint === JudgePoint.driver1) return this.driver1Name;
      if (judgePoint === JudgePoint.driver2) return this.driver2Name;
      return "Omt";
    },
    giveJudgePoint1(judgePoint: JudgePoint): void {
      this.setJudgePoint(judgePoint, "judgePoint1");
    },
    giveJudgePoint2(judgePoint: JudgePoint): void {
      this.setJudgePoint(judgePoint, "judgePoint2");
    },
    giveJudgePoint3(judgePoint: JudgePoint): void {
      this.setJudgePoint(judgePoint, "judgePoint3");
    },

    setJudgePoint(point: JudgePoint, key: string): void {
      this.setOverViewErrorMessage("");
      this.judgePoints = {
        ...this.judgePoints,
        [key]: point,
      };
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

      if (
        !this.judgePoints.judgePoint1 ||
        !this.judgePoints.judgePoint2 ||
        !this.judgePoints.judgePoint3
      ) {
        this.setOverViewErrorMessage("Kaikki tuomaripisteet tulee valita");
        return;
      }

      await apiCompetitionDay.giveRunJudgePoints(
        this.competitionDayId,
        this.heatId,
        this.runId,
        this.judgePoints as JudgePointsNotNull
      );
      this.setLoading(false);
      this.$emit("reload");
      this.closeModal();
    },
  },
};
</script>

<style lang="less" scoped>
.component-AdminHeatJudgeModal {
}
</style>
