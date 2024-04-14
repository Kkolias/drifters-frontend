<template>
  <div class="component-AdminHeatJudgeModal">
    <Modal :value="true" @close="closeModal()">
      <div class="form-wrapper">
        <div class="button-wrapper">
          <button
            :class="[!showEditForm ? 'primary' : 'secondary']"
            @click="setShowEditForm(false)"
          >
            <span>Tuomarointi</span>
          </button>
          <button
            :class="[showEditForm ? 'primary' : 'secondary']"
            @click="setShowEditForm(true)"
          >
            <span>Muokkaus</span>
          </button>
        </div>
        <!-- <h1>Heat Tuomarointi</h1> -->
        <DriftCompetitionDayHeatJudgetForm
          v-if="!showEditForm"
          :competitionDayId="competitionDayId"
          :heat="heat"
          :allDriversList="allDriversList"
          @reload="reloadAndClose()"
        />
        <DriftCompetitionDayHeatEditForm
          v-if="showEditForm"
          :competitionDayId="competitionDayId"
          :heat="heat"
          :allDriversList="allDriversList"
          @reload="reloadAndClose()"
        />
      </div>
    </Modal>
  </div>
</template>

<script lang="ts">
import type { PropType } from "vue";
import type { IHeat } from "~/interfaces/competition-day.interface";
import type { IDriver } from "~/interfaces/driver.interface";

interface IData {
  showEditForm: boolean;
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
    showEditForm: false,
  }),
  computed: {},
  methods: {
    setShowEditForm(value: boolean) {
      this.showEditForm = value;
    },
    closeModal() {
      this.$emit("close");
    },
    reloadAndClose() {
      this.$emit("reload");
      this.closeModal();
    },
  },
};
</script>

<style lang="less" scoped>
.component-AdminHeatJudgeModal {
.form-wrapper {
  .button-wrapper {
    display: flex;
    justify-content: center;
    gap: 16px;
    margin-bottom: 16px;
  }
}
}
</style>
