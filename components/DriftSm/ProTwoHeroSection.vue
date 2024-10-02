<template>
  <div class="component-DriftSmProTwoHeroSection">
    <div class="pro-two-section">
      <h2>{{ textContent.title }}</h2>
      <p>
        <b>{{textContent.smProTwo}}</b> {{ textContent.subText }}
      </p>
      <ul>
        <li>14.-15.6. Oulu, Ouluzone</li>
        <li>12.-13.7. Lapua, Ala-Talkkari Areena</li>
        <li>16.-17.8. Satakunta, Harjavalta, Drift Madness</li>
      </ul>
      <p>
        {{ textContent.pricePool }}
      </p>
    </div>
  </div>
</template>

<script lang="ts">
import translations from "~/lang/components/DriftSmProTwoHeroSection.lang";
import Language from "~/mixins/language.vue";

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
.component-DriftSmProTwoHeroSection {
  max-width: 700px;
  margin: auto;
  margin-top: 48px;
  padding: 0 12px;

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

  ul {
    li {
      margin-top: 12px;
      font-size: 18px;
    }
  }

  @media only screen and (max-width: 500px) {
    h1 {
      font-size: 24px;
    }

    h2 {
      font-size: 20px;
    }

    p,
    a,
    li {
      font-size: 16px;
    }
  }
}
</style>
