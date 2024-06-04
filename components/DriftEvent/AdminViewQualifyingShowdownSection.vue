<template>
  <div class="component-AdminViewQualifyingShowdownSection">
    <div class="content-wrapper">
      <h2>Qualifying showdown</h2>
      <div class="button-section">
        <button
          v-if="!qualifyingShowdownItem"
          class="primary open-edit-form"
          @click="createQualifyingShowdown()"
        >
          <span> Luo Qualifying showdown </span>
        </button>
      </div>
      <QualifyingShowdownBracketAdminView
        v-if="qualifyingShowdownItem"
        :qualifyingShowdownId="qualifyingShowdownItem._id"
        :heatList="heatList"
        :allDriversList="allDriversList"
        @reload="reloadData()"
      />
    </div>
  </div>
</template>

<script lang="ts">
import type { IQualifyingShowdownItem, IShowdownHeat } from "~/interfaces/qualifying-showdown.interface";
import { type PropType } from "vue";
import apiQualifyingShowdown from "~/utils/drifting/api-qualifying-showdown";
import type { IHeat } from "~/interfaces/competition-day.interface";
import type { IDriver } from "~/interfaces/driver.interface";

export default {
  props: {
    qualifyingShowdownItem: {
      type: Object as PropType<IQualifyingShowdownItem | null>,
      default: () => null
    },
    eventId: {
      type: String,
      required: true,
    },
    allDriversList: {
      type: Array as PropType<IDriver[]>,
      default: () => [],
    },
  },
  data: () => ({
    loading: false,
  }),
  computed: {
    heatList(): any[] {
      return this.qualifyingShowdownItem?.heatList || [] as unknown as IHeat[];
    },
  },
  methods: {
    async createQualifyingShowdown(): Promise<void> {
      this.loading = true;
      await apiQualifyingShowdown.createQualifyingShowdown(this.eventId);
      this.loading = false;
      this.reloadData()
    },
    reloadData(): void {
      this.$emit("reload");
    },
  },
};
</script>

<style lang="less" scoped>
.component-AdminViewQualifyingShowdownSection {
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
