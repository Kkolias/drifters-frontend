<template>
    <div class="default-page">
        <Profile />
    </div>
</template>

<script lang="ts">
import authenticatedView from '../mixins/authenticatedView.vue'
export default {
    mixins: [authenticatedView]
}
</script>