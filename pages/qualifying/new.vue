<template>
  <div class="page-new-qualifying">
    <QualifyingEditForm />
  </div>
</template>

<script lang="ts">
import authenticatedView from "../../mixins/authenticatedView.vue";
export default {
  mixins: [authenticatedView],
};
</script>

<style lang="less" scoped>
.page-new-qualifying {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
</style>
