<template>
    <div class="page-qualifying-list">
        <QualifyingList/>
    </div>
</template>

<script lang="ts">
import authenticatedView from '../../mixins/authenticatedView.vue'

export default {
    mixins: [authenticatedView],
}
</script>
