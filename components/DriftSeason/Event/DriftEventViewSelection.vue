<template>
  <div class="component-DriftEventViewSelection">
    <div class="button-wrapper">
      <NuxtLink
        v-for="item in navigationList"
        :key="item.key"
        :disabled="!isSelectedEvent"
        class="select-view qualifying"
        :class="[
          {
            selected: isViewSelected(item.key),
            disabled: !isSelectedEvent,
          },
          isSelectedEvent ? 'not-disabled' : 'disabled',
        ]"
        :to="getQueryPath(item.key)"
      >
        <span>{{ item.label }}</span>
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
    hasShowdown: {
      type: Boolean,
      default: false,
    },
    eventSlug: {
      type: String,
      default: ''
    
    },
    navigationList: {
      type: Array as () => { label: string; key: string }[],
      default: () => [],
    }
  },
  computed: {
    queryParams() {
      return this.$route.query;
    },
    isSelectedEvent(): boolean {
      return !!this.$route?.params?.eventId;
    },
    showThanksTab(): boolean {
      return this.eventSlug === 'round-6-finland' || this.eventSlug === 'round-6-poland';
      
    }
  },
  methods: {
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
  },
};
</script>

<style lang="less" scoped>
.component-DriftEventViewSelection {
 
}
</style>
