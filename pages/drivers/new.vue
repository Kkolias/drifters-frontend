<template>
  <div class="page-new-fishing-permit">
    <DriversEditForm />
  </div>
</template>

<script lang="ts">
import authenticatedView from "../../mixins/authenticatedView.vue";
export default {
  mixins: [authenticatedView],
};
</script>
