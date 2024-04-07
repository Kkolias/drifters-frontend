<template>
  <div class="component-AdminViewCompetitionDaySection">
    <div class="content-wrapper">
      <h2>Kisapäivä</h2>
    </div>
    <div class="button-section">
      <button
        v-if="!competitionDayItem"
        class="primary open-edit-form"
        @click="doGenerateCompetitionDay()"
      >
        <span> Luo Kisapäivä tuloksista </span>
      </button>
      <!-- <button
        v-if="competitionDayItem"
        class="primary open-edit-form"
        @click="setShowAddDriversToResultList(true)"
      >
        <span> Muokkaa kisapäivää </span>
      </button> -->
    </div>

    <!-- <Modal :value="editFormOpen" @close="setEditFormOpen(false)">
      <DriftCompetitionDayEditForm
        :initialId="competitionDayId"
        :initialEventId="eventId"
        :emitSuccess="true"
        @success="reloadData()"
      />
    </Modal> -->
  </div>
</template>

<script lang="ts">
import type { PropType } from "vue";
import type { ICompetitionDay } from "~/interfaces/competition-day.interface";
import apiCompetitionDay from "~/utils/drifting/api-competition-day";

export default {
  props: {
    competitionDayItem: {
      type: Object as PropType<ICompetitionDay | null>,
      default: () => null,
    },
    eventId: {
      type: String,
      default: "",
    },
  },
  data: () => ({
    editFormOpen: false,
  }),
  computed: {
    competitionDayId(): string {
      return this.competitionDayItem?._id || "";
    },
  },
  methods: {
    reloadData(): void {
      this.$emit("reload");
    },
    setEditFormOpen(val: boolean): void {
      this.editFormOpen = val;
    },

    async doGenerateCompetitionDay(): Promise<void> {
      const generated = await apiCompetitionDay.generateCompetitionDayForEvent(
        this.eventId
      );

      if (generated) {
        this.reloadData();
      }
    },
  },
};
</script>

<style lang="less" scoped>
.component-AdminViewCompetitionDaySection {
  margin-bottom: 100px;

  h2 {
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
