<template>
  <div class="component-DriftSeasonAverageQualifyingResultModal">
    <Modal :value="true" @close="closeModal()"> </Modal>
  </div>
</template>

<script lang="ts">
export default {
  methods: {
    closeModal() {
      this.$emit("close");
    },
  },
};
</script>

<style lang="less" scoped>
.component-DriftSeasonAverageQualifyingResultModal {
}
</style>
