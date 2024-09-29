<template>
  <div class="component-DriftSeasonDesktopViewSelection">
    <ul>
      <li v-for="(nav, index) in navigationList" :key="index">
        <NuxtLink
          :to="getNavigationPath(nav.key)"
          :class="{ selected: isViewSelected(nav.key) }"
        >
          <span class="nav-label">{{ nav.label }}</span>
        </NuxtLink>
      </li>
    </ul>
    <div
      v-if="!noHash"
      :style="selectedIndicatorStyle"
      class="selected-indicator-line"
    ></div>
  </div>
</template>

<script lang="ts">
export default {
  props: {
    navigationList: {
      type: Array as () => Array<{ label: string; key: string }>,
      default: () => [],
    },
  },
  data: () => ({
    selectedSection: ""
  }),
  computed: {
    noHash(): boolean {
      return !this.selectedSection;
    },
    selectedIndicatorStyle() {
      const selectedIndex = this.navigationList.findIndex((nav) =>
        this.isViewSelected(nav.key)
      );
      return {
        top: `${selectedIndex * 28}px`,
      };
    },
  },
  mounted() {
    this.selectedSection = this.$route.hash;
    // scroll to selected section without smooth scroll

    window.addEventListener("scrollend", this.updateNav);
  },
  beforeDestroy() {
    window.removeEventListener("scrollend", this.updateNav);
  },
  watch: {
    $route() {
      this.selectedSection = this.$route.hash;
    },
  },
  methods: {
    getNavigationPath(view: string): any {
      // use # hash for sections
      // return {
      //     hash: `#${view}`,
      // }
      return `#${view}`;
    },
    isViewSelected(view: string): boolean {
      return this.selectedSection === `#${view}`;
    },

    updateNav() {
      const allRegions = [
        ...document.querySelectorAll(".scroll-section:not([id=''])"),
      ];
      
      const windowHeight = window.innerHeight;

      const currentRegion = allRegions.find((region) => {
        const rect = region.getBoundingClientRect();

        // if section is more than 50% visible
        return rect.top < windowHeight / 2 && rect.bottom > windowHeight / 2;
      });

      const currentHash = this.selectedSection;

      if (currentRegion) {
        if (currentHash !== currentRegion.id) {
          history.replaceState(null, "", `#${currentRegion.id}`);
          this.selectedSection = `#${currentRegion.id}`;
        }
      }
    },
  },
};
</script>

<style lang="less" scoped>
.component-DriftSeasonDesktopViewSelection {
  ul,
  li {
    list-style: none;
    padding: 0;
    margin: 0;
  }

  li {
    height: 28px;
    .nav-label {
      color: var(--green-1);
      opacity: 0.8;
      font-size: 18px;

      transition: all 0.25s ease-in-out;
    }
    .selected {
      .nav-label {
        opacity: 1;
        font-size: 22px;
        font-weight: 700;
      }
    }

    &:before {
      content: "";
      position: absolute;
      left: -10px;
      top: 0;
      height: 100%;
      width: 2px;
      background: var(--green-1);
      opacity: 0.8;
    }
  }

  .selected-indicator-line {
    position: absolute;
    left: -11px;
    height: 28px;
    width: 4px;
    background: var(--green-1);
    opacity: 1;
    transition: all 0.25s ease-in-out;
  }
}
</style>
