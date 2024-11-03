<template>
  <div class="component-QualifyingRunPointModal">
    <Modal :value="true" @close="closeModal()">
      <div class="content" slot="content">
        <div class="form-wrapper">
          <h1>{{ driverName }} veto {{ selectedRun }}</h1>
          <form @submit.prevent="(e) => submit(e)">
            <!-- <div v-if="overViewErrorMessage.length" class="error-wrapper">
              <p class="error-message">{{ overViewErrorMessage }}</p>
            </div> -->

            <div class="input-wrapper">
              <label for="line">Linja:</label>
              <input
                ref="lineInput"
                v-model.number="run.line"
                type="number"
                id="line"
               
              />
              <!-- <ErrorHover :errorMessage="errorTexts.year" /> -->
            </div>
            <div class="input-wrapper">
              <label for="angle">Kulma:</label>
              <input
                v-model.number="run.angle"
                type="number"
                id="angle"
                
              />
              <!-- <ErrorHover :errorMessage="errorTexts.year" /> -->
            </div>
            <div class="input-wrapper">
              <label for="style">Tyyli:</label>
              <input
                v-model.number="run.style"
                type="number"
                id="style"
                
              />
              <!-- <ErrorHover :errorMessage="errorTexts.year" /> -->
            </div>

            <div class="sum-wrapper">
              <p>Yhteensä: {{ runSummary }}</p>
            </div>

            <div class="button-wrapper">
              <ButtonWithLoader
                buttonType="submit"
                :loading="loading"
                @click="submit"
              >
                <span> Pisteytä </span>
              </ButtonWithLoader>
            </div>
          </form>
        </div>
      </div>
    </Modal>
  </div>
</template>

<script lang="ts">
import type {
  IQualifyingResultItem,
} from "~/interfaces/qualifying.interface";
import service from "./QualifyingRunPointModal.service";
import type { IDriver } from "~/interfaces/driver.interface";

interface IData {
  run: {
    line: number;
    angle: number;
    style: number;
  };

  loading: boolean;
}

export default {
  props: {
    qualifyingResultItem: {
      type: Object as PropType<IQualifyingResultItem>,
    },
    qualifyingId: {
      type: String,
      default: "",
    },
    selectedRun: {
      type: Number,
      default: 1,
    },
    allDriversList: {
      type: Array as PropType<IDriver[]>,
      default: () => [],
    }
  },
  data: (): IData => ({
    run: {
      line: 0,
      angle: 0,
      style: 0,
    },

    loading: false,
  }),
  computed: {
    resultId(): string {
      return this.qualifyingResultItem?._id || "";
    },
    runKey(): "run1" | "run2" {
      return service.getRunNumber(this.selectedRun);
    },
    driverName(): string {
      const driver = this.allDriversList.find(
        (driver) => driver._id === this.qualifyingResultItem?.driver
      );

      const firstName = driver?.firstName || "";
      const lastName = driver?.lastName || "";

      return `${firstName} ${lastName}`;
    },
    runSummary(): number {
      const run1 = this.run?.line ?? 0
      const run2 = this.run?.angle ?? 0
      const run3 = this.run?.style ?? 0

      return run1 + run2 + run3;
    }
  },
  mounted() {
    this.setData();
    this.focusOnFirstInput();
  },
  methods: {
    focusOnFirstInput() {
      const firstInput = this.$refs.lineInput as HTMLInputElement;
      firstInput?.focus();
      firstInput?.select();
    },
    setData(): void {
      if (this.qualifyingResultItem === null) return;
      if (!this.runKey) return;

      this.run = {
        ...this.run,
        line: this.qualifyingResultItem?.[this.runKey]?.line || 0,
        angle: this.qualifyingResultItem?.[this.runKey]?.angle || 0,
        style: this.qualifyingResultItem?.[this.runKey]?.style || 0,
      };
    },

    async submit(e: Event) {
      if (this.loading) return;
      this.setLoading(true);
      e.preventDefault();

      const updatedQualifying = await service.updateQualifyingRuns(
        this.qualifyingId,
        this.resultId,
        {
          [this.runKey]: this.run,
        }
      );
      this.setLoading(false);
      this.$emit("success", updatedQualifying);
    },

    setLoading(val: boolean) {
      this.loading = val;
    },

    closeModal() {
      this.$emit("closeModal");
    },
  },
};
</script>

<style lang="less" scoped>
.component-QualifyingRunPointModal {
  .form-wrapper {
    border: 2px solid var(--black-2);
    border-radius: 10px;
    padding: 24px;

    h1 {
      text-align: center;
    }

    max-width: 350px;
    margin: auto;

    form {
      display: flex;
      flex-direction: column;
      gap: 8px;

      .error-wrapper {
        .error-message {
          text-align: center;
          color: var(--error-color);
          margin: 0;
        }
      }

      .input-wrapper {
        display: flex;
        flex-direction: column;
        gap: 4px;
        position: relative;

        input,
        .single-select {
          width: 350px;
        }
      }

      .button-wrapper {
        margin-top: 4px;
        width: 100%;
        display: flex;
        justify-content: flex-end;
      }

      .car-list {
        margin: 0;
        padding: 0;
        list-style: none;

        li {
          margin: 0;
          padding: 0;
          list-style: none;
        }
      }
    }
  }
}
</style>
