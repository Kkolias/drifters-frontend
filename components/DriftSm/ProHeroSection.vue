<template>
  <div class="component-DriftSmHeroSection">
    <h1>{{ textContent.title }}</h1>
    <div class="overview">
      <p>
        <b>{{ textContent.driftSm }}</b> {{ textContent.subText }}
      </p>
    </div>
    <div class="pro-section">
      <h2>{{ textContent.smProTitle }}</h2>
      <p>
        <b>{{ textContent.smPro }}</b> {{ textContent.smProSubText }}
      </p>
      <p>
        {{ textContent.pricePool }}
      </p>
    </div>
  </div>
</template>

<script lang="ts">
import translations from "~/lang/components/DriftSmProHeroSection.lang";
import Language from "~/mixins/language.vue";

export default {
  mixins: [Language],
  computed: {
    textContent() {
      const r = this.getTranslation(translations);
      return r;
    },
  },
};
</script>

<style lang="less" scoped>
.component-DriftSmHeroSection {
  max-width: 700px;
  margin: auto;
  padding: 0 12px;
  // margin-bottom: 48px;
  position: relative;

  h1 {
    text-align: center;
    font-size: 36px;
    color: var(--green-1);
  }

  h2 {
    font-size: 24px;
    color: var(--green-1);
  }

  p,
  a {
    font-size: 18px;
  }

  a {
    color: var(--green-1);
  }

  .pro-section {
    margin-top: 48px;
  }

  @media only screen and (max-width: 500px) {
    h1 {
      font-size: 24px;
    }

    h2 {
      font-size: 20px;
    }

    p,
    a {
      font-size: 16px;
    }
  }
}
</style>
