<template>
  <div class="page-miksi-mainoksia">
    <div class="section first">
      <h1>Miksi mainoksia?</h1>
      <p>
        Tervetuloa DriftDataan-sivustolle, joka on omistautunut tarjoamaan
        tarkkaa ja ajankohtaista tietoa drifting-maailmasta suomeksi. Tämä
        sivusto on drifting-fanin vapaa-ajan projekti, ja minä olen ainoa
        ylläpitäjä. Pyrin päivittämään sivustoa niin usein kuin mahdollista,
        mutta huomioithan, että kaiken tiedon päivittäminen voi viedä aikaa.
        Pistetilastot, taulukot ja muu esitetty data saattavat sisältää virheitä
        tai olla epätarkkoja, koska tiedon kerääminen ja päivittäminen on
        käsityötä. Teen parhaani korjatakseni mahdolliset virheet ja
        tarjotakseni tarkkaa ja luotettavaa tietoa drifting-maailmasta.
      </p>
      <p>
        Koska sivusto on yksityisesti rahoitettu harrastusprojekti, päätin
        lisätä mainoksia kattamaan ylläpidosta aiheutuvia kuluja, kuten
        serverikustannukset, domain-maksut ja muut tekniset kulut. Mainokset
        auttavat minua pitämään sivuston yllä ja mahdollistavat sen
        kehittämisen, jotta voin tarjota drifting-yhteisölle entistä parempaa
        sisältöä.
      </p>
    </div>
    <div class="section second">
      <h1>Mainokset ja niiden merkitys</h1>
      <p>
        Mainosten tuotto käytetään yksinomaan sivuston ylläpitokustannusten
        kattamiseen ja sen kehittämiseen. Näin voin varmistaa, että DriftDataan
        pysyy toiminnassa ja tarjoaa ajankohtaista tietoa drifting-harrastajille
        ja -faneille. Toivon, että mainokset eivät häiritse liikaa
        käyttäjäkokemustasi ja että ymmärrät niiden merkityksen sivuston
        jatkuvuuden kannalta.
      </p>
    </div>
    <div class="section third">
      <h1>Adblockerien käyttö</h1>
      <p>
        Ymmärrän, että kaikki eivät halua nähdä mainoksia selatessaan
        internetiä. Jos haluat poistaa mainokset käytöstä, voit käyttää
        adblockeria. Haluan kuitenkin huomauttaa, että pitämällä mainokset
        päällä tuet tätä vapaa-ajan projektina toteutettua sivustoa ja autat
        kattamaan sen ylläpidosta aiheutuvia kuluja. Kiitos ymmärryksestäsi ja
        tuestasi!
      </p>
      <p>
        Jos sinulla on kehitysidea tai havaitsit virheen, voit ottaa yhteyttä
        minuun osoitteessa
        <a href="mailto:driftdataan@gmail.com">driftdataan@gmail.com</a>. Pyrin
        vastaamaan viesteihin mahdollisimman pian ja ottamaan kaikki palautteet
        huomioon sivuston kehittämisessä.
      </p>
      <p>Kiitos, että käytät DriftDataan-sivustoa!</p>
    </div>
  </div>
</template>

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
