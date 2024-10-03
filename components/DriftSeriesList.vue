<template>
  <div class="component-DriftSeriesList">
    <LoadingIndicator v-if="loading" />
    <div v-else>
      <div class="only-seasons-list" v-if="selectedSeriesSeasonList.length">
        <h2>{{ textContent.otherSeasons }}</h2>
        <ul class="season-list">
          <li
            class="season"
            :class="{ selected: isSelectedSeason(season) }"
            v-for="(season, key) in selectedSeriesSeasonList"
            :key="key"
          >
            <NuxtLink class="button blank link" :to="getSeasonPath(season)">
              <div class="season-overview">
                <h3>
                  {{ getSeasonName(season, getSerieForSeason(season)) }}
                  {{ season.year }}
                </h3>
              </div>
            </NuxtLink>
          </li>
        </ul>
      </div>
      <h3 v-if="notSelectedSeries.length && selectedSeriesSeasonList.length">
        {{ textContent.otherSeries }}
      </h3>
      <ul class="serie-list" v-if="notSelectedSeries.length">
        <li
          class="serie"
          v-for="(serie, index) in notSelectedSeries"
          :key="index"
        >
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
            <ul class="season-list" v-if="serie?.seasonList?.length">
              <li
                class="season"
                v-for="(season, key) in serie.seasonList"
                :key="key"
                :title="`${getSeasonName(season, serie)} ${season.year}`"
              >
                <NuxtLink class="button blank link" :to="getSeasonPath(season)">
                  <div class="season-overview">
                    <h3>
                      {{ getSeasonName(season, serie) }} {{ season.year }}
                    </h3>
                  </div>
                </NuxtLink>
              </li>
            </ul>
            <div class="no-seasons" v-else>
              <p>{{ textContent.noSeasons }}</p>
            </div>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script lang="ts">
import { DRIFT_SERIES_LABEL } from "~/constants/drift-series";
import { DriftSerie } from "~/enums/drift-serie.enum";
import type { IDriftSeason } from "~/interfaces/drift-season.interface";
import apiDriftSeason from "~/utils/drifting/api-drift-season";
import text from "~/lang/series.lang";
import Language from "~/mixins/language.vue";

interface IData {
  seasons: IDriftSeason[];
  loading: boolean;
  openedLists: number[];
}

export default {
  mixins: [Language],
  props: {
    selectedSeason: {
      type: String,
      default: "",
    },
  },
  data: (): IData => ({
    seasons: [],
    loading: false,
    openedLists: [],
  }),
  computed: {
    textContent() {
      return this.getTranslation(text);
    },
    series(): any[] {
      return Object.values(DriftSerie).map((serie) => {
        return {
          name: DRIFT_SERIES_LABEL[serie],
          subText: this.textContent.seriesTexts?.[serie] || "",
          seasonList:
            this.seasons?.filter((season) => season?.serie === serie) || [],
        };
      });
    },
    selectedSeriesSeasonList(): any[] {
      const selectedSeries = this.series.find((serie) =>
        this.seriesHasSelectedSeason(serie)
      );
      return selectedSeries?.seasonList || [];
    },
    notSelectedSeries(): any[] {
      return this.series.filter(
        (serie) => !this.seriesHasSelectedSeason(serie)
      );
    },
  },
  mounted() {
    this.fetchSeasonList();
  },
  methods: {
    getSerieForSeason(season: IDriftSeason): any {
      return this.series.find((serie) =>
        serie.seasonList.some((s: any) => s._id === season._id)
      );
    },
    seriesHasSelectedSeason(serie: any): boolean {
      return serie.seasonList.some(
        (season: any) => season?._id === this.selectedSeason
      );
    },
    isSelectedSeason(season: IDriftSeason): boolean {
      return season._id === this.selectedSeason;
    },
    getSeasonName(season: IDriftSeason, serie: any): string {
      return season?.name ? season.name : serie.name;
    },
    getSeasonPath(season: IDriftSeason): string {
      return `/drift-season/${season.slug}?view=events`;
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
  h3 {
    text-align: center;
    margin-left: 6px;
    margin-right: 6px;
  }
  .subtitle {
    text-align: center;
    margin-top: 0;
    margin-bottom: 48px;
    margin-left: 6px;
    margin-right: 6px;
  }

  .no-seasons {
    p {
      text-align: center;
      font-size: 18px;
      font-weight: 700;
    }
  }
  .serie-list {
    list-style: none;
    margin: 0 6px;
    padding: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 24px;

    .serie {
      max-width: 520px;
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
          font-size: 22px;
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
    }
  }
  .only-seasons-list {
    max-width: 520px;
    width: 100%;
    margin: auto;

    h2 {
      text-align: center;
      margin: 0;
    }
  }
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
        text-align: left;
        margin-right: 24px;
        text-overflow: ellipsis;
        white-space: nowrap;
        overflow: hidden;
      }

      &:hover {
        transform: scale(1.05);
        .link {
          &:before {
            background-image: url("~/assets/svg/arrow-green.svg");
          }
        }
      }

      &.selected {
        background: var(--green-1-25);

        h3 {
          color: var(--black-1);
        }
      }
    }
  }

  @media only screen and (max-width: 630px) {
    .serie-list {
      .serie {
        .serie-overview {
          h2 {
            font-size: 20px;
          }
        }
      }
    }
    .season-list {
      .season {
        .link {
          h3 {
            font-size: 18px;
          }
        }
      }
    }
  }
  @media only screen and (max-width: 540px) {
    // h1 {
    //   font-size: 20px;
    // }
    .serie-list {
      .serie {
        max-width: 100%;
        width: 95%;
        .serie-overview {
          h2 {
            font-size: 18px;
          }
          p {
            font-size: 14px;
          }
        }
      }
    }
    .season-list {
      .season {
        .link {
          h3 {
            font-size: 15px;
          }
        }
      }
    }
  }

  @media only screen and (max-width: 420px) {
    .serie-list {
      .serie {
        .serie-overview {
          h2 {
            font-size: 16px;
          }
          p {
            font-size: 12px;
          }
        }
      }
    }
    .season-list {
      padding: 6px;
      .season {
        .link {
          h3 {
            font-size: 12px;
          }
        }
      }
    }
  }
}
</style>
