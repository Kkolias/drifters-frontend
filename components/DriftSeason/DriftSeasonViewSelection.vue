<template>
  <div class="component-DriftSeasonViewSelection">
    <div class="button-wrapper">
      <NuxtLink
        class="select-view season always-visible"
        :class="{ selected: isViewSelected('events') }"
        :to="getQueryPath('events')"
      >
        <span>Tapahtumat</span>
      </NuxtLink>
      <NuxtLink
        class="select-view season always-visible"
        :class="{ selected: isViewSelected('stats') }"
        :to="getQueryPath('stats')"
      >
        <span>Tilastot</span>
      </NuxtLink>
      <NuxtLink
        :disabled="!isSelectedEvent"
        class="select-view leaderboards always-visible"
        :class="[
          {
            selected: isViewSelected('standings'),
          },
        ]"
        :to="getQueryPath('standings')"
      >
        <span>Pistetaulukko</span>
      </NuxtLink>
      <NuxtLink
        :disabled="!isSelectedEvent"
        class="select-view seasons always-visible"
        :class="[
          {
            selected: isViewSelected('seasons'),
          },
        ]"
        :to="getQueryPath('seasons')"
      >
        <span>Muut kaudet</span>
      </NuxtLink>
    </div>
    <div class="bottom-line"></div>
  </div>
</template>

<script lang="ts">
import type { PropType } from "vue";
import type { IDriftSeason } from "~/interfaces/drift-season.interface";

export default {
  props: {
    season: {
      type: Object as PropType<IDriftSeason>,
      required: true,
    },
  },
  computed: {
    queryParams() {
      return this.$route.query;
    },
    isSelectedEvent(): boolean {
      return !!this.queryParams?.["event-id"];
    },
  },
  methods: {
    isViewSelected(view: string): boolean {
      return this.queryParams.view === view;
    },
    getQueryPath(view: string): any {
      return {
        query: {
          ...this.queryParams,
          view,
        },
      };
    },
  },
};
</script>

<style lang="less" scoped>
.component-DriftSeasonViewSelection {
  // margin-top: 24px;
  // .button-wrapper {
  //   display: flex;
  //   justify-content: center;
  //   align-items: flex-end;
  //   gap: 1rem;
  //   height: 54px;
  //   overflow-y: hidden;

  //   .select-view {
  //     width: 200px;
  //     height: 46px;
  //     background: var(--black-2);
  //     border-radius: 10px 10px 0 0;
  //     transition: all 0.25s ease-in-out;

  //     span {
  //       font-size: 1.6rem;
  //       text-align: center;
  //       display: block;
  //       line-height: 46px;
  //       transition: all 0.25s ease-in-out;
  //     }

  //     &.selected {
  //       background: var(--green-1);
  //       height: 52px;

  //       span {
  //         color: var(--black-1);
  //         font-weight: 700;
  //         line-height: 52px;
  //       }
  //     }

  //     &.disabled {
  //       transform: translateY(75%);
  //       opacity: 0.5;
  //       cursor: not-allowed;
  //       pointer-events: none;
  //     }

  //     &.not-disabled {
  //       // use slideIn animation on class change
  //       animation: slideIn 0.25s ease-in-out;
  //     }

  //     &:not(.always-visible) {
  //       // transition to make buttons appear from the bottom
  //       // animation: slideIn 2s ease-in-out;

  //       @keyframes slideIn {
  //         0% {
  //           transform: translateY(100%);
  //           // opacity: 0;
  //         }
  //         100% {
  //           transform: translateY(0);
  //           // opacity: 1;
  //         }
  //       }
  //     }
  //   }
  // }

  // .bottom-line {
  //   width: 100%;
  //   height: 2px;
  //   background: var(--green-1);
  // }
}
</style>
