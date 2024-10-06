<template>
  <div class="component-DriftSeasonDesktopTopThree">
    <div class="top-three-list">
      <div class="top-three-item second">
        <p class="position">2.</p>
        <p class="name">{{ getDriverName(secondItem) }}</p>
        <p class="points">{{ secondItem.score }} {{ textContent.points }}</p>
      </div>
      <div class="top-three-item first space-around">
        <div class="top">
          <p class="position">1.</p>
          <p class="name">{{ getDriverName(firstItem) }}</p>
          <p class="points">{{ firstItem.score }} {{ textContent.points }}</p>
        </div>
        <p class="champion-text">
          {{ textContent.seasons }} {{ seasonYear }} {{ textContent.champion }}
        </p>
      </div>
      <div class="top-three-item third">
        <p class="position">3.</p>
        <p class="name">{{ getDriverName(thirdItem) }}</p>
        <p class="points">{{ thirdItem.score }} {{ textContent.points }}</p>
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
    },
  },
  computed: {
    textContent() {
      return this.getTranslation(translations);
    },
    topThree(): ScoreboardItem[] {
      const sortedByScore = this.scoreboard.sort((a, b) => b.score - a.score);

      return sortedByScore.slice(0, 3);
    },
    firstItem(): ScoreboardItem {
      return this.topThree[0];
    },
    secondItem(): ScoreboardItem {
      return this.topThree[1];
    },
    thirdItem(): ScoreboardItem {
      return this.topThree[2];
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
.component-DriftSeasonDesktopTopThree {
  max-width: 670px;
  margin: auto;
  margin-bottom: 60px;

  .top-three-list {
    margin-top: 46px;
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    align-items: flex-end;
    gap: 12px;

    .top-three-item {
      display: flex;
      flex-direction: column;
      border: var(--white-1) 2px solid;
      border-radius: 10px;
      padding: 8px;

      &.space-around {
        justify-content: space-around;
      }

      .top {
        display: flex;
        flex-direction: column;
      }

      &.first {
        border-color: var(--green-1);
        height: 145px;
        position: relative;

        &:before {
          content: "";
          background: url("~/assets/svg/crown.svg") no-repeat;
          background-position-x: center;
          background-position-y: bottom;
          background-size: contain;
          width: 60px;
          height: 40px;
          position: absolute;
          left: 10px;
          top: 0;
          transform: translateY(-100%);
        }
      }

      &.second {
        height: 117px;
      }

      &.third {
        height: 84px;
      }

      .position {
        margin: 0;
        font-size: 24px;
        color: var(--green-1);
        font-weight: 700;
        text-align: center;
      }
      .name {
        margin: 8px 0;
        font-size: 18px;
        font-weight: 700;
        text-align: center;
      }
      .points {
        margin: 0;
        font-size: 14px;
        text-align: center;
      }
      .champion-text {
        margin: 8px 0 0 0;
        font-size: 14px;
        font-weight: 700;
        text-align: center;
        color: var(--green-1);
      }
      .winner-section {
        position: relative;
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
    }
  }
}
</style>
