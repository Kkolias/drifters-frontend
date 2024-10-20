<template>
    <div class="component-ControlPanelDriftEventOverviewEdit">
        <!-- <pre>{{ driftEvent }}</pre> -->
        <DriftEventEditForm :initialId="eventId" :notModal="true" @eventUpdated="setUpdatedEvent" @reloadSeason="reloadSeason" />
    </div>
</template>

<script lang="ts">
import type { IDriftEvent } from '~/interfaces/drift-event.interface';

export default {
    props: {
        eventId: {
            type: String,
            default: ''
        }
    },
    methods: {
        setUpdatedEvent(updatedEvent: IDriftEvent) {
            this.$emit('setUpdatedEvent', updatedEvent);
        },
        reloadSeason() {
            this.$emit('reloadSeason');
        }
    }
}
</script>

<style lang="less" scoped>
.component-ControlPanelDriftEventOverviewEdit {

}
</style>