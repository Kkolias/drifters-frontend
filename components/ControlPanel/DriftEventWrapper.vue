<template>
  <div class="component-ControlPanelDriftEventWrapper">
    <h2>Tapahtuman hallinnointi</h2>
    <div class="view-button-wrapper">
      <button
        v-for="(view, key) in driftEventViews"
        :key="key"
        :class="[isViewSelected(view.query) ? 'primary' : 'secondary']"
        @click="selectView(view.query)"
      >
        <span>
          {{ view.label }}
        </span>
      </button>
    </div>
    <div class="views-section">
      <ControlPanelDriftEventOverviewEdit
        v-if="isViewSelected('overview')"
        :eventId="driftEventId"
        @setUpdatedEvent="setUpdatedEvent"
        @reloadSeason="reloadSeason"
      />
      <ControlPanelDriftEventResultEdit
        v-if="isEditResultView"
        :eventId="driftEventId"
      />
    </div>
  </div>
</template>

<script lang="ts">
import type { LocationQuery } from "vue-router";
import type { IDriftEvent } from "~/interfaces/drift-event.interface";

export default {
  props: {
    driftEventId: {
      type: String,
      default: "",
    },
  },
  computed: {
    queryParams(): LocationQuery {
      return this.$route?.query;
    },
    driftEventViews(): { query: string; label: string }[] {
      if (this.queryParams?.eventId === "create-new") {
        return [
          {
            query: "overview",
            label: "Uusi tapahtuma",
          },
        ];
      }
      return [
        {
          query: "overview",
          label: "Tiedot",
        },
        {
          query: "qualifying",
          label: "Lajittelu",
        },
        {
          query: "qualifying-showdown",
          label: "Showdown",
        },
        {
          query: "bracket",
          label: "Kaavio",
        },
      ];
    },
    isEditResultView(): boolean {
      const view = this.$route?.query?.["event-view"];
      return (
        view === "qualifying" ||
        view === "bracket" ||
        view === "qualifying-showdown"
      );
    },
  },
  methods: {
    isViewSelected(query: string): boolean {
      return this.$route?.query?.["event-view"] === query;
    },
    setUpdatedEvent(updatedEvent: IDriftEvent): void {
      this.$emit("setUpdatedEvent", updatedEvent);
    },
    reloadSeason(): void {
      this.$emit("reloadSeason");
    },
    selectView(query: string): void {
      this.$router.push({
        query: {
          ...this.queryParams,
          "event-view": query,
        },
      });
    },
  },
};
</script>

<style lang="less" scoped>
.component-ControlPanelDriftEventWrapper {
  h2 {
    font-size: 20px;
    text-align: center;
    color: var(--green-1);
  }
  .view-button-wrapper {
    display: flex;
    justify-content: center;
    gap: 10px;

    button {
      &.selected {
        background-color: var(--green-1);
        color: var(--white-1);
      }
    }
  }
}
</style>
