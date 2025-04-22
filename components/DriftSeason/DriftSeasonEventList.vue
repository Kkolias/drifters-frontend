<template>
  <div class="component-DriftSeasonEventList">
    <LoadingIndicator v-if="showLoading" />
    <h2 v-if="showNoEventList">{{ textContent.noEventsToShow }}</h2>
    <ul v-if="showEventList" class="event-list">
      <li
        v-for="(event, index) in eventList"
        :key="index"
        class="event-item"
        :class="{ active: isEventActive(event) }"
      >
        <NuxtLink class="to-event" :to="pathToEvent(event)">
          <div class="cancelled-overlay" v-if="isCancelled(event)">
            <p>{{ textContent.eventCancelled }}</p>
          </div>
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
import countryLang from "~/lang/country.lang";
import Language from "~/mixins/language.vue";
import translations from "~/lang/components/DriftSeasonEventList.lang";

export default {
  mixins: [Language],
  props: {
    season: {
      type: Object as PropType<IDriftSeason>,
      default: () => ({} as IDriftSeason),
    },
    loading: {
      type: Boolean,
      default: false,
    },
    eventSlug: {
      type: String,
      default: "",
    },
  },
  computed: {
    countryTextContent() {
      return this.getTranslation(countryLang);
    },
    textContent() {
      return this.getTranslation(translations);
    },
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
    isCancelled(event: IDriftEvent) {
      return event?.isCancelled || false
    },
    isEventActive(event: IDriftEvent) {
      return event?.slug === this.eventSlug;
    },
    pathToEvent(event: IDriftEvent) {
      return `/drift-season/${this.season.slug}/event/${event.slug}#event-info`;
    },
    eventName(event: IDriftEvent) {
      return event?.name;
    },
    eventDates(event: IDriftEvent) {
      return eventDates(event);
    },
    eventCountry(event: IDriftEvent) {
      const country = event?.country;
      const parsedCountry = getCountryName(country, this.countryTextContent);
      return parsedCountry === "N/A" ? country : parsedCountry;
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
    padding: 0;
    gap: 16px;

    .event-item {
      .to-event {
        display: block;
        border: 2px solid var(--white-1);
        border-radius: 10px;
        padding-right: 50px;
        padding-left: 20px;
        position: relative;
        width: 350px;
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
          transition: all 0.25s ease-in-out;
        }

        // display: inline-block;
        text-decoration: none;
        color: var(--white-1);

        .cancelled-overlay {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-color: rgba(0, 0, 0, 0.8);
          z-index: 1;
          border-radius: 5px;

          p {
            font-size: 24px;
            line-height: 80px;
            color: var(--error-color);
            font-weight: 700;
            margin: 0;
            text-align: center;
            vertical-align: middle;
          }
        }

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
        &:hover {
          &:before {
            background: url("~/assets/svg/arrow-green.svg") no-repeat;
            background-size: 20px;
          }
          box-shadow: 0px 0px 15px rgba(0, 0, 0, 0.25);
          transform: scale(1.05);
        }
      }
      &.active {
        .to-event {
          border-color: var(--green-1);
          background-color: var(--black-2);
        }
      }
    }
  }

  @media only screen and (max-width: 500px) {
    .event-list {
      padding: 0 12px;
      .event-item {
        width: 100%;
        position: relative;
        padding: 0;
        .to-event {
          width: calc(100% - 20px - 50px);

          &:before {
            right: 6px;
          }

          .top-row {
            .event-name {
              font-size: 20px;
            }
          }

          .bottom-row {
            .date {
              font-size: 16px;
            }
            .country {
              font-size: 14px;
            }
          }

          .cancelled-overlay {
            p {
              line-height: 60px;
              font-size: 20px;
            }
          }
        }
      }
    }
  }

  @media only screen and (max-width: 400px) {
    .event-list {
      .top-row {
        .event-name {
          font-size: 18px;
          margin: 6px !important;
        }
      }

      .bottom-row {
        flex-wrap: wrap;
        .date {
          font-size: 14px;
          margin: 0 6px 6px 6px !important;
        }
        .country {
          font-size: 12px;
          margin: 0 6px 6px 6px !important;
        }
      }
    }
  }
}
</style>
