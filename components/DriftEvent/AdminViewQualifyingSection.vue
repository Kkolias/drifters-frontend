<template>
  <div class="component-DriftEventAdminViewQualifyingSection">
    <div class="content-wrapper">
      <h2>Lajittelut</h2>
      <div class="button-section">
        <button
          v-if="!qualifyingItem"
          class="primary open-edit-form"
          @click="setEditFormOpen(true)"
        >
          <span> Luo lajittelu </span>
        </button>
        <button
          v-if="qualifyingItem"
          class="primary open-edit-form"
          @click="setShowAddDriversToResultList(true)"
        >
          <span> Muokkaa kuljettajalistaa </span>
        </button>
        <button
          v-if="qualifyingItem"
          class="primary open-edit-form"
          @click="generateQualifyingScores()"
        >
          <span> Generoi pisteytys </span>
        </button>
      </div>
      <div class="result-list-section">
        <DriftEventAdminViewQualifyingDataTable
          v-if="qualifyingItem"
          :qualifyingItem="qualifyingItem"
          @reload="reloadData()"
        />
      </div>
    </div>
    <Modal :value="editFormOpen" @close="setEditFormOpen(false)">
      <QualifyingEditForm
        :initialId="initialId"
        :initialEventId="eventId"
        :emitSuccess="true"
        @success="reloadData()"
      />
    </Modal>
    <QualifyingAddDriversToResulList
      v-if="qualifyingItem && showAddDriversToResultList"
      :scoreboardDriverIdListWorstToBest="scoreboardDriverIdListWorstToBest"
      :qualifyingItem="qualifyingItem"
      @reload="reloadData()"
      @closeModal="setShowAddDriversToResultList(false)"
    />
  </div>
</template>

<script lang="ts">
import type { IQualifying } from "~/interfaces/qualifying.interface";
import { type PropType } from "vue";
import apiDriftEvent from "~/utils/drifting/api-drift-event";

interface IData {
  editFormOpen: boolean;
  showAddDriversToResultList: boolean;
}

export default {
  props: {
    qualifyingItem: {
      type: Object as PropType<IQualifying | null>,
    },
    eventId: {
      type: String,
      default: "",
    },
    scoreboardDriverIdListWorstToBest: {
      type: Array as PropType<string[]>,
      default: () => [],
    }
  },
  data: (): IData => ({
    editFormOpen: false,
    showAddDriversToResultList: false,
  }),
  computed: {
    initialId(): string {
      return this.qualifyingItem?._id || "";
    },
  },
  methods: {
    reloadData(): void {
      this.$emit("reload");
      this.setEditFormOpen(false);
    },
    setEditFormOpen(val: boolean): void {
      this.editFormOpen = val;
    },
    setShowAddDriversToResultList(val: boolean): void {
      this.showAddDriversToResultList = val;
    },
    async generateQualifyingScores(): Promise<void> {
      await apiDriftEvent.handleQualifyingScoring(this.eventId)
      this.reloadData()
    },
  },
};
</script>

<style lang="less" scoped>
.component-DriftEventAdminViewQualifyingSection {
  margin-bottom: 20px;

  h2 {
    // margin: 0;
    text-align: center;
  }

  .button-section {
    display: flex;
    justify-content: center;
    margin-bottom: 20px;

    button {
      margin: 0 10px;
    }
  }
}
</style>
