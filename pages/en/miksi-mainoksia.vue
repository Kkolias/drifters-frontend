<template>
  <div class="page-miksi-mainoksia">
    <div class="section first">
      <h1>{{ textContent.title }}</h1>
      <p>
        {{ textContent.subText1 }}
      </p>
      <p>
        {{ textContent.subText2 }}
      </p>
    </div>
    <div class="section second">
      <h1>{{ textContent.section2Title }}</h1>
      <p>
        {{ textContent.section2SubText }}
      </p>
    </div>
    <div class="section third">
      <h1>{{ textContent.section3Title }}</h1>
      <p>
        {{ textContent.section3SubText }}
      </p>
      <p>
        {{ textContent.foundError }}
        <a href="mailto:driftdataan@gmail.com">driftdataan@gmail.com</a>.
        {{ textContent.foundError2 }}
      </p>
      <p>{{ textContent.thankYou }}</p>
    </div>
  </div>
</template>

<script lang="ts">
import translations from "~/lang/miksi-mainoksia.lang";
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
.page-miksi-mainoksia {
  .section {
    margin: 0 auto;
    margin-bottom: 2rem;
    max-width: 700px;
    padding: 0 24px;
  }

  h1 {
    color: var(--green-1);
    text-align: center;
  }

  p {
    text-align: center;
  }

  h1 {
    font-size: 2rem;
    margin-bottom: 1rem;
  }

  p {
    font-size: 1.2rem;
  }

  a {
    color: var(--green-1);
  }

  @media only screen and (max-width: 750px) {
    .section {
      padding: 0 12px;
    }

    h1 {
      font-size: 1.5rem;
    }

    p {
      font-size: 1rem;
    }
  }

  @media only screen and (max-width: 500px) {
    h1 {
      font-size: 1.2rem;
    }

    p {
      font-size: 0.9rem;
    }
  }
}
</style>
