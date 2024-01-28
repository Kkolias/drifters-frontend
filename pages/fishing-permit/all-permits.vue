
<template>
    <div class="page-all-permits">
        <FishingPermitAllFishingPermits />
    </div>
</template>

<script lang="ts">

import authenticatedView from '../../mixins/authenticatedView.vue'
export default {
    mixins: [authenticatedView]
}
</script>