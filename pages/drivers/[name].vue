<template>
    <div class="page-driver">
        <LoadingIndicator v-if="loading" />
        <div v-if="!loading">
            <!-- <pre>
                {{ driverData }}
            </pre> -->
            <DriversProfile :driver="(driverData as IDriver)" />
        </div>
    </div>
</template>

<script lang="ts">
// import authenticatedView from '../../mixins/authenticatedView.vue'
import apiDrivers from "../../utils/drifting/api-drivers";
import type { IDriver } from '~/interfaces/driver.interface';


interface DriverByIdPageData {
    driverData: IDriver | null,
    loading: boolean
}
export default {
    // mixins: [authenticatedView],
    data: (): DriverByIdPageData => ({
        driverData: null,
        loading: true,
    }),
    computed: {
        name(): string {
            const name = this.$route?.params?.name as string || ''
            return name
        }
    },
    mounted() {
        this.fetchDriver()
    },
    methods: {
        async fetchDriver() {
            this.setLoading(true)
            const driver = await apiDrivers.getDriverByName(this.name)
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