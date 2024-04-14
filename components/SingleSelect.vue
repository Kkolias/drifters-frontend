<template>
  <div class="component-SingleSelect">
    <div class="input-wrapper" :class="{ open: isListOpen }">
      <div class="input area">
        <button
          type="button"
          class="blank toggle-list-btn"
          @click="toggleListOpen(!isListOpen)"
        >
          {{ selectedValueLabel }}
          <div class="arrow-icon"></div>
        </button>
      </div>

      <ul v-if="isListOpen" class="option-list-wrapper">
        <li v-for="(option, key) in optionList" :key="key">
          <button
            type="button"
            class="blank select-option-btn"
            @click="selectOption(option)"
          >
            {{ optionLabel(option) }}
          </button>
        </li>
      </ul>
    </div>
  </div>
</template>

<script lang="ts">
export default {
  props: {
    optionList: {
      type: Array as PropType<readonly any[]>,
      default: () => [],
    },
    value: {
      type: [String, Object] as PropType<
        string | { key: string; label: string } | null
      >,
      default: () => null,
    },
    placeholderOption: {
      type: String,
      default: "",
    },
    labelKey: {
      type: String,
      default: "label",
    },
    valueKey: {
      type: String,
      default: "key",
    },
  },
  data: () => ({
    isListOpen: false,
  }),
  computed: {
    selectedValueLabel(): string {
      if (!this.value) return this.placeholderOption;
      if (typeof this.value === "string") return this.value;

      return this.value?.[this.labelKey as keyof typeof this.value] || "";
    },
  },
  methods: {
    optionLabel(option: any): string {
      if (typeof option === "string") return option;
      return option?.[this.labelKey];
    },

    toggleListOpen(value: boolean): void {
      console.log(value);
      this.isListOpen = value;
    },
    selectOption(option: any): void {
      this.toggleListOpen(false);
      this.$emit("select", option);
    },
    isOptionSelected(option: any): boolean {
      return option?.[this.valueKey] === this.value;
    },
  },
};
</script>

<style lang="less" scoped>
.component-SingleSelect {
  width: 100%;

  .input-wrapper {
    position: relative;

    .input {
      .toggle-list-btn {
        width: 100%;
        height: 100%;

        .arrow-icon {
          position: absolute;
          right: 8px;
          top: 50%;
          background: url("~/assets/svg/arrow-grey.svg");
          background-repeat: no-repeat;
          background-position: center;
          background-size: 10px;
          width: 20px;
          height: 20px;
          transform: translateY(-50%) rotate(90deg);
        }
      }

      &:active,
      &:focus,
      &:focus-visible {
        transform: scale(1) !important;
      }
    }

    &.open {
      .input {
        border-color: var(--green-1);
        border-bottom: none;
        border-radius: 10px 10px 0 0;
        transition: 0s;

        .toggle-list-btn {
          .arrow-icon {
            background: url("~/assets/svg/arrow-green.svg");
            background-repeat: no-repeat;
            background-position: center;
            background-size: 10px;
            transform: translateY(-50%) rotate(270deg);
          }
        }
      }

      .option-list-wrapper {
        position: absolute;
        width: 100%;
        box-sizing: border-box;
        list-style: none;
        border: 2px solid var(--green-1);
        border-top: none;
        border-radius: 0 0 10px 10px;
        background: var(--black-1);
        z-index: 3;
        padding: 0;
        margin: 0;
        bottom: 0;
        transform: translateY(100%);

        li {
          padding: 8px;

          .select-option-btn {
            width: 100%;
            height: 100%;
          }

          &:hover {
            background: var(--black-2);
          }
        }
      }
    }
  }
}
</style>
