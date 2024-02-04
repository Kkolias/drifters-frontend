<template>
    <div class="page-new-qualifying">
        <QualifyingEditForm />
    </div>
</template>

<script lang="ts">
import authenticatedView from '../../mixins/authenticatedView.vue'
export default {
    mixins: [authenticatedView]
}
</script>