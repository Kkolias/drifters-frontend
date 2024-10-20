<template>
  <div class="component-ControlPanelDriftSeasonPage">
    <LoadingIndicator v-if="loading.season" />
    <div v-if="driftSeason" class="content">
      <ControlPanelDriftSeasonHeaderSection :driftSeason="driftSeason" @reloadData="fetchDriftSeason" />
    </div>
    <ControlPanelDriftEventWrapper
      :driftEventId="selectedEventId"
      @setUpdatedEvent="setUpdatedEvent"
      @reloadSeason="fetchDriftSeason"
    />
    <!-- <pre>{{ driftSeason }}</pre> -->
  </div>
</template>

<script lang="ts">
import type { LocationQuery } from "vue-router";
import type { IDriftEvent } from "~/interfaces/drift-event.interface";
import type { IDriftSeason } from "~/interfaces/drift-season.interface";
import apiDriftSeason from "~/utils/drifting/api-drift-season";

interface IData {
  loading: {
    season: boolean;
  };
  driftSeason: IDriftSeason | null;
}
export default {
  props: {
    seasonId: {
      type: String,
      required: true,
    },
  },
  data: (): IData => ({
    loading: {
      season: true,
    },
    driftSeason: null,
  }),
  computed: {
    queryParams(): LocationQuery {
      return this.$route?.query;
    },
    selectedEventId(): string {
      if(this.queryParams?.eventId === "create-new") {
        return "";
      }
      return this.$route?.query?.eventId as string;
    },
    selectedDriftEvent(): IDriftEvent | null {
      return (
        this.driftSeason?.driftEvents.find(
          (event) => event._id === this.selectedEventId
        ) || null
      );
    },
  },
  watch: {
    seasonId: {
      immediate: true,
      handler() {
        this.fetchDriftSeason();
      },
    },
  },
  methods: {
    async fetchDriftSeason() {
      this.setLoadingByKey("season", true);
      const season = await apiDriftSeason.getDriftSeasonById(this.seasonId);
      if (season) {
        this.setDriftSeason(season);
      }
      this.setLoadingByKey("season", false);
    },

    setLoadingByKey(key: keyof IData["loading"], value: boolean) {
      this.loading[key] = value;
    },
    setDriftSeason(driftSeason: IDriftSeason) {
      this.driftSeason = driftSeason;
    },
    setUpdatedEvent(updatedEvent: IDriftEvent) {
      const updatedEventList = this.driftSeason?.driftEvents.map((event) => {
        if (event._id === updatedEvent._id) {
          return {
            ...event,
            ...updatedEvent,
          };
        }
        return event;
      }) as IDriftEvent[];

      this.setDriftSeason({
        ...this.driftSeason as IDriftSeason,
        driftEvents: updatedEventList || [],
      });
    },
  },
};
</script>

<style lang="less" scoped>
.component-ControlPanelDriftSeasonPage {
  .content {
  }
}
</style>
