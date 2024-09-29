<template>
  <div class="component-EventInfo">
    <div class="summary-section">
      <h2>Tapahtuman yhteenveto</h2>
      <div class="event-info-container">
        <p>
          Rata: <span>{{ eventTrack }}</span>
        </p>
        <p>
          Kaupunki: <span>{{ eventCityCountry }}</span>
        </p>
        <p>
          Ajankohta: <span>{{ eventDates }}</span>
        </p>
      </div>
    </div>
    <div v-if="nextEvent" class="next-event-container">
      <NuxtLink class="to-event" :to="nextEventPath">
        <span class="event-name">Seuraava tapahtuma: {{ nextEventName }}</span>
      </NuxtLink>
    </div>
    <div class="to-season-overview">
      <NuxtLink class="to-season" :to="pathToSeasonOnverview">
        <span class="event-name">Koko kauden yhteenveto</span>
      </NuxtLink>
    </div>
    <div class="track-layout">
      <h2>Ratakartta</h2>
      <img
        v-if="eventTrackLayoutUrl"
        :src="eventTrackLayoutUrl"
        alt="track-layout"
      />
      <div v-else class="no-track-layout">
        <p>Ei vielä ratakarttaa</p>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { TRACK_LAYOUTS } from "~/constants/track-layouts";
import type { IDriftEvent } from "~/interfaces/drift-event.interface";

export default {
  props: {
    driftEvent: {
      type: Object as PropType<IDriftEvent>,
      required: true,
    },
    seasonSlug: {
      type: String,
      required: true,
    },
    nextEvent: {
      type: Object as PropType<IDriftEvent>,
      default: () => null,
    },
  },
  computed: {
    nextEventPath(): string {
      return `/drift-season/${this.seasonSlug}/event/${this.nextEvent.slug}?view=event-info`;
    },
    nextEventName(): string {
      return this.nextEvent?.name || "";
    },
    pathToSeasonOnverview(): string {
      return `/drift-season/${this.seasonSlug}?view=events`;
    },
    driftEventId(): string {
      return this.driftEvent._id;
    },
    eventTrackLayoutUrl(): string {
      const r = TRACK_LAYOUTS?.[this.driftEventId];
      return r || "";
    },
    driftEventName(): string {
      return this.driftEvent?.name || "";
    },
    eventTrack(): string {
      return this.driftEvent?.track || "";
    },
    eventCity(): string {
      return this.driftEvent?.city || "";
    },
    eventCityCountry(): string {
      return `${this.eventCity}, ${this.eventCountry}`;
    },
    eventCountry(): string {
      const country = this.driftEvent?.country || "";
      return getCountryName(country);
    },
    eventDates(): string {
      const start = this.driftEvent?.startsAt || "";
      const end = this.driftEvent?.endsAt || "";

      const startDate = formatISODateToStringShort(start);
      const endDate = formatISODateToStringShort(end);

      return `${startDate} - ${endDate}`;
    },
  },
};
</script>

<style lang="less" scoped>
.component-EventInfo {
  h2 {
    margin: 0;
    font-size: 24px;
    text-align: center;
    color: var(--green-1);
  }
  .event-info-container {
    max-width: 270px;
    margin: 0 auto;
    p {
      font-size: 14px;
      font-weight: 400;

      span {
        font-weight: 700;
      }
    }
  }
  .next-event-container {
    text-align: center;
    
    .to-event {
      display: inline-block;
      border: 2px solid var(--white-1);
      border-radius: 10px;
      padding-top: 10px;
      padding-bottom: 10px;
      padding-right: 40px;
      padding-left: 10px;
      position: relative;
      min-width: 200px;
      box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.25);
      margin: auto;
      font-size: 13px;
      transition: all 0.25s ease-in-out;
      background: var(--black-2);

      &:before {
        content: "";
        background: url("~/assets/svg/arrow-grey.svg") no-repeat;
        background-size: 15px;
        background-position: center;
        width: 35px;
        height: 34px;
        position: absolute;
        right: 0px;
        top: 0;
        // transform: translateY(-50%);
        transition: all 0.25s ease-in-out;
      }
      &:hover {
        &:before {
          background: url("~/assets/svg/arrow-green.svg") no-repeat;
          background-size: 15px;
          background-position: center;
        }
        box-shadow: 0px 0px 15px rgba(0, 0, 0, 0.25);
        transform: scale(1.05);
      }
    }
  }
  .to-season-overview {
    margin-bottom: 36px;
    margin-top: 26px;
    text-align: center;
    .to-season {
      text-align: center;
      text-decoration: underline;
    }
  }
  .track-layout {
    text-align: center;
    img {
      margin: auto;
      margin-top: 4px;
      max-width: 500px;
      width: 100%;
      height: auto;
      border: 2px solid var(--white-1);
      border-radius: 10px;
    }

    .no-track-layout {
      margin-top: 4px;
      height: 100px;
      border: 2px solid var(--white-1);
      border-radius: 10px;

      p {
        margin: 0;
        line-height: 100px;
        text-align: center;
        font-size: 18px;
      }
    }
  }
}
</style>
