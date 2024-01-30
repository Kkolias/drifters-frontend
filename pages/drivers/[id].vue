<template>
    <div class="page-fishing-permit-card">
        <LoadingIndicator v-if="loading" />
        <div v-if="!loading">
            <pre>
                {{ driverData }}
            </pre>
        </div>
        <!-- <FishingPermitCard v-if="!loading" :permitData="permitData" @updatePermitData="setPermitData" /> -->
    </div>
</template>

<script lang="ts">
import authenticatedView from '../../mixins/authenticatedView.vue'
import apiDrivers from "../../utils/drifting/api-drivers";
import type { IDriver } from '~/interfaces/driver.interface';


interface DriverByIdPageData {
    driverData: IDriver | null,
    loading: boolean
}
export default {
    mixins: [authenticatedView],
    data: (): DriverByIdPageData => ({
        driverData: null,
        loading: true,
    }),
    computed: {
        id(): string {
            const id = this.$route?.params?.id as string || ''
            return id
        }
    },
    mounted() {
        this.fetchDriver()
    },
    methods: {
        async fetchDriver() {
            this.setLoading(true)
            const driver = await apiDrivers.getDriverById(this.id)
            this.setDriverData(driver)
            this.setLoading(false)
        },
        setDriverData(data: IDriver | null): void {
            this.driverData = data
        },
        setLoading(value: boolean): void {
            this.loading = value
        },
    }
}
</script>