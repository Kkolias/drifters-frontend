<template>
  <label class="component-CheckboxButton">
    {{ label }}
    <input type="checkbox" :checked="checked" @click="handleClick()" />
    <span class="checkmark" :class="{ checked }"> </span>
  </label>
</template>

<script lang="ts">
export default {
  props: {
    label: {
      type: String,
      required: true,
    },
    checked: {
      type: Boolean,
      default: false,
    },
  },
  methods: {
    handleClick() {
      this.$emit("onClick");
    },
  },
};
</script>

<style lang="less" scoped>
.component-CheckboxButton {
  display: block;
  position: relative;
  padding-left: 35px;
  padding-bottom: 8px;
  padding-top: 8px;
  cursor: pointer;
  //   font-size: 22px;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;

  &:hover {
    background: var(--black-2);
  }

  input {
    position: absolute;
    opacity: 0;
    cursor: pointer;
    height: 0;
    width: 0;
  }

  .checkmark {
    position: absolute;
    top: 50%;
    left: 6px;
    height: 15px;
    width: 15px;
    background-color: #eee;
    transform: translateY(-50%);
  }
  /* When the checkbox is checked, add a blue background */
  .checkmark {
    &.checked {
      background-color: var(--green-1);
    }
  }

  /* Create the checkmark/indicator (hidden when not checked) */
  .checkmark:after {
    content: "";
    position: absolute;
    display: none;
  }

  /* Show the checkmark when checked */
  .checkmark.checked {
    &:after {
      display: block;
    }
  }

  /* Style the checkmark/indicator */
  .checkmark:after {
    left: 4px;
    top: 0px;
    width: 4px;
    height: 8px;
    border: solid white;
    border-width: 0 3px 3px 0;
    -webkit-transform: rotate(45deg);
    -ms-transform: rotate(45deg);
    transform: rotate(45deg);
  }
}
</style>
