<template>
  <div class="component-footer">
    <div class="contact-section">
      <div class="flex-container">
        <BuyMeACoffeeButton />
        <NuxtLink to="/miksi-mainoksia" class="why-ads-btn">{{
          textContent.whyAds
        }}</NuxtLink>
      </div>
      <p>
        {{ textContent.foundError }}
        <a href="mailto:driftdataan@gmail.com"> driftdataan@gmail.com </a>
      </p>
    </div>
  </div>
</template>

<script lang="ts">
import translations from "~/lang/components/Footer.lang";
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

<!-- <script lang="ts" setup>
// head 
useHead({
  title: "DriftDataan - Miksi mainoksia?",
  meta: [
    {
      name: "description",
      content: "DriftDataan on sivusto, joka tarjoaa tietoa suomalaisista driftaajista ja heidän kilpa-autoistaan.",
    },
    {
      name: "keywords",
      content: "drift, data, driftdataan, driftaajat, kilpa-autot, driftaus",
    },
  ],
});
</script> -->

<style lang="less" scoped>
.component-footer {
  width: 100%;
  border-top: 1px solid var(--green-1-50);
  margin-top: 12px;
  //   box-shadow: 0px -2px 12px var(--black-dark);
  padding: 12px 0;
 
  .flex-container {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 12px;

    @media only screen and (max-width: 500px) {
      flex-direction: column;
    }
  }

  .contact-section {
    text-align: center;

    a {
      color: var(--green-1);
    }
  }
}
</style>
