<template>
  <div class="component-Navbar">
    <div class="background-area"></div>
    <NuxtLink
      to="/?close-nav=true"
      title="Etusivulle"
      class="to-home-btn"
    ></NuxtLink>
    <LanguageToggle class="language-toggle" />
    <!-- <NuxtLink to="/miksi-mainoksia" class="why-ads-btn"
      >Miksi mainoksia?</NuxtLink
    > -->
    <nav class="menu--right" role="navigation">
      <div class="menuToggle">
        <input type="checkbox" v-model="navOpen" />
        <span></span>
        <span></span>
        <span></span>
        <ul class="menuItem">
          <li v-for="nav in navList" :key="nav.path">
            <NuxtLink :to="nav.path">
              {{ nav.label }}
            </NuxtLink>
          </li>
          <li>
            <LanguageToggle class="mobile-language-toggle" />
          </li>
          <li class="bottom">
            <NuxtLink to="/miksi-mainoksia" class="why-ads-btn-bottom"
              >Miksi mainoksia?</NuxtLink
            >
            <NuxtLink to="/tietosuojakaytantomme">
              Tietosuojakäytäntömme
            </NuxtLink>
          </li>
        </ul>
      </div>
    </nav>
  </div>
</template>

<script lang="ts">
export default {
  data: () => ({
    navOpen: false,

    navList: [
      {
        label: "Etusivu",
        path: "/",
      },
      {
        label: "Drift SM",
        path: "/drift-sm-esittely",
      },
      {
        label: "Sarjat",
        path: "/series",
      },
      {
        label: "Kaikki kuskit",
        path: "/drivers",
      },
      // {
      //   label: "Kaudet",
      //   path: "/drift-season",
      // },
      // {
      //   label: "Tapahtumat",
      //   path: "/drift-event",
      // },
      // {
      //   label: "Kisapäivät",
      //   path: "/drift-competition-day",
      // },
      // {
      //   label: "Sarjataulukot",
      //   path: "/leaderboard",
      // },
      // {
      //   label: "Profiili",
      //   path: "/profile",
      // },
    ],
  }),
  computed: {
    path(): string {
      return this.$route?.path || "";
    },
    queryParams(): any {
      return this.$route?.query || {};
    },
    closeNav(): boolean {
      return this.queryParams?.["close-nav"] === "true";
    },
  },
  watch: {
    path() {
      this.navOpen = false;
    },
    closeNav() {
      this.navOpen = false;
      this.$router.push({ query: {} });
    },
  },
  mounted() {
    window?.addEventListener("click", this.chechClickPosition);
  },
  destroyed() {
    window?.removeEventListener("click", this.chechClickPosition);
  },
  beforeUnmount() {
    window?.removeEventListener("click", this.chechClickPosition);
  },
  methods: {
    chechClickPosition(e: any): void {
      if (!e?.target?.closest(".component-Navbar")) {
        this.navOpen = false;
      }
    },
  },
};
</script>

<style lang="less" scoped>
.component-Navbar {
  position: relative;
  z-index: 100;
  .background-area {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 65px;
    background: var(--black-1);
    z-index: 1;
    opacity: 1;
    // box-shadow: 0px 8px 5px 0px var(--black-1);
  }
  .to-home-btn {
    position: fixed;
    top: 10px;
    left: 30px;
    width: 180px;
    height: 50px;
    background: url("~/assets/svg/driftdataan.svg") no-repeat center;
    background-size: cover;
    z-index: 2;
  }

  .why-ads-btn, .language-toggle {
    position: fixed;
    top: 20px;
    // top: 28px;
    right: 90px;
    color: var(--green-1);
    z-index: 2;
    text-decoration: none;
    font-size: 0.9rem;

    &:hover {
      text-decoration: underline;
    }

    @media only screen and (max-width: 450px) {
      display: none;
    }
  }
  .menuToggle {
    display: block;
    position: relative;
    top: 25px;
    z-index: 1;
    -webkit-user-select: none;
    user-select: none;

    li {
      transition: all 0.3s ease;

      a {
        text-decoration: none;
        color: var(--white-1);
        transition: all 0.3s ease;

        &:hover {
          color: var(--green-1);
        }
      }
    }

    input {
      display: block;
      width: 40px;
      height: 32px;
      position: absolute;
      top: -7px;
      cursor: pointer;
      opacity: 0;
      z-index: 2;
      -webkit-touch-callout: none;
    }

    span {
      position: relative;
      display: block;
      width: 33px;
      height: 4px;
      margin-bottom: 5px;
      position: relative;
      background: var(--green-1);
      border-radius: 3px;
      z-index: 1;
      transform-origin: 4px 0px;
      transition: transform 0.5s cubic-bezier(0.77, 0.2, 0.05, 1),
        background 0.5s cubic-bezier(0.77, 0.2, 0.05, 1), opacity 0.55s ease;

      &:first-child {
        transform-origin: 0% 0%;
      }

      &:nth-last-child(2) {
        transform-origin: 0% 100%;
      }
    }
  }

  .menuToggle {
    input {
      &:checked ~ span {
        opacity: 1;
        transform: rotate(45deg) translate(-2px, -1px);
        background: var(--green-1);

        &:nth-last-child(3) {
          opacity: 0;
          transform: rotate(0deg) scale(0.2, 0.2);
        }

        &:nth-last-child(2) {
          transform: rotate(-45deg) translate(0, -1px);
        }
      }

      &:checked ~ .menuItem {
        transform: none;
      }
    }
  }

  .menuItem {
    position: absolute;
    width: 300px;
    padding: 50px;
    padding-top: 125px;
    background: var(--black-1);
    box-shadow: -5px 0px 10px 5px var(--black-dark);
    list-style-type: none;
    -webkit-font-smoothing: antialiased;
    transform-origin: 0% 0%;
    transition: transform 0.5s cubic-bezier(0.77, 0.2, 0.05, 1);

    @media only screen and (max-width: 402px) {
      width: calc(100vw - 100px);
    }

    li {
      padding: 10px 0;
      font-size: 22px;

      &.bottom {
        position: absolute;
        bottom: 80px;
        padding: 0px;
        padding-bottom: 125px;
        display: flex;
        gap: 12px;
        flex-wrap: wrap;

        a {
          color: var(--green-1);
          font-size: 14px;
        }

        .why-ads-btn-bottom {
          text-align: center;
          position: relative;
          &:after {
            content: "";
            position: absolute;
            right: -6px;
            top: 0px;
            width: 1px;
            height: 16px;
            background: var(--green-1);

            @media only screen and (max-width: 315px) {
              display: none;
            }
          }
        }
      }
    }
  }

  .menu--right {
    .menuToggle {
      position: fixed;
      right: 0;

      input {
        right: 30px;
      }

      span {
        right: 30px;
      }
    }

    .menuItem {
      height: 100vh;
      right: 0;
      margin: -100px 0 0 0;
      transform: translate(105%, 0);

      li {
        &:not(.bottom) {
          &:hover {
            transform: scale(1.1);

            a {
              padding-left: 15px;
            }
          }
        }
      }
    }
  }

  @media only screen and (min-width: 450px) {
    .mobile-language-toggle {
      display: none;
    }
  }
}
</style>
