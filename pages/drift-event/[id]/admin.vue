<template>
    <div>
        <h1>Admin</h1>
        <DriftEventAdminView :id="id" />
    </div>
</template>

<script lang="ts">
import authenticatedView from '../../../mixins/authenticatedView.vue'
export default {
    mixins: [authenticatedView],

    computed: {
        id(): string {
            return this.$route?.params?.id as string || ''
        }
    }
}
</script>