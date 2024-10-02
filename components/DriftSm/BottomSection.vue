<template>
  <div class="component-DriftSmBottomSection">
    <h2>{{ textContent.title }}</h2>
    <div class="overview">
      <p>
        {{ textContent.subText }}
      </p>
      <p>
        {{ textContent.moreInformation1 }}
        <a href="https://driftsm.fi">{{ textContent.officialWebsite }}</a
        >{{ textContent.moreInformation2 }}
      </p>
    </div>
  </div>
</template>

<script lang="ts">
import translations from "~/lang/components/DriftSmBottomSection.lang";
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
.component-DriftSmBottomSection {
  max-width: 700px;
  margin: auto;
  margin-top: 48px;
  padding: 0 12px;
  margin-bottom: 20vh;

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
    text-decoration: underline;
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
