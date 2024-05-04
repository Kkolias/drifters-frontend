<template>
  <div class="component-DriftSeriesList">
    <h1>Drifting-sarjat ja kaudet</h1>
    <h3 class="subtitle">
      Enemmän tai vähemmän kattava lista drifting-kilpailusarjoista ja niiden
      kausista
    </h3>
    <DriftSeriesList />
  </div>
</template>

<script lang="ts">
</script>

<style lang="less" scoped>
.component-DriftSeriesList {
  h1 {
    color: var(--green-1);
    font-size: 36px;
    font-weight: 700;
    text-align: center;
    margin-bottom: 8px;
    margin-left: 6px;
    margin-right: 6px;
  }
  .subtitle {
    text-align: center;
    margin-top: 0;
    margin-bottom: 48px;
    margin-left: 6px;
    margin-right: 6px;
  }

  @media only screen and (max-width: 540px) {
    h1 {
      font-size: 30px;
    }

    .subtitle {
      font-size: 14px;
      margin-bottom: 24px;
    }
  }
}
</style>
