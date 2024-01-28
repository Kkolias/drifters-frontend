<template>
  <div class="component-Navbar">
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
        label: 'Etusivu',
        path: '/'
      },
      {
        label: 'Uusi lupa',
        path: '/fishing-permit/new'
      },
      {
        label: 'Profiili',
        path: '/profile'
      },
      {
        label: 'Kaikki luvat',
        path: '/fishing-permit/all-permits'
      },
    ]
  }),
  computed: {
    path(): string {
      return this.$route?.path || ''
    }
  },
  watch: {
    path() {
      this.navOpen = false
    }
  },
  mounted() {
    window?.addEventListener('click', this.chechClickPosition)
  },
  destroyed() {
    window?.removeEventListener('click', this.chechClickPosition)
  },
  beforeUnmount() {
    window?.removeEventListener('click', this.chechClickPosition)
  },
  methods: {
    chechClickPosition(e: any): void {
      if (!e?.target?.closest('.component-Navbar')) {
        this.navOpen = false
      }
    }
  }
}
</script>


<style lang="less" scoped>
.component-Navbar {
  .menuToggle {
    display: block;
    position: relative;
    top: 50px;
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
      transition: transform 0.5s cubic-bezier(0.77, 0.2, 0.05, 1.0),
        background 0.5s cubic-bezier(0.77, 0.2, 0.05, 1.0),
        opacity 0.55s ease;

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
      &:checked~span {
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

      &:checked~.menuItem {
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
    transition: transform 0.5s cubic-bezier(0.77, 0.2, 0.05, 1.0);

    li {
      padding: 10px 0;
      font-size: 22px;
    }
  }

  .menu--right {
    .menuToggle {
      position: fixed;
      right: 0;

      input {
        right: 50px;
      }

      span {
        right: 50px;
      }
    }

    .menuItem {
      height: 100vh;
      right: 0;
      margin: -100px 0 0 0;
      transform: translate(105%, 0);

      li {
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
</style>