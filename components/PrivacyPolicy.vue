<template>
  <div class="component-PrivacyPolicy">
    <div class="title">
      <h1>{{ textContent.title }}</h1>
    </div>
    <div class="policy-section intorduction">
      <h2>{{ textContent.introductionTitle }}</h2>
      <p>{{ textContent.introductionText }}</p>
    </div>
    <div class="policy-section data-collection">
      <h2>{{ textContent.dataCollectionTitle }}</h2>
      <p>{{ textContent.dataCollectionText }}</p>
    </div>
    <div class="policy-section cookies">
      <h2>{{ textContent.cookiesTitle }}</h2>
      <p>{{ textContent.cookiesText }}</p>
    </div>
    <div class="policy-section third-party">
      <h2>{{ textContent.thirdPartyTitle }}</h2>
      <p>{{ textContent.thirdPartyText }}</p>
      <a href="https://business.safety.google/privacy/" target="_blank">{{ textContent.googlePolicy }}</a>
    </div>
    <div class="policy-section data-protection">
      <h2>{{ textContent.dataProtectionTitle }}</h2>
      <p>{{ textContent.dataProtectionText }}</p>
    </div>
    <div class="policy-section changes-to-policy">
      <h2>{{ textContent.changesToPolicyTitle }}</h2>
      <p>{{ textContent.changesToPolicyText }}</p>
    </div>
    <div class="policy-section contact-us">
      <h2>{{ textContent.contactUsTitle }}</h2>
      <p>
        {{ textContent.contactUsText }}
        <a href="mailto:driftdataan@gmail.com">{{
          textContent.contactUsEmail
        }}</a>
      </p>
    </div>
  </div>
</template>

<script lang="ts">
import type { PropType } from "vue";
import translations from "~/lang/privacy.lang";
export default {
  props: {
    lang: {
      type: String as PropType<"fi" | "en">,
      default: "fi",
    },
  },
  computed: {
    textContent() {
      return translations[this.lang];
    },
  },
};
</script>

<style lang="less" scoped>
.component-PrivacyPolicy {
  max-width: 900px;
  margin: 0 auto;
  padding: 0 24px;
  .title {
    h1 {
      text-align: center;
      font-size: 2rem;
      margin-bottom: 1rem;
      color: var(--green-1);
    }
  }
  .policy-section {
    margin-bottom: 2rem;
    h2 {
      font-size: 1.5rem;
      margin-bottom: 1rem;
    }
    p {
      font-size: 1rem;
    }
    a {
        color: var(--green-1);
    }
  }

  @media only screen and (max-width: 768px) {
    padding: 0 12px;
    .title {
      h1 {
        font-size: 1.5rem;
      }
    }
    .policy-section {
      h2 {
        font-size: 1.25rem;
      }
      p {
        font-size: 0.875rem;
      }
    }
  }
}
</style>
