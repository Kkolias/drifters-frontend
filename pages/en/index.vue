<template>
    <div class="welcome-page">
      <section class="welcome">
        <h1>{{ textContent.welcome }}</h1>
        <p>
          {{ textContent.welcomeSubText }}
        </p>
  
        <p>
          {{ textContent.foundError }}
          <a href="mailto:driftdataan@gmail.com">driftdataan@gmail.com</a>
        </p>
  
        <!-- <p>Kiitos ja anteeksi!</p> -->
      </section>
      <section class="drift-series">
        <DriftSeriesPage />
      </section>
  
      <section class="drift-sm-section">
        <h2>{{ textContent.dirftSmSection.title }}</h2>
        <p>
          {{ textContent.dirftSmSection.subText }}
        </p>
        <a href="/drift-sm-esittely">{{ textContent.dirftSmSection.readMore }}</a>
      </section>
    </div>
  </template>
  
  <script lang="ts">
  import translations from "~/lang/home.lang";
  export default {
    computed: {
      textContent() {
        return translations.en;
      },
    },
  };
  </script>
  
  <style lang="less" scoped>
  .welcome-page {
    max-width: 600px;
    margin: auto;
    padding: 0 24px;
    h1 {
      color: var(--green-1);
      font-size: 46px;
      font-weight: 700;
      text-align: center;
      margin-bottom: 24px;
    }
    p {
      text-align: center;
      margin-top: 0;
      margin-bottom: 24px;
  
      a {
        color: var(--green-1);
      }
    }
  
    .drift-series {
      margin-top: 48px;
      h2 {
        color: var(--green-1);
        font-size: 24px;
        font-weight: 700;
        text-align: center;
        margin-bottom: 24px;
      }
    }
  
    .drift-sm-section {
      margin-top: 48px;
      margin-bottom: 10vh;
      h2 {
        text-align: center;
        color: var(--green-1);
      }
      p {
        text-align: left;
        margin-left: 12px;
      }
      a {
        color: var(--green-1);
        text-decoration: underline;
        margin-left: 12px;
      }
    }
  
    @media only screen and (max-width: 600px) {
      padding: 0 12px;
  
      h1 {
        font-size: 36px;
      }
  
      p {
        font-size: 14px;
      }
    }
  }
  </style>
  