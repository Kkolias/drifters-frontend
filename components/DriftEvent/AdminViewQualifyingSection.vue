<template>
  <div class="component-DriftEventAdminViewQualifyingSection">
    <div class="content-wrapper">
      <h2>Lajittelut</h2>
      <button
        v-if="!qualifyingItem"
        class="primary open-edit-form"
        @click="setEditFormOpen(true)"
      >
        <span> Luo lajittelu </span>
      </button>
    </div>
    <Modal :value="editFormOpen" @close="setEditFormOpen(false)">
      <QualifyingEditForm
        :initialId="initialId"
        :initialEventId="eventId"
        :emitSuccess="true"
        @success="reloadData()"
      />
    </Modal>
  </div>
</template>

<script lang="ts">
import type { IQualifying } from "~/interfaces/qualifying.interface";
import { type PropType } from "vue";

interface IData {
  editFormOpen: boolean;
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
  },
  data: (): IData => ({
    editFormOpen: false,
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
  },
};
</script>

<style lang="less" scoped>
.component-DriftEventAdminViewQualifyingSection {
  margin-bottom: 20px;
}
</style>
