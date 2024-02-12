
<template>
    <div class="page-leaderboards">
        <DriftLeaderboardList/>
    </div>
</template>

<script lang="ts">

import authenticatedView from '../../mixins/authenticatedView.vue'
export default {
    mixins: [authenticatedView]
}
</script>