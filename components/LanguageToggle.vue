<template>
  <div class="component-LanguageToggle">
    <button class="blank" @click="toggleLanguage()">
      <div class="selected-box" :class="{ right: isEnglish }"></div>
      <div class="lang fi" :class="{ selected: !isEnglish }">FI</div>
      <div class="lang en" :class="{ selected: isEnglish }">EN</div>
    </button>
  </div>
</template>

<script lang="ts">
export default {
  data: () => ({
    language: "fi",
  }),
  computed: {
    isEnglish(): boolean {
      return this.$route.path.startsWith("/en");
    },
    currentPath(): string {
      return this.$route.path;
    },
    currentPathWithoutLanguage(): string {
      return this.currentPath.replace(/^\/en/, "").replace(/^\/fi/, "");
    },
  },
  methods: {
    toggleLanguage(): void {
      const path = this.isEnglish ? this.currentPathWithoutLanguage : `/en${this.currentPathWithoutLanguage}`;
      const workingPath = path || "/";
      this.$router.push(workingPath);
    },
  },
};
</script>

<style lang="less" scoped>
.component-LanguageToggle {
  &:hover {
    text-decoration: none !important;
  }
  button {
    position: relative;
    height: 30px;
    background: var(--black-2);
    color: var(--white-1);
    border-radius: 10px;
    font-size: 14px;
    font-weight: 700;
    line-height: 30px;
    padding: 1px;

    display: flex;

    &:hover {
      box-shadow: 0 0 5px 0 var(--black-2);

      .lang.selected,
      .selected-box {
        animation: shake 0.5s;
      }

      @keyframes shake {
        0% {
          transform: translateX(0);
        }
        25% {
          transform: translateX(-1px);
        }
        50% {
          transform: translateX(1px);
        }
        75% {
          transform: translateX(-1px);
        }
        100% {
          transform: translateX(0);
        }
      }
    }

    .selected-box {
      position: absolute;
      left: 0;
      width: 50%;
      height: 30px;
      background: var(--black-1);
      border-radius: 10px;
      transition: all 0.3s;

      &.right {
        left: 50%;
      }
    }

    .lang {
      position: relative;
      z-index: 1;
      width: 35px;
      text-align: center;

      &.selected {
        // background: var(--black-1);
        // border-radius: 10px;
        color: var(--green-1);
      }
    }
  }
}
</style>
