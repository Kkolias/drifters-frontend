<template>
    <div class="page-drift-season-new">
        <DriftSeasonEditForm />
    </div>
</template>

<script lang="ts">
import authenticatedView from '../../mixins/authenticatedView.vue'

export default {
    mixins: [authenticatedView],
}
</script>
