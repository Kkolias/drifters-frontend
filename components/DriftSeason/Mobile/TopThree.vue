<template>
  <div class="component-DriftSeasonMobileTopThree">
    <h2 class="top-three-header">{{ textContent.seasons }} Top 3</h2>
    <div class="top-three-list">
      <div
        v-for="(item, index) in topThree"
        :key="index"
        class="top-three-item"
        :class="{ winner: index === 0 }"
      >
        <div v-if="index === 0" class="winner-section">
          <p>{{ textContent.seasons }} {{ seasonYear }} {{ textContent.champion }}!</p>
        </div>
        <div class="driver-info">
          <p class="position">{{ index + 1 }}.</p>
          <div class="name-container">
            <p class="name">{{ getDriverName(item) }}</p>
            <p class="score">{{ item.score }} {{ textContent.points }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import type { IDriver } from "~/interfaces/driver.interface";
import type { ScoreboardItem } from "~/interfaces/leaderboard.interface";
import Language from "~/mixins/language.vue";

const translations = {
  fi: {
    seasons: "Kauden",
    points: "pistettä",
    champion: "mestari",
  },
  en: {
    seasons: "Season",
    points: "points",
    champion: "champion",
  },
};

export default {
  mixins: [Language],
  props: {
    scoreboard: {
      type: Array as () => ScoreboardItem[],
      required: true,
    },
    driverList: {
      type: Array as () => IDriver[],
      required: true,
    },
    seasonYear: {
        type: String,
        required: true,
    }
  },
  computed: {
    textContent() {
      return this.getTranslation(translations);
    },
    topThree(): ScoreboardItem[] {
      const sortedByScore = this.scoreboard.sort((a, b) => b.score - a.score);

      return sortedByScore.slice(0, 3);
    },
  },
  methods: {
    getDriverName(item: ScoreboardItem): string {
      const driverId = item.driver as string;

      const driver = this.driverList.find((d) => d._id === driverId);

      return driver ? `${driver.firstName} ${driver.lastName}` : "";
    },
  },
};
</script>

<style lang="less" scoped>
.component-DriftSeasonMobileTopThree {
  .top-three-header {
    font-size: 24px;
    color: var(--green-1);
    text-align: center;
  }

  .top-three-list {
    display: flex;
    flex-direction: column;
    gap: 8px;
    max-width: 424px;
    width: calc(100% - 16px);
    padding: 0 8px;
    margin: auto;

    .top-three-item {
      display: flex;
      flex-direction: column;
      border: var(--white-1) 2px solid;
      border-radius: 10px;
      padding: 8px;

      &.winner {
        border-color: var(--green-1);
      }
      .winner-section {
        position: relative;
        &:before {
          content: "";
          background: url("~/assets/svg/crown.svg") no-repeat center;
          background-size: contain;
          width: 40px;
          height: 34px;
          position: absolute;
          left: 10px;
          top: 50%;
          transform: translateY(-50%);
        }
        p {
          margin: 8px 0 4px 0px;
          color: var(--green-1);
          text-align: center;
          font-weight: 700;

          @media only screen and (max-width: 400px) {
            margin-left: 30px;
          }
        }
      }
      .driver-info {
        display: grid;
        grid-template-columns: 60px 1fr;

        .position {
          font-size: 34px;
          margin: auto;
          color: var(--green-1);
          font-weight: 700;
          text-align: center;
        }

        .name-container {
          margin-left: 40px;
          @media only screen and (max-width: 400px) {
            margin-left: 10px;
          }
          p {
            font-size: 18px;
            text-align: left;
            margin: 12px 0;

            &.name {
              font-size: 20px;
              font-weight: 700;
            }
          }
        }
      }
    }
  }
}
</style>
