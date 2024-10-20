<template>
    <div class="page-drift-season full-height-page">
        <DriftSeasonList />
    </div>
</template>

<script lang="ts">
import authenticatedView from '../../mixins/authenticatedView.vue'
export default {
    mixins: [authenticatedView],
}
</script>