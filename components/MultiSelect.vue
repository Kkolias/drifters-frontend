<template>
  <div class="component-MultiSelect">
    <div class="input-wrapper" :class="{ open: isListOpen }">
      <div class="input no-scale area">
        <button
          type="button"
          class="blank toggle-list-btn"
          @click="toggleListOpen(!isListOpen)"
        >
          {{ selectedLabel }}
          <div class="arrow-icon"></div>
        </button>
      </div>

      <ul v-if="isListOpen" class="option-list-wrapper">
        <li v-for="(option, key) in optionList" :key="key">
          <CheckboxButton
            :class="{ disabled }"
            :label="optionLabel(option)"
            :checked="isOptionSelected(option)"
            @onClick="selectOption(option.value)"
          />
        </li>
      </ul>
    </div>
  </div>
</template>

<script lang="ts">
import Language from '~/mixins/language.vue';

export default {
  mixins: [Language],
  props: {
    optionList: {
      type: Array as PropType<readonly any[]>,
      default: () => [],
    },
    selectedIdList: {
      type: Array as PropType<readonly string[]>,
      default: () => [],
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
    disabled: {
      type: Boolean,
      default: false,
    },
  },
  data: () => ({
    isListOpen: false,
  }),
  computed: {
    textContent() {
      return this.getTranslation({
        fi: {
          selected: "valittua"
        },
        en: {
          selected: "selected"
        }
      });
    },
    selectedLabel(): string {
      if (this.selectedIdList.length === 0) return this.placeholderOption;
      if (this.selectedIdList.length === 1) {
        const selectedOption = this.getOption(this.selectedIdList[0]);
        return this.optionLabel(selectedOption);
      }

      return `${this.selectedIdList.length} ${this.textContent.selected}`;
    },
  },
  mounted() {
    document.addEventListener("click", this.checkOutsideClick);
  },
  beforeUnmount() {
    document.removeEventListener("click", this.checkOutsideClick);
  },
  methods: {
    checkOutsideClick(event: MouseEvent): void {
        if (!this.$el.contains(event.target)) {
        this.isListOpen = false;
      }
    },
    getOption(id: string): any {
      return this.optionList.find((option) => option[this.valueKey] === id);
    },
    optionLabel(option: any): string {
      if (typeof option === "string") return option;
      return option?.[this.labelKey];
    },

    toggleListOpen(value: boolean): void {
      this.isListOpen = value;
    },
    selectOption(optionId: string): void {
      if (this.isOptionSelected(optionId)) {
        const newList = this.selectedIdList.filter((id) => id !== optionId);
        this.$emit("select", newList);
      } else {
        this.$emit("select", [...this.selectedIdList, optionId]);
      }
    },
    isOptionSelected(option: any): boolean {
      if (typeof option === "string") {
        return this.selectedIdList.includes(option);
      }
      return this.selectedIdList.includes(option?.[this.valueKey]);
    },
  },
};
</script>

<style lang="less" scoped>
.component-MultiSelect {
  width: 100%;

  .input-wrapper {
    position: relative;

    .input {
      .toggle-list-btn {
        width: 100%;
        height: 100%;
        color: var(--white-1);
        opacity: 0.6;

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
          transition: transform 0.25s ease-in-out;
        }
      }
      transition: none !important;
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
        overflow-y: auto;
        max-height: 250px;

        li {
          .disabled {
            cursor: not-allowed;
            pointer-events: none;
            opacity: 0.4;
          }
          //   position: relative;
          //   label {
          //     padding: 8px;
          //     display: flex;

          //     input {
          //       margin-bottom: 1px;
          //     }

          //     .option-label {
          //       margin-left: 4px;
          //     }

          //     &:hover {
          //       background: var(--black-2);
          //     }
          //   }
        }
      }
    }
  }
}
</style>
