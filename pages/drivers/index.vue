
<template>
    <div class="page-all-drivers">
        <DriversList />
    </div>
</template>

<script lang="ts">

import authenticatedView from '../../mixins/authenticatedView.vue'
export default {
    mixins: [authenticatedView]
}
</script>