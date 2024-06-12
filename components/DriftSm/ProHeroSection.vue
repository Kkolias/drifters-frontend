<template>
  <div class="component-DriftSmHeroSection">
    <h1>Drift SM - Suomen Parasta Driftingiä</h1>
    <div class="overview">
      <p>
        <b>Drift SM</b> on Suomen korkein mahdollinen drifting-sarja, jossa
        kilpaillaan driftingin Suomen mestaruudesta. Vuonna 2011 perustetussa
        sarjassa ajetaan kahdessa luokassa: SM Pro ja SM Pro2. Näistä SM Pro on
        sarjan pääluokka, jossa Suomen parhaat kuljettajat ottavat mittaa
        toisistaan useilla eri radoilla ympäri Suomen.
      </p>
    </div>
    <div class="pro-section">
      <h2>SM Pro - Huipputason Driftingiä</h2>
      <p>
        <b>SM Pro</b> on Drift SM -sarjan kuninkuusluokka. Tässä luokassa
        kilpailevat maan parhaat drifting-kuljettajat, jotka ovat hioneet
        taitojaan ja ajaneet itsensä kansallisen eliitin huipulle. Pro-luokan
        kilpailut ovat intensiivisiä kaksipäiväisiä tapahtumia, joissa
        ensimmäinen päivä sisältää lajittelut ja toinen päivä pariajokaaviot,
        jotka ratkaisevat kilpailun voittajan.
      </p>
      <p>
        Voittajat palkitaan rahapalkinnoilla, joissa SM Pro -luokan voittaja saa
        1000 euroa jokaisesta osakilpailusta.
      </p>
    </div>
  </div>
</template>

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

  p, a {
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

    p, a {
      font-size: 16px;
    }
  }
}
</style>
