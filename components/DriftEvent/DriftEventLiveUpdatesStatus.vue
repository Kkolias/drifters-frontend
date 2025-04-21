<template>
  <div class="component-DriftEventLiseUpdatesStatus">
    <div class="container">
      <div class="status-wrapper">
        <div
          class="status-circle"
          :class="[isLiveUpdates ? 'live-updates' : 'not-live']"
        ></div>
        <div class="status-text">{{ liveUpdatesTitle }}</div>
        <button
          class="blank info-icon"
          @mouseover="handleMouseEnter"
          @mouseout="handleMouseLeave"
          @click="handleMouseEnter"
        ></button>
        <div class="info-hover" v-if="isHovering">
          <div class="text-container">
            <p>{{ liveUpdatesText }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Language from "~/mixins/language.vue";

const translations = {
  fi: {
    liveUpdatesTitle: "Live tulospäivitys",
    noLiveUpdatesTitle: "Ei live tulospäivitystä",
    noLiveUpdates:
      "Ei live tilanne päivitystä toistaiseksi tälle tapahtumalle. Ylläpitäjä päivittää teidot mahdollisimman pian.",
    hasLiveUpdates:
      "Tuloksia päivitetään tapahtuman aikana mahdollisimman nopeasti.",
  },
  en: {
    liveUpdatesTitle: "Live updates",
    noLiveUpdatesTitle: "No live updates",
    noLiveUpdates:
      "No live updates for this event for now. The admin will update the information as soon as possible.",
    hasLiveUpdates:
      "Results are updated as quickly as possible during the event.",
  },
};

export default {
  mixins: [Language],
  props: {
    isLiveUpdates: {
      type: Boolean,
      default: false,
    },
  },
  data: () => ({
    isHovering: false,
  }),
  computed: {
    textContent(): any {
      return this.getTranslation(translations);
    },
    liveUpdatesTitle(): string {
      if (!this.isLiveUpdates) {
        return this.textContent.noLiveUpdatesTitle;
      }
      return this.textContent.liveUpdatesTitle;
    },
    liveUpdatesText(): string {
      return this.isLiveUpdates
        ? this.textContent.hasLiveUpdates
        : this.textContent.noLiveUpdates;
    },
  },
  methods: {
    handleMouseEnter() {
      this.isHovering = true;
    },
    handleMouseLeave() {
      this.isHovering = false;
    }
  },
};
</script>

<style scoped lang="less">
.component-DriftEventLiseUpdatesStatus {
  margin: 16px auto;

  .container {
    display: flex;
    justify-content: center;
  }

  .status-wrapper {
    position: relative;
    display: inline-flex;
    gap: 8px;
    justify-content: center;
    align-items: center;

    .status-circle {
      width: 16px;
      height: 16px;
      border-radius: 50%;
      margin-right: 8px;

      &.live-updates {
        background-color: var(--green-1);
      }
      &.not-live {
        background-color: var(--error-color);
      }
    }

    .status-text {
      font-size: 14px;
      line-height: 16px;
      font-weight: 400;
    }

    .info-icon {
      width: 20px;
      height: 20px;
      cursor: pointer;
      border: 1px solid var(--white-1);
      border-radius: 50%;
      text-align: center;

      &:before {
        content: "?";
        margin-top: 1px;
        font-size: 16px;
        line-height: 16px;
        font-weight: 700;
        color: var(--white-1);
        text-align: center;
      }
    }
  }

  .info-hover {
    position: absolute;
    background-color: var(--black-2);
    border-radius: 8px;
    padding: 8px;
    box-shadow: 0px 0px 10px rgba(54, 54, 54, 0.25);
    z-index: 10;
    bottom: -16px;
    right: 0;
    transform: translateY(100%) translateX(20px);

    .text-container {
      font-size: 15px;
      line-height: 20px;
      font-weight: 400;
      color: var(--white-1);
      text-align: center;
    }

    &:before {
      content: "";
      position: absolute;
      top: -8px;
      right: 15px;
      width: 16px;
      height: 16px;
      background-color: var(--black-2);
      transform: translateX(-50%) rotate(45deg);
    }
  }
}
</style>
