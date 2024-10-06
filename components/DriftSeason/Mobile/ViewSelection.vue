<template>
  <div
    class="component-DriftSeasonViewSelectionMobile"
    :class="{ noarrows: arrowsNowNeeded }"
  >
    <button
      v-if="!arrowsNowNeeded"
      class="scroll-left blank"
      :class="{ disabled: isScrolledToLeft }"
      @click="handleScrollLeft()"
    ></button>
    <div
      class="button-wrapper"
      ref="nav-buttons"
      @scrollend="checkScrolledPositions"
      @touchend="checkScrolledPositions"
    >
      <NuxtLink
        v-for="item in navigationList"
        :key="item.key"
        class="select-view always-visible"
        :class="[{ selected: isViewSelected(item.key) }, item.key]"
        :to="getQueryPath(item.key)"
      >
        <span>{{ item.label }}</span>
      </NuxtLink>
    </div>
    <button
      v-if="!arrowsNowNeeded"
      class="scroll-right blank"
      :class="{ disabled: isScrolledToRight }"
      @click="handleScrollRight()"
    ></button>
    <!-- <div class="bottom-line"></div> -->
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
    navigationList: {
      type: Array as PropType<{ label: string; key: string }[]>,
      required: true,
    },
  },
  data: () => ({
    isScrolledToLeft: false,
    isScrolledToRight: false,
  }),
  computed: {
    arrowsNowNeeded(): boolean {
      return this.isScrolledToLeft && this.isScrolledToRight;
    },
    queryParams() {
      return this.$route.query;
    },
    navButtons(): HTMLElement {
      return this.$refs["nav-buttons"] as HTMLElement;
    },
  },
  watch: {
    $route(oldRoute, newRoute) {
      const ingoreParams = ["heat", "result"];
      const isSame = Object.keys(oldRoute.query).every((key) => {
        if (ingoreParams.includes(key)) return true;
        return oldRoute.query[key] === newRoute.query[key];
      });
      if (!isSame) this.scrollToTop();
    },
  },
  mounted() {
    this.checkScrolledPositions();
  },
  methods: {
    checkScrolledPositions(): void {
      const navButtons = this.$refs["nav-buttons"] as HTMLElement;
      this.isScrolledToLeft = navButtons.scrollLeft <= 33;
      this.isScrolledToRight =
        navButtons.scrollLeft >=
        navButtons.scrollWidth - navButtons.clientWidth - 0;
    },
    isViewSelected(view: string): boolean {
      // return this.queryParams.view === view;
      return this.$route.hash === `#${view}`;
    },
    getQueryPath(view: string): any {
      // return {
      //   query: {
      //     ...this.queryParams,
      //     view,
      //   },
      // };
      return `#${view}`;
    },
    scrollToTop() {
      window.scrollTo(0, 0);
    },
    handleScrollLeft() {
      const navButtons = this.$refs["nav-buttons"] as HTMLElement;
      navButtons.scrollTo({
        left: navButtons.scrollLeft - 100,
        behavior: "smooth",
      });
      setTimeout(() => {
        this.checkScrolledPositions();
      }, 50);
    },
    handleScrollRight() {
      const navButtons = this.$refs["nav-buttons"] as HTMLElement;
      navButtons.scrollTo({
        left: navButtons.scrollLeft + 100,
        behavior: "smooth",
      });
      setTimeout(() => {
        this.checkScrolledPositions();
      }, 50);
    },
  },
};
</script>

<style lang="less" scoped>
.component-DriftSeasonViewSelectionMobile {
  border: 1px solid var(--white-1);
  border-left: none;
  border-right: none;
  height: 33px;
  display: grid;
  grid-template-columns: 33px 1fr 33px;
  background: var(--black-1);

  &.noarrows {
    grid-template-columns: 1fr;
  }

  .scroll-left,
  .scroll-right {
    width: 33px;
    height: 33px;
    position: relative;
    &:after {
      content: "";
      display: block;
      width: 100%;
      height: 100%;
      background: url("~/assets/svg/arrow-grey.svg") no-repeat;
      background-size: 15px 33px;
      background-position: center;
    }

    &.disabled {
      cursor: not-allowed;
      pointer-events: none;
      opacity: 0.4;
    }
  }

  .scroll-left {
    border-right: 1px solid var(--white-1);

    &:after {
      transform: rotate(180deg);
    }
  }

  .scroll-right {
    border-left: 1px solid var(--white-1);
  }

  .button-wrapper {
    display: grid;
    grid-auto-flow: column;
    overflow-x: auto;
    .select-view {
      padding: 0 12px;
      height: 33px;
      display: block;

      a,
      span {
        display: block;
        height: 33px;
        line-height: 33px;
        text-align: center;
        white-space: nowrap;
      }

      &:not(:last-child) {
        border-right: 1px solid var(--white-1);
      }
      &:not(:first-child) {
        border-left: 1px solid var(--white-1);
      }

      &.selected {
        background: var(--black-2);
        a,
        span {
          color: var(--green-1);
          font-weight: 700;
        }
      }
    }
  }
}
</style>
