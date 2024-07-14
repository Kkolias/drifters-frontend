<template>
    <div class="page-drift-event full-height-page">
        <DriftEventList />
    </div>
</template>

<script lang="ts">
import authenticatedView from '../../mixins/authenticatedView.vue'

export default {
    mixins: [authenticatedView],
}
</script>
