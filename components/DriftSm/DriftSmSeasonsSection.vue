<template>
  <div class="component-DriftSmSeasonsSection">
    <h2>Drift SM Pro Kausien tulokset</h2>
    <LoadingIndicator v-if="loading" />
    <div class="content" v-else>
      <ul class="season-list" v-if="smDriftSeasons?.length">
        <li
          class="season"
          v-for="(season, key) in smDriftSeasons"
          :key="key"
          :title="`${getSeasonName(season)} ${season.year}`"
        >
          <NuxtLink class="button blank link" :to="getSeasonPath(season)">
            <div class="season-overview">
              <h3>{{ getSeasonName(season) }} {{ season.year }}</h3>
            </div>
          </NuxtLink>
        </li>
      </ul>
    </div>
  </div>
</template>

<script lang="ts">
import { DriftSerie } from "~/enums/drift-serie.enum";
import type { IDriftSeason } from "~/interfaces/drift-season.interface";
import apiDriftSeason from "~/utils/drifting/api-drift-season";

interface IData {
  loading: boolean;
  seasons: IDriftSeason[];
  openedLists: number[];
}

export default {
  data: (): IData => ({
    loading: false,
    seasons: [],
    openedLists: [],
  }),
  computed: {
    smDriftSeasons(): IDriftSeason[] {
      return (
        this.seasons?.filter(
          (season) => season?.serie === DriftSerie.driftsmpro
        ) || []
      );
    },
  },
  mounted() {
    this.fetchSeasonList();
  },
  methods: {
    getSeasonName(season: IDriftSeason): string {
      return season?.name ? season.name : "Drift SM Pro";
    },
    getSeasonPath(season: IDriftSeason): string {
      return `/drift-season/${season.slug}?view=events`;
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
.component-DriftSmSeasonsSection {
  max-width: 700px;
  margin: auto;
  padding: 0 12px;
  // margin-bottom: 48px;
  position: relative;

  h2 {
    font-size: 24px;
    color: var(--green-1);
    text-align: center;
  }

  .content {
    max-width: 520px;
    width: 100%;
    margin: auto;
    padding-bottom: 24px;

    &:after {
      max-width: 700px;
      padding: 0 12px;
      content: '';
      position: absolute;
      width: 100%;
      height: 1px;
      background-color: var(--green-1);
      bottom: 0;
      left: 50%;
      transform: translateX(-50%);
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
      background-color: var(--black-2);
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

  @media only screen and (max-width: 500px) {
    h1 {
      font-size: 24px;
    }

    h2 {
      font-size: 20px;
    }

    p, a {
      font-size: 16px;
    }
  }
}
</style>
