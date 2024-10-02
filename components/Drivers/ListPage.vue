<template>
  <div class="component-DriverListPage">
    <div class="header-section">
      <h1>
        {{ textContent.title }}
      </h1>
      <p>
        {{ textContent.subText }}
      </p>
    </div>
  </div>
</template>

<script lang="ts">
import translations from "~/lang/components/DriverListPage.lang";
import Language from "~/mixins/language.vue";

export default {
  mixins: [Language],
  computed: {
    textContent() {
      const r = this.getTranslation(translations);
      return r
    },
  },
};
</script>

<style lang="less" scoped>
.component-DriverListPage {
  .header-section {
    padding: 20px;
    border-radius: 5px;
    margin-bottom: 20px;
  }
  h1 {
    font-size: 30px;
    margin-bottom: 10px;
    color: var(--green-1);
    text-align: center;
  }
  p {
    font-size: 16px;
    max-width: 700px;
    margin: 0 auto;
    margin-top: 24px;
    padding: 0 24px;
    text-align: center;
  }

  @media only screen and (max-width: 600px) {
    h1 {
      font-size: 24px;
    }
    p {
      font-size: 14px;
    }
  }

  @media only screen and (max-width: 400px) {
    h1 {
      font-size: 20px;
    }
    p {
      font-size: 12px;
    }
  }
}
</style>
