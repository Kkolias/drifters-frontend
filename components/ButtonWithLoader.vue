<template>
  <div class="component-ButtonWithLoader">
    <button :disabled="disabled" :type="parsedButtonType" :class="[buttonClass, { loading: loading }]" @click="e => doClick(e)">
      <LoadingIndicator v-if="loading" :isFixedSize="false" :isGreen="false" />
      <slot v-else></slot>

    </button>
  </div>
</template>

<script lang="ts">
export default {
  props: {
    buttonType: {
      type: String, default: 'button'
    },
    loading: {
      type: Boolean, default: true
    },
    disabled: {
      type: Boolean, default: false
    },
    buttonClass: {
      type: String, default: 'primary'
    }
  },
  computed: {
    // fuck the cops
    parsedButtonType(): 'button' | 'submit' | "reset" | undefined {
      return this.buttonType as 'button' | 'submit' | "reset" | undefined
    }
  },
  methods: {
    doClick(e: Event): void {
      // e.preventDefault()
      if (!this.loading) {
        this.$emit("click", e)
      }
    }
  }
}
</script>

<style lang="less" scoped>
.component-ButtonWithLoader {
  position: relative;

  button {
    min-width: 50px;

    &.loading {
      cursor: default !important;
    }
  }
}
</style>