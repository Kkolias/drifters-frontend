<template>
  <div class="component-Modal" v-if="value">
    <div class="overlay" @click="close()"></div>
    <div class="slot">
      <button type="button" class="blank close-icon" @click="close()"></button>
      <slot />
    </div>
  </div>
</template>

<script lang="ts">
export default {
  props: {
    value: {
      type: Boolean,
      default: false,
    },
  },
  mounted() {
    this.handleNoScroll()
  },
  beforeUnmount() {
    this.handleAddScroll()
  },
  watch: {
    value: {
      immediate: true,
      handler(value: boolean): void {
        if (value) {
          this.handleNoScroll()
        } else {
          this.handleAddScroll()
        }
      },
    },
  },
  methods: {
    handleNoScroll(): void {
        if(!document) return
        document.body.style.overflow = "hidden";
    },
    handleAddScroll(): void {
        if(!document) return
        document.body.style.overflow = "auto";
    },
    close(): void {
      this.$emit("close");
    },
  },
};
</script>

<style lang="less" scoped>
.component-Modal {
  width: 100%;
  height: 100%;
  position: fixed;
  top: 0;
  left: 0;

  .overlay {
    position: fixed;
    background: var(--black-1);
    opacity: 0.8;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 1000;
  }

  .slot {
    position: fixed;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    z-index: 1001;

    .close-icon {
      background-image: url("~/assets/svg/close-grey.svg");
      background-repeat: no-repeat;
      background-size: 20px;
      background-position: center;
      position: absolute;
      top: 8px;
      right: 8px;
      width: 20px;
      height: 20px;
      transition: all 0.25s ease-in-out;
      cursor: pointer;

      &:hover {
        background-image: url("~/assets/svg/close-green.svg");
        transform: scale(1.1);
      }
    }
  }
}
</style>
