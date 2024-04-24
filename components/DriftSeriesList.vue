<template>
  <div class="component-DriftSeriesList">
    <h1>Drifting-sarjat ja kaudet</h1>
    <h3 class="subtitle">
      Enemmän tai vähemmän kattava lista drifting-kilpailusarjoista ja niiden
      kausista
    </h3>
    <ul class="serie-list">
      <li class="serie" v-for="(serie, index) in series" :key="index">
        <button
          class="blank serie-overview"
          :class="{ selected: isListOpen(index) }"
          @click="handleOpenList(index)"
        >
          <h2>{{ serie.name }}</h2>
          <p>
            {{ serie.subText }}
          </p>
        </button>
        <div v-if="isListOpen(index)" class="season-list-wrapper">
          <ul class="season-list">
            <li
              class="season"
              v-for="(season, key) in serie.seasonList"
              :key="key"
            >
              <NuxtLink class="button blank link" :to="getSeasonPath(season)">
                <div class="season-overview">
                  <h3>{{ getSeasonName(season, serie) }} {{ season.year }}</h3>
                </div>
              </NuxtLink>
            </li>
          </ul>
        </div>
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import { DRIFT_SERIES_LABEL } from "~/constants/drift-series";
import { DriftSerie } from "~/enums/drift-serie.enum";
import type { IDriftSeason } from "~/interfaces/drift-season.interface";
import apiDriftSeason from "~/utils/drifting/api-drift-season";
import text from "~/lang/series.lang";

interface IData {
  seasons: IDriftSeason[];
  loading: boolean;
  openedLists: number[];
}

export default {
  data: (): IData => ({
    seasons: [],
    loading: false,
    openedLists: [],
  }),
  computed: {
    series(): any[] {
      return Object.values(DriftSerie).map((serie) => {
        return {
          name: DRIFT_SERIES_LABEL[serie],
          subText: text.fi.seriesTexts?.[serie] || "",
          seasonList:
            this.seasons?.filter((season) => season?.serie === serie) || [],
        };
      });
    },
  },
  mounted() {
    this.fetchSeasonList();
  },
  methods: {
    getSeasonName(season: IDriftSeason, serie: any): string {
      return season?.name ? season.name : serie.name;
    },
    getSeasonPath(season: IDriftSeason): string {
      return `/drift-season/${season._id}?view=events`;
    },
    handleOpenList(index: number): void {
      if (this.isListOpen(index)) {
        this.openedLists = this.openedLists.filter((i) => i !== index);
      } else {
        this.openedLists = [...this.openedLists, index];
      }
    },
    isListOpen(index: number): boolean {
      return this.openedLists.includes(index);
    },
    async fetchSeasonList(): Promise<void> {
      this.loading = true;
      const seasons = await apiDriftSeason.getAllLight();
      this.seasons = seasons;
      this.loading = false;
    },
  },
};
</script>

<style lang="less" scoped>
.component-DriftSeriesList {
  h1 {
    color: var(--green-1);
    font-size: 36px;
    font-weight: 700;
    text-align: center;
    margin-bottom: 8px;
  }
  .subtitle {
    text-align: center;
    margin-top: 0;
    margin-bottom: 48px;
  }
  .serie-list {
    list-style: none;
    margin: 0;
    padding: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 24px;

    .serie {
      max-width: 550px;
      width: 100%;
      .serie-overview {
        border: 1px solid var(--white-1);
        border-radius: 10px;
        padding: 12px;
        padding-right: 72px;
        position: relative;
        transition: all 0.25s ease-in-out;

        h2 {
          margin: 0;
          margin-bottom: 12px;
          font-size: 24px;
          font-weight: 700;
          color: var(--green-1);
        }

        p {
          margin: 0;
          font-size: 16px;
          color: var(--white-1);
        }

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
          transform: translateY(-50%) rotate(0deg);
          transition: 0.25s ease-in-out;
        }
        &.selected {
          &:before {
            background-image: url("~/assets/svg/arrow-green.svg");
            transform: translateY(-50%) rotate(90deg);
          }
        }

        &:hover {
          transform: scale(1.05);

          &:before {
            background-image: url("~/assets/svg/arrow-green.svg");
          }
        }
      }

      .season-list-wrapper {
        .season-list {
          list-style: none;
          margin: 0;
          padding: 0;
          display: flex;
          flex-direction: column;
          padding: 12px;
          gap: 8px;

          .season {
            border: 1px solid var(--white-1);
            border-radius: 10px;
            padding: 0;
            position: relative;
            transition: all 0.25s ease-in-out;

            .season-overview {
              padding: 12px;
            }

            .link {
              &:before {
                content: "";
                position: absolute;
                background: url("~/assets/svg/arrow-grey.svg") no-repeat;
                background-size: contain;
                background-position: center;
                width: 25px;
                height: 25px;
                right: 12px;
                top: 50%;
                transform: translateY(-50%);
                transition: 0.25s ease-in-out;
              }
            }

            h3 {
              margin: 0;
              font-size: 20px;
              font-weight: 700;
              color: var(--green-1);
            }

            // &:before {
            //   content: "";
            //   position: absolute;
            //   background: url("~/assets/svg/arrow-grey.svg") no-repeat;
            //   background-size: contain;
            //   background-position: center;
            //   width: 25px;
            //   height: 25px;
            //   right: 12px;
            //   top: 50%;
            //   transform: translateY(-50%);
            //   transition: 0.25s ease-in-out;
            // }
            &:hover {
              transform: scale(1.05);
              .link {
                &:before {
                  background-image: url("~/assets/svg/arrow-green.svg");
                }
              }
            }
          }
        }
      }
    }
  }
}
</style>
