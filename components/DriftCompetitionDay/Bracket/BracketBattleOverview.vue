<template>
  <div class="component-BracketBattleOverview">
    <Modal :value="true" @close="closeModal()">
      <div class="content" slot="content">
        <div class="top-section">
          <div class="driver-left">
            <div class="profile-picture"></div>
            <p :class="{ winner: isWinner('driver1') }">{{ driver1Name }}</p>
            <p v-if="isWinner('driver1')" class="advance-text">
              Jatkaa seuraavaan vaiheeseen
            </p>
          </div>
          <div class="heat-wrapper">
            <h3>{{ heatNumber }}</h3>
          </div>
          <div class="driver-right">
            <div class="profile-picture"></div>
            <p :class="{ winner: isWinner('driver2') }">{{ driver2Name }}</p>
            <p v-if="isWinner('driver2')" class="advance-text">
              Jatkaa seuraavaan vaiheeseen
            </p>
          </div>
        </div>
        <div class="battle-section">
          <ul class="run-list">
            <li v-for="(run, index) in runList" :key="index" class="run">
              <p class="run-number">Run 88</p>
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
} from "~/interfaces/competition-day.interface";
import type { IDriver } from "~/interfaces/driver.interface";

export default {
  props: {
    heatItem: {
      type: Object as PropType<IHeat>,
      required: true,
    },
  },
  computed: {
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
    runList(): IRunPairItem[] {
      return this.heatItem?.runList || [];
    },
    heatNumber(): string {
      return `Heat ${this.heatItem?.bracketNumber}`;
    },
  },
  methods: {
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

    .top-section {
      display: flex;
      justify-content: center;
      gap: 24px;

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
      .heat-wrapper {
        display: flex;
        align-items: center;

        h3 {
          margin: 0;
          font-size: 24px;
          font-weight: bold;
        }
      }
      .driver-left {
        margin-right: 48px;
      }
      .driver-right {
        margin-left: 48px;
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
            &.omt, &.not-judget {
              .result {
                display: none;
              }
            }
          }
        }
      }
    }
  }
}
</style>
