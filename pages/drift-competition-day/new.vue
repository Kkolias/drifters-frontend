<template>
    <div class="page-drift-competition-day-new">
        <DriftCompetitionDayEditForm />
    </div>
</template>

<script lang="ts">
import authenticatedView from '../../mixins/authenticatedView.vue'

export default {
    mixins: [authenticatedView],
}
</script>
