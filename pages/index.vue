<template>
  <div class="welcome-page">
    <section class="welcome">
      <h1>Tervetuloa DriftDataan!</h1>
      <p>
        Tämä sivusto on drifting-fanin vapaa-ajan projekti, ja minä olen ainoa
        ylläpitäjä. Pyrin päivittämään sivustoa niin usein kuin mahdollista,
        mutta huomioithan, että kaiken tiedon päivittäminen voi viedä aikaa.
        Pistetilastot, taulukot ja muu esitetty data saattavat sisältää virheitä
        tai olla epätarkkoja, koska tiedon kerääminen ja päivittäminen on
        käsityötä. Teen parhaani korjatakseni mahdolliset virheet ja
        tarjotakseni tarkkaa ja luotettavaa tietoa drifting-maailmasta.
      </p>

      <p>
        Onko sinulla kehitysidea tai havaitsitko virheen?
        <a href="mailto:driftdataan@gmail.com">driftdataan@gmail.com</a>
      </p>

      <!-- <p>Kiitos ja anteeksi!</p> -->
    </section>
    <section class="drift-series">
      <DriftSeriesPage />
    </section>

    <section class="drift-sm-section">
      <h2>Seuraa Suomen Parasta Driftingiä!</h2>
      <p>
        Drift SM on Suomen arvostetuin drifting-sarja, jossa kilpaillaan
        mestaruudesta huipputason kuljettajien kesken. Tule mukaan seuraamaan
        jännittäviä kilpailuja ja tutustu tarkemmin sarjaan ja sen eri luokkiin.
      </p>
      <a href="/drift-sm-esittely"
        >Lue lisää Drift SM -sarjasta ja Pro-luokasta</a
      >
    </section>
  </div>
</template>

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
