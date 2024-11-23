<template>
  <div class="component-BracketBattleOverview">
    <Modal :value="true" @close="closeModal()">
      <div class="content" slot="content">
        <div class="heat-wrapper">
          <h3>{{ heatNumber }}</h3>
        </div>
        <div class="top-section">
          <div class="driver-left">
            <div class="profile-picture"></div>
            <NuxtLink
              :title="`${driver1Name} kuljettajaprofiili`"
              class="button blank"
              :to="driver1ProfileLink"
            >
              <p :class="{ winner: isWinner('driver1') }">{{ driver1Name }}</p>
              <p v-if="isWinner('driver1')" class="advance-text">
                {{ advanceText }}
              </p>
            </NuxtLink>
          </div>
          <div class="driver-right">
            <div class="profile-picture"></div>
            <NuxtLink
              :title="`${driver2Name} kuljettajaprofiili`"
              class="button blank"
              :to="driver2ProfileLink"
            >
              <p :class="{ winner: isWinner('driver2') }">{{ driver2Name }}</p>
              <p v-if="isWinner('driver2')" class="advance-text">
                {{ advanceText }}
              </p>
            </NuxtLink>
          </div>
        </div>
        <div v-if="!isShowdown" class="driver-odds-section">
          <div class="odds-content">
            <p class="odds-title">{{ textContent.wins }}</p>
            <div class="odds-wrapper">
              <div class="odds">
                <p>{{ driver1Odds }}</p>
              </div>
              <div class="odds">
                <p>{{ driver2Odds }}</p>
              </div>
            </div>
          </div>
        </div>
        <div class="battle-section">
          <ul class="run-list">
            <li v-for="(run, index) in runList" :key="index" class="run">
              <p class="run-number">Run {{ index + 1 }}</p>
              <div class="judge-result">
                <div
                  class="judget-wrapper"
                  :class="resultClass(run, 'judgePoint1')"
                >
                  <div class="judge">
                    {{ resultJudgeText(run, "judgePoint1", "Judge 1") }}
                  </div>
                  <div class="result">advance</div>
                </div>
                <div
                  class="judget-wrapper"
                  :class="resultClass(run, 'judgePoint2')"
                >
                  <div class="judge">
                    {{ resultJudgeText(run, "judgePoint2", "Judge 2") }}
                  </div>
                  <div class="result">advance</div>
                </div>
                <div
                  class="judget-wrapper"
                  :class="resultClass(run, 'judgePoint3')"
                >
                  <div class="judge">
                    {{ resultJudgeText(run, "judgePoint3", "Judge 3") }}
                  </div>
                  <div class="result">advance</div>
                </div>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </Modal>
  </div>
</template>

<script lang="ts">
import { JudgePoint } from "~/enums/judge-point.enum";
import type {
  IHeat,
  IRunPairItem,
  IRunPairOdds,
} from "~/interfaces/competition-day.interface";
import type { IDriver } from "~/interfaces/driver.interface";
import type { IShowdownHeat } from "~/interfaces/qualifying-showdown.interface";
import Language from "~/mixins/language.vue";
import apiCompetitionDay from "~/utils/drifting/api-competition-day";

const translations = {
  fi: {
    advances: "Jatkaa seuraavaan vaiheeseen",
    winner: "Voittaja",
    bronze: "Pronssi",
    wins: "Voitto jakauma"
  },
  en: {
    advances: "Advances to next stage",
    winner: "Winner",
    bronze: "Bronze",
    wins: "Win distribution"
  },
};

interface IData {
  driverPreviousOdds: IRunPairOdds | null;
  loadingOdds: boolean;

  driver1OddsDecimal: number;
  driver2OddsDecimal: number;
}

export default {
  mixins: [Language],
  props: {
    heatItem: {
      type: Object as PropType<IHeat | IShowdownHeat>,
      required: true,
    },
    isShowdown: {
      type: Boolean,
      default: false,
    },
  },
  data: (): IData => ({
    driverPreviousOdds: null,
    loadingOdds: false,

    driver1OddsDecimal: 0,
    driver2OddsDecimal: 0,
  }),
  computed: {
    textContent() {
      return this.getTranslation(translations);
    },
    driver1Odds(): string {
      const oddsDecimal = this.driver1OddsDecimal
      const oddsPercentage = oddsDecimal === 0 ? 0 : oddsDecimal * 100;
      const roundedPercentage = Math.round(oddsPercentage * 100) / 100;
      return `${roundedPercentage}%`;
    },
    driver2Odds(): string {
      const oddsDecimal = this.driver2OddsDecimal
      const oddsPercentage = oddsDecimal === 0 ? 0 : oddsDecimal * 100;
      const roundedPercentage = Math.round(oddsPercentage * 100) / 100;
      return `${roundedPercentage}%`;
    },
    driver1Id(): string {
      const driver1 = this.heatItem?.driver1 as IDriver;
      return driver1?._id || "";
    },
    driver2Id(): string {
      const driver2 = this.heatItem?.driver2 as IDriver;
      return driver2?._id || "";
    },
    driver1Name(): string {
      const driver1 = this.heatItem?.driver1 as IDriver;
      const firstName = driver1?.firstName || "";
      const lastName = driver1?.lastName || "";
      return `${firstName} ${lastName}`;
    },
    driver2Name(): string {
      const driver2 = this.heatItem?.driver2 as IDriver;
      const firstName = driver2?.firstName || "";
      const lastName = driver2?.lastName || "";
      return `${firstName} ${lastName}`;
    },
    driver1ProfileLink(): string {
      const driver = this.heatItem?.driver1 as IDriver;
      const slug = driver?.slug || "";
      return `/drivers/${slug}`;
    },
    driver2ProfileLink(): string {
      const driver = this.heatItem?.driver2 as IDriver;
      const slug = driver?.slug || "";
      return `/drivers/${slug}`;
    },
    runList(): IRunPairItem[] {
      return this.heatItem?.runList || [];
    },
    heatNumber(): string {
      return `Heat ${this.heatItem?.bracketNumber}`;
    },
    advanceText() {
      if (this.isShowdown && this.heatItem?.bracketNumber === 3) {
        return this.textContent.winner;
      }
      if (this.heatItem?.bracketNumber === 32) {
        return this.textContent.winner;
      }
      if (this.heatItem?.bracketNumber === 31) {
        return this.textContent.bronze;
      }
      return this.textContent.advances;
    },
  },
  mounted() {
    this.fetchDriverBattleOdds();
  },
  methods: {
    async fetchDriverBattleOdds() {
      this.loadingOdds = true;
      const r = await apiCompetitionDay.getDriverBattleOdds(
        this.driver1Id,
        this.driver2Id
      );
      this.driverPreviousOdds = r;
      this.doOddsChangeAnimation();
      this.loadingOdds = false;
    },
    doOddsChangeAnimation(): void {
      this.driver1OddsDecimal = 0;
      this.driver2OddsDecimal = 0;
      if (this.driverPreviousOdds) {
        const driver1OddsDecimal = this.driverPreviousOdds?.driver1 || 0;
        const driver2OddsDecimal = this.driverPreviousOdds?.driver2 || 0;
        const interval = 20;
        const step = 0.01;
        const intervalId = setInterval(() => {
          if (this.driver1OddsDecimal < driver1OddsDecimal) {
            this.driver1OddsDecimal += step;
          }
          if (this.driver2OddsDecimal < driver2OddsDecimal) {
            this.driver2OddsDecimal += step;
          }
          if (
            this.driver1OddsDecimal >= driver1OddsDecimal &&
            this.driver2OddsDecimal >= driver2OddsDecimal
          ) {
            clearInterval(intervalId);
          }
        }, interval);
      }
    },
    closeModal() {
      this.$emit("close");
    },
    isWinner(driverKey: "driver1" | "driver2"): boolean {
      const winner = getWinnerIdOfHeat(this.heatItem) as unknown as IDriver;
      const driver = this.heatItem?.[driverKey] as IDriver;
      return winner?._id === driver?._id;
    },
    resultClass(
      run: IRunPairItem,
      key: "judgePoint1" | "judgePoint2" | "judgePoint3"
    ): string {
      const point = run[key];
      if (point === JudgePoint.driver1) return "left";
      if (point === JudgePoint.driver2) return "right";
      if (point === JudgePoint.omt) return "omt";
      return "not-judget";
    },
    resultJudgeText(
      run: IRunPairItem,
      key: "judgePoint1" | "judgePoint2" | "judgePoint3",
      label: string
    ): string {
      const point = run[key];
      if (point === JudgePoint.omt) return "OMT";
      return label;
    },
  },
};
</script>

<style lang="less" scoped>
.component-BracketBattleOverview {
  .content {
    background: var(--black-1);
    border-radius: 10px;
    padding: 20px;
    box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.75);
    width: 450px;

    .heat-wrapper {
      display: flex;
      align-items: center;
      justify-content: center;

      h3 {
        margin: 0;
        font-size: 22px;
        font-weight: bold;
        white-space: nowrap;
      }
    }

    .top-section {
      display: grid;
      justify-content: center;
      // flex-wrap: nowrap;
      gap: 24px;
      grid-template-columns: 1fr 1fr;

      .driver-left,
      .driver-right {
        .profile-picture {
          min-height: 100px;
        }

        p {
          text-align: center;
          font-size: 24px;
          margin-bottom: 0;

          &.winner {
            color: var(--green-1);
            font-weight: bold;
          }
        }
        .advance-text {
          font-size: 12px;
          color: var(--green-1);
          margin: 0;
        }
      }
      // .driver-left {
      //   margin-right: 48px;
      // }
      // .driver-right {
      //   margin-left: 48px;
      // }
    }

    .driver-odds-section {
      .odds-content {
        .odds-title {
          margin-bottom: 0;
          font-size: 18px;
          text-align: center;
        }

        .odds-wrapper {
          display: flex;
          justify-content: space-around;
          gap: 12px;
          margin-top: 12px;

          .odds {
            p {
              font-weight: 700;
              font-size: 20px;
              margin: 0;
            }
          }
        }
      }
    }

    .run-list {
      list-style: none;
      padding: 0;
      display: flex;
      flex-direction: column;
      justify-content: center;
      margin: 0;

      .run {
        margin-top: 16px;
        .run-number {
          text-align: center;
          font-size: 24px;
          font-weight: bold;
          margin: 6px 0;
        }
        .judge-result {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 12px;
          position: relative;

          &:after {
            content: "";
            width: 1px;
            height: 100%;
            background: var(--white-1);
            position: absolute;
            top: 0;
            left: 50%;
            transform: translateX(-50%);
            z-index: 1;
          }

          .judget-wrapper {
            position: relative;
            z-index: 2;
            .judge {
              background: var(--black-1);
              border-radius: 10px;
              border: 1px solid var(--white-1);
              padding: 0 12px;
              height: 40px;
              line-height: 42px;
              display: inline-block;
            }

            &.omt {
              .judge {
                background: var(--black-2);
              }
            }

            .result {
              height: 28px;
              padding: 0 12px;
              color: var(--black-dark);
              line-height: 28px;
              border: 1px solid var(--white-1);
              //   &.left {
              //     background: var(--green-1);
              //     border-radius: 10px 0 0 10px;
              //     position: absolute;
              //     left: 1px;
              //     top: 50%;
              //     transform: translate(-100%, -50%);
              //   }
              //   &.right {
              //     background: var(--green-1);
              //     border-radius: 0 10px 10px 0;
              //     position: absolute;
              //     right: 1px;
              //     top: 50%;
              //     transform: translate(100%, -50%);
              //   }
              &.omt {
                display: none;
              }
              &.not-judget {
                display: none;
              }
            }

            &.left {
              .result {
                background: var(--green-1);
                border-radius: 10px 0 0 10px;
                position: absolute;
                left: 1px;
                top: 50%;
                transform: translate(-100%, -50%);
              }
            }
            &.right {
              .result {
                background: var(--green-1);
                border-radius: 0 10px 10px 0;
                position: absolute;
                right: 1px;
                top: 50%;
                transform: translate(100%, -50%);
              }
            }
            &.omt,
            &.not-judget {
              .result {
                display: none;
              }
            }
          }
        }
      }
    }
  }

  @media only screen and (max-width: 1090px) {
    .content {
      .top-section {
        gap: 12px;
        .driver-left,
        .driver-right {
          .profile-picture {
            min-height: 80px;
          }
          p {
            font-size: 20px;
          }
          .advance-text {
            font-size: 10px;
          }
        }
        .heat-wrapper {
          h3 {
            font-size: 20px;
          }
        }
      }
    }
  }
  @media only screen and (max-width: 550px) {
    .content {
      width: 350px;
    }
  }
  @media only screen and (max-width: 410px) {
    .content {
      width: 300px;
    }
  }
  @media only screen and (max-width: 350px) {
    .content {
      width: 270px;
    }
  }
}
</style>
