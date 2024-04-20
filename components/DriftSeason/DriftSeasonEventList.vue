<template>
  <div class="component-DriftSeasonEventList">
    <LoadingIndicator v-if="showLoading" />
    <h2 v-if="showNoEventList">Ei näytettäviä tapahtumia</h2>
    <ul v-if="showEventList" class="event-list">
      <li v-for="(event, index) in eventList" :key="index" class="event-item">
        <NuxtLink class="to-event" :to="eventQueryPath(event)">
          <div class="top-row">
            <h3 class="event-name">{{ eventName(event) }}</h3>
          </div>
          <div class="bottom-row">
            <p class="date">{{ eventDates(event) }}</p>
            <p class="country">{{ eventCountry(event) }}</p>
          </div>
        </NuxtLink>
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import type { IDriftEvent } from "~/interfaces/drift-event.interface";
import type { IDriftSeason } from "~/interfaces/drift-season.interface";
import { eventDates } from "~/utils/driftEvent";

export default {
  props: {
    season: {
      type: Object as PropType<IDriftSeason>,
      default: () => ({} as IDriftSeason),
    },
    loading: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    showLoading(): boolean {
      return this.loading || !this.season;
    },
    showNoEventList(): boolean {
      return !this.showLoading && !this.eventList?.length;
    },
    showEventList(): boolean {
      return !this.showLoading && !!this.eventList?.length;
    },
    eventList() {
      return this.season?.driftEvents || [];
    },
  },
  methods: {
    eventQueryPath(event: IDriftEvent) {
      return {
        query: {
          "event-id": event?._id,
          view: "events",
        },
      };
    },
    eventName(event: IDriftEvent) {
      return event?.name;
    },
    eventDates(event: IDriftEvent) {
      return eventDates(event);
    },
    eventCountry(event: IDriftEvent) {
      return event?.country;
    },
  },
};
</script>

<style lang="less" scoped>
.component-DriftSeasonEventList {
  h2 {
    text-align: center;
  }
  .event-list {
    list-style: none;
    margin-top: 24px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 16px;

    .event-item {
      border: 2px solid var(--white-1);
      border-radius: 10px;
      padding-right: 50px;
      padding-left: 20px;
      position: relative;
      max-width: 400px;
      width: 100%;
      box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.25);
      transition: all 0.25s ease-in-out;

      &:before {
        content: "";
        background: url("~/assets/svg/arrow-grey.svg") no-repeat;
        background-size: 20px;
        width: 35px;
        height: 35px;
        position: absolute;
        right: 20px;
        top: 50%;
        transform: translateY(-50%);
      }

      .to-event {
        display: inline-block;
        text-decoration: none;
        color: var(--white-1);

        .top-row {
          .event-name {
            font-size: 24px;
            line-height: 26px;
            color: var(--green-1);
            font-weight: 700;
            margin: 12px;
          }
        }

        .bottom-row {
          display: flex;
          justify-content: flex-start;

          .date {
            margin: 12px;
            margin-top: 0;
            margin-right: 0;
            font-size: 18px;
          }
          .country {
            margin: 12px;
            margin-top: 0;
            font-size: 16px;
          }
        }
      }

      &:hover {
        &:before {
          background: url("~/assets/svg/arrow-green.svg") no-repeat;
          background-size: 20px;
        }
        box-shadow: 0px 0px 15px rgba(0, 0, 0, 0.25);
        transform: scale(1.05);
      }
    }
  }
}
</style>
