<template>
  <div class="component-DriftSeasonEventBracketTopThree">
    <h2>{{ textContent.brackets }} Top 3</h2>
    <div class="top-three-list">
      <DriftCompetitionDayScoreboardTable
        :scoreboard="eventTopThreeBracket"
        :driftSerie="driftSerie"
      />
    </div>
  </div>
</template>

<script lang="ts">
import type { DriftSerie } from "~/enums/drift-serie.enum";
import type { IScoreBoardItem } from "~/interfaces/competition-day.interface";
import Language from "~/mixins/language.vue";

const translations = {
  fi: {
    brackets: "Kaavion",
  },
  en: {
    brackets: "Bracket",
  },
};

export default {
  mixins: [Language],
  props: {
    bracketScoreboard: {
      type: Array as PropType<IScoreBoardItem[]>,
      default: () => [],
    },
    driftSerie: {
      type: String as PropType<DriftSerie | null>,
      default: null,
    },
  },
  computed: {
    textContent() {
      return this.getTranslation(translations);
    },
    eventTopThreeBracket(): IScoreBoardItem[] {
      return this.bracketScoreboard.slice(0, 3);
    },
  },
};
</script>

<style lang="less" scoped>
.component-DriftSeasonEventBracketTopThree {
  h2 {
    font-size: 24px;
    color: var(--green-1);
    text-align: center;
  }
}
</style>
