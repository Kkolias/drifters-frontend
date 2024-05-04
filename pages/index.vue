<template>
  <div class="welcome-page">
    <section class="welcome">
      <h1>Tervetuloa DriftDataan!</h1>
      <p>
        Tämä sivusto on intohimoisen drifting-fanin vapaa-ajan projekti, ja minä
        olen ainoa ylläpitäjä. Pyrin päivittämään sivustoa niin usein kuin
        mahdollista, mutta huomioithan, että kaiken tiedon päivittäminen voi
        viedä aikaa. Pistetilastot, taulukot ja muu esitetty data saattavat
        sisältää virheitä tai olla epätarkkoja, koska tiedon kerääminen ja
        päivittäminen on käsityötä. Teen parhaani korjatakseni mahdolliset
        virheet ja tarjotakseni tarkkaa ja luotettavaa tietoa
        drifting-maailmasta.
      </p>
      <p>
        Jos huomaat virheitä voit ottaa yhteyttä sähköpostitse osoitteeseen
        <a href="mailto:dev.elias.koivuporras@gmail.com"
          >dev.elias.koivuporras@gmail.com</a
        >
        (vastaan motivaation mukaan).
      </p>
      <p>Kiitos ja anteeksi!</p>
    </section>
    <section class="drift-series">
      <DriftSeriesPage />
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
