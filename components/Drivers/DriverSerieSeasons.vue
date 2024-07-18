<template>
  <div class="component-DriverSerieSeason">
    <label class="header-section">
      <h3>{{ serieName }}</h3>
      <button
        class="blank toggle-list-open"
        :class="{ open: isOpen }"
        @click="toggleListOpen()"
      ></button>
    </label>
    <!-- <Transition name="slide-fade"> -->
    <div class="open-container-section" v-if="isOpen">
      <div class="selectable-year-container">
        <button
          :class="[isYearSelected(year) ? 'primary' : 'secondary v2']"
          v-for="year in yearList"
          :key="year"
          @click="selectYear(year)"
        >
          <span>
            {{ year }}
          </span>
        </button>
      </div>
      <div class="go-to-year-section">
        <NuxtLink :to="selectedSeasonLink" class="to-season button blank">
          <span> Katso koko {{ selectedYear }} kausi tästä. </span>
        </NuxtLink>
      </div>
      <div class="scoreboard-section">
        <div class="shadow"></div>
        <table class="scoreboard-table">
          <thead>
            <tr>
              <th>Sija</th>
              <th>Kuljettaja</th>
              <th>Pisteet</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(result, index) in selectedScoreboard"
              :key="result._id"
              :class="{ selected: isSelectedDriver(result) }"
            >
              <td>
                <NuxtLink :to="getDriverPageLink(result)" class="button blank"
                  >{{ result.placement }}.</NuxtLink
                >
              </td>
              <td>
                <NuxtLink :to="getDriverPageLink(result)" class="button blank">
                  {{ getDriverName(result) }}
                </NuxtLink>
              </td>
              <td>
                <NuxtLink :to="getDriverPageLink(result)" class="button blank">
                  {{ result.score }}
                </NuxtLink>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    <!-- </Transition> -->
  </div>
</template>

<script lang="ts">
import type { ScoreboardItem } from "~/interfaces/leaderboard.interface";
import type {
  ISeasonsOfSerie,
  ISerieSeasonWithLeaderboard,
} from "./DriverSeasonSection.service";
import type { DriftSerie } from "~/enums/drift-serie.enum";
import type { IDriver } from "~/interfaces/driver.interface";

export default {
  props: {
    serieWithSeasonStats: {
      type: Object as PropType<ISeasonsOfSerie>,
      required: true,
    },
    isOpen: {
      type: Boolean,
      required: false,
    },
    driverId: {
      type: String,
      required: true,
    },
  },
  data: () => ({
    selectedYear: 0,
  }),
  computed: {
    yearList(): number[] {
      const yearList =
        this.serieWithSeasonStats?.seasons.map((season) => season.year) || [];
      return yearList?.sort((a, b) => a - b) || [];
    },
    serieName(): string {
      return this.serieWithSeasonStats?.serieName || "";
    },
    serie(): DriftSerie {
      return this.serieWithSeasonStats.serie;
    },
    selectedScoreboard(): ScoreboardItem[] {
      return this.selectedSeason?.scoreboard || [];
    },
    selectedSeason(): ISerieSeasonWithLeaderboard | null {
      return (
        this.serieWithSeasonStats?.seasons.find(
          (season) => season.year === this.selectedYear
        ) || null
      );
    },
    selectedSeasonLink(): string {
      const slug = this.selectedSeason?.slug || "";

      return `/drift-season/${slug}?view=events`;
    },
    // leaderboards(): ILeaderboardWithSeasonInfo[] {
    //   return this.serieWithSeasonStats?.leaderboards || [];
    // },
  },
  watch: {
    yearList: {
      immediate: true,
      handler() {
        this.selectYear(this.yearList[this.yearList?.length - 1]);
      },
    },
  },
  methods: {
    getDriverPageLink(resultItem: ScoreboardItem): string {
      const driver = resultItem?.driver as IDriver;

      return `/drivers/${driver.slug}`;
    },
    toggleListOpen() {
      this.$emit("toggleListOpen", this.serie);
    },
    isYearSelected(year: number): boolean {
      return this.selectedYear === year;
    },
    selectYear(year: number) {
      this.selectedYear = year;
    },
    getDriverName(resultItem: ScoreboardItem): string {
      const driver = resultItem?.driver as IDriver;
      // const driver = this.allDriversList.find((d) => d?._id === driverId);
      return `${driver?.firstName} ${driver?.lastName}`;
    },
    isSelectedDriver(resultItem: ScoreboardItem): boolean {
      const driver = resultItem?.driver as IDriver;
      return driver?._id === this.driverId;
    },
  },
};
</script>

<style lang="less" scoped>
.component-DriverSerieSeason {
  border: 2px solid var(--black-2);
  padding: 12px;
  border-radius: 10px;
  padding-left: 24px;
  padding-right: 24px;

  // .slide-fade-enter-active {
  //   transition: all 0.3s ease-out;
  // }

  // .slide-fade-leave-active {
  //   transition: all 0.8s cubic-bezier(1, 0.5, 0.8, 1);
  // }

  // .slide-fade-enter-from,
  // .slide-fade-leave-to {
  //   transform: translateX(20px);
  //   opacity: 0;
  // }

  // .slide-fade-enter-active,
  // .slide-fade-leave-active {
  //   transform-origin: top;
  //   transition: transform 0.3s ease-in-out;

  // }

  // .slide-fade-enter-to,
  // .slide-fade-leave-from {
  //   transform: scaleY(1);
  // }

  // .slide-fade-enter-from,
  // .slide-fade-leave-to {
  //   transform: scaleY(0);
  // }

  .header-section {
    display: flex;
    justify-content: space-between;
    position: relative;
    cursor: pointer;
    transition: all 0.25s ease-in-out;

    h3 {
      transition: all 0.25s ease-in-out;
    }

    &:hover {
      h3 {
        color: var(--green-1);
      }

      .toggle-list-open {
        &:before {
          background-image: url("~/assets/svg/arrow-green.svg");
        }
      }
    }

    .toggle-list-open {
      &:before {
        content: "";
        position: absolute;
        background: url("~/assets/svg/arrow-grey.svg") no-repeat;
        background-size: contain;
        background-position: center;
        width: 35px;
        height: 35px;
        right: 12px;
        top: 50%;
        transform: translateY(-50%) rotate(-90deg);
        transition: 0.25s ease-in-out;
      }
      &.open {
        &:before {
          background-image: url("~/assets/svg/arrow-green.svg");
          transform: translateY(-50%) rotate(90deg);
        }
      }
    }
  }
  .open-container-section {
    .selectable-year-container {
      display: flex;
      gap: 8px;

      button {
        padding-left: 12px;
        padding-right: 12px;

        span {
          font-size: 18px;
          font-weight: 700;
        }
      }
    }

    .to-season {
      margin-top: 12px;
      display: block;
      span {
        color: var(--green-1);
        text-decoration: underline;
      }
    }
  }
  .scoreboard-section {
    .scoreboard-table {
      margin-bottom: 20px;
      tbody {
        .selected {
          td {
            background: var(--green-1) !important;
            color: var(--black-1);
            font-weight: 700;
            font-size: 20px;

            @media only screen and (max-width: 1090px)  {
              font-size: 16px;
            }
            @media only screen and (max-width: 520px)  {
              font-size: 12px;
            }
          }
        }
      }
    }
  }
}
</style>
