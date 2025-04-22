<template>
  <div class="component-DriftEventCancelled">
    <h2>{{ textContent.eventCancelled }}</h2>
  </div>
</template>

<script lang="ts">
import Language from "~/mixins/language.vue";

const translations = {
  fi: {
    eventCancelled: "Tapahtuma peruttu",
  },
  en: {
    eventCancelled: "Event cancelled",
  },
};

export default {
  mixins: [Language],
  computed: {
    textContent() {
      return this.getTranslation(translations);
    },
  },
};
</script>

<style lang="less" scoped>
.component-DriftEventCancelled {
  h2 {
    font-size: 28px;
    text-align: center;
    padding: 10px;
    margin: 0;
    color: var(--error-color);
  }

}
</style>
