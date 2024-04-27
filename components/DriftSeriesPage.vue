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
  }
  .subtitle {
    text-align: center;
    margin-top: 0;
    margin-bottom: 48px;
  }
}
</style>
