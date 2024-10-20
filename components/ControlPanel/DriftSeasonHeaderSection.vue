<template>
  <div class="component-ControlPanelDriftSeasonHeaderSection">
    <div class="header">
      <h1 class="green-text">{{ seasonName }}</h1>
      <p class="green-text">Control panel</p>
    </div>
    <div class="select-event-section">
      <div class="single-select-container">
        <label for="event">Tapahtuma</label>
        <SingleSelect
          class="single-select"
          placeholderOption="Valitse tapahtuma"
          id="event"
          :value="selectedEventName"
          :optionList="parsedEventList"
          :selectedId="selectedEventId"
          @select="selectEvent"
        />
      </div>
      <button class="blank add-event-btn" @click="addNewEvent()">+</button>
    </div>
  </div>
</template>

<script lang="ts">
import { DRIFT_SERIES_LABEL } from "~/constants/drift-series";
import type { IDriftEvent } from "~/interfaces/drift-event.interface";
import type { IDriftSeason } from "~/interfaces/drift-season.interface";

interface ParsedDriftEvent extends IDriftEvent {
  key: string;
  label: string;
}

export default {
  props: {
    driftSeason: {
      type: Object as () => IDriftSeason,
      required: true,
    },
  },
  computed: {
    selectedEventId(): string {
      return this.$route?.query?.eventId as string;
    },
    seasonName(): string {
      const serie = this.driftSeason?.serie || "";
      if (!serie) return "??";

      const year = this.driftSeason?.year || "";
      const seasonName = DRIFT_SERIES_LABEL?.[serie] || serie;

      return `${seasonName} ${year}`;
    },
    eventList(): IDriftEvent[] {
      return this.driftSeason?.driftEvents || [];
    },
    parsedEventList(): Partial<ParsedDriftEvent>[] {
      return this.eventList.map((event) => ({
        key: event._id,
        label: event.name,
      }));
    },
    selectedEventName(): string {
      return (
        this.parsedEventList?.find(
          (event) => event.key === this.selectedEventId
        )?.label || ""
      );
    },
  },
  methods: {
    selectEvent(event: ParsedDriftEvent): void {
      this.$router.push({
        query: { eventId: event.key, "event-view": "overview" },
      });
    },
    addNewEvent(): void {
      this.$router.push({
        query: { eventId: "create-new", "event-view": "overview" },
      });
    },
  },
};
</script>

<style lang="less" scoped>
.component-ControlPanelDriftSeasonHeaderSection {
  .green-text {
    color: var(--green-1);
  }
  .header {
    h1 {
      margin: 0;
      text-align: center;
      line-height: 36px;
      font-size: 34px;
    }
    p {
      margin: 0;
      margin-top: 10px;
      text-align: center;
      font-size: 18px;
    }
  }

  .select-event-section {
    max-width: 350px;
    margin: auto;
    margin-top: 24px;
    display: flex;
    gap: 10px;
    .single-select-container {
      max-width: 300px;
      width: 100%;
      margin: auto;

      label {
        margin-left: 8px;
        margin-bottom: 4px;
        display: block;
      }
    }
    .add-event-btn {
      align-self: flex-end;
      background-color: var(--green-1);
      width: 30px;
      height: 30px;
      border-radius: 50%;
      // margin-left: 10px;
      margin-bottom: 2px;
      font-size: 34px;
      line-height: 30px;
      text-align: center;
      font-weight: 700;
      color: var(--black-1);
      transition: all 0.25s;

      &:hover {
        box-shadow: 0 0 5px 1px var(--green-1);
      }
    }
  }
}
</style>
