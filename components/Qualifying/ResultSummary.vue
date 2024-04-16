<template>
  <div class="component-ResultSummary">
    <Modal :value="true" @close="close()">
      <div class="content">
        <div class="driver-profile-wrapper">
          <div class="profile-picure-weapper"></div>
          <div class="driver-info-wrapper">
            <p>
              {{ driverName }} {{ driverNumber }}
            </p>
          </div>
        </div>
        <div class="result-wrapper">
          <div class="final-result">
            <p>
              Lajittelun pisteet <span>{{ highestPoints }}</span>
            </p>
          </div>
          <div class="runs-wrapper">
            <div class="first run">
              <p class="sub-title">1. kierros</p>
              <div class="point-container">
                <p>Linja</p>
                <p class="point">{{ run1.line }}</p>
              </div>
              <div class="point-container">
                <p>Kulma</p>
                <p class="point">{{ run1.angle }}</p>
              </div>
              <div class="point-container">
                <p>Tyyli</p>
                <p class="point">{{ run1.style }}</p>
              </div>
              <div class="point-container">
                <p>Yhteensä</p>
                <p class="point">{{ run1Points }}</p>
              </div>
            </div>
            <div class="second run">
              <p class="sub-title">2. kierros</p>
              <div class="point-container">
                <p>Linja</p>
                <p class="point">{{ run2.line }}</p>
              </div>
              <div class="point-container">
                <p>Kulma</p>
                <p class="point">{{ run2.angle }}</p>
              </div>
              <div class="point-container">
                <p>Tyyli</p>
                <p class="point">{{ run2.style }}</p>
              </div>
              <div class="point-container">
                <p>Yhteensä</p>
                <p class="point">{{ run2Points }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  </div>
</template>

<script lang="ts">
import type { IDriver } from "~/interfaces/driver.interface";
import type { IQualifyingResultItem } from "~/interfaces/qualifying.interface";

export default {
  props: {
    qualifyingResultItem: {
      type: Object as PropType<IQualifyingResultItem>,
      required: true,
    },
  },
  computed: {
    driverName(): string {
      const driver = this.qualifyingResultItem?.driver as IDriver;
      return `${driver?.firstName || ""} ${driver?.lastName || ""}`;
    },
    driverNumber(): string {
      const driver = this.qualifyingResultItem?.driver as IDriver;
      if(!driver?.raceNumber) return "";
      return `#${driver?.raceNumber}`;
    },
    highestPoints(): number {
      return this.qualifyingResultItem?.highestPoints || 0;
    },
    run1(): any {
      return (
        this.qualifyingResultItem?.run1 || {
          line: 0,
          angle: 0,
          style: 0,
        }
      );
    },
    run1Points(): number {
      return this.qualifyingResultItem?.run1Points || 0;
    },
    run2(): any {
      return (
        this.qualifyingResultItem?.run2 || {
          line: 0,
          angle: 0,
          style: 0,
        }
      );
    },
    run2Points(): number {
      return this.qualifyingResultItem?.run2Points || 0;
    },
  },
  methods: {
    close(): void {
      this.$emit("close");
    },
  },
};
</script>

<style lang="less" scoped>
.component-ResultSummary {
  .content {
    background: var(--black-1);
    width: 450px;
    padding: 48px 24px;
    border-radius: 10px;
    box-shadow: 0px 0px 10px 10px rgba(0, 0, 0, 0.25);

    .driver-profile-wrapper {
      .profile-picure-weapper {
        background: url("~/assets/svg/profile-picture-placeholder.svg");
        background-size: contain;
        background-position: center;
        background-repeat: no-repeat;
        width: 100%;
        height: 160px;
      }
      .driver-info-wrapper {
        p {
          font-size: 1.3rem;
          text-align: center;
        }
      }
    }

    .result-wrapper {
      .final-result {
        margin: 32px 0 12px 0;
        p {
          margin: 0;
          font-size: 1.6rem;
          line-height: 2rem;
          text-align: center;
          span {
            margin-left: 12px;
            font-weight: bold;
            font-size: 3rem;
            color: var(--green-1);
          }
        }
      }
      .runs-wrapper {
        display: grid;
        grid-template-columns: 130px 130px;
        justify-content: center;
        gap: 24px;

        .run {
          .point-container {
            display: flex;
            justify-content: space-between;
            margin-bottom: 9px;

            p {
              margin: 0;
              font-size: 1.2rem;

              &.point {
                font-weight: bold;
                color: var(--green-1);
              }
            }
          }
          

          .sub-title {
            margin: 0;
            font-size: 1.4rem;
            margin-bottom: 12px;
            color: var(--green-1);
            opacity: 0.8;
          }
        }
      }
    }
  }
}
</style>
