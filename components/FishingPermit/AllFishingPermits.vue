<template>
    <div class="component-AllFishingPermits">
        <LoadingIndicator v-if="loading" />
        <div class="permit-list-wrapper">
            <DataTable :headerList="headerList" :dataList="parsedPermitList" />
        </div>
    </div>
</template>

<script lang="ts">
import { toLocaleString } from '~/utils/time'
import type { IFishingPermit, IFishingPermitWithLink } from '../../interfaces/fishing-permit.interface'
import apiFishingPermits from '../../utils/api-fishing-permits'

interface AllFishingPermitsData {
    fishingPermitList: IFishingPermit[]
    loading: boolean
}

export default {
    data: (): AllFishingPermitsData => ({
        fishingPermitList: [],
        loading: false
    }),
    computed: {
        headerList() {
            return [
                {
                    name: 'Id',
                    key: '_id',
                    isLink: true
                },
                {
                    name: 'Etunimi',
                    key: 'firstName'
                },
                {
                    name: 'Sukunimi',
                    key: 'lastName'
                },
                {
                    name: 'Sähköposti',
                    key: 'email'
                },
                {
                    name: 'Alkamisaika',
                    key: 'startsAt'
                },
                {
                    name: 'Päättymisaika',
                    key: 'endsAt'
                },
                {
                    name: 'Ostettu',
                    key: 'createdAt'
                },
                {
                    name: 'Järvi',
                    key: 'lakeId'
                },
            ]
        },
        parsedPermitList(): IFishingPermitWithLink[] {
            return this.fishingPermitList?.map(permit => {
                const id = permit?._id || ''
                const link = `/fishing-permit/${id}`

                const startsAtLocal = toLocaleString(permit?.startsAt)
                const endsAtLocal = toLocaleString(permit?.endsAt)
                const createdAtLocal = toLocaleString(permit?.createdAt)

                return {
                    ...permit,
                    link,
                    startsAt: startsAtLocal,
                    endsAt: endsAtLocal,
                    createdAt: createdAtLocal
                }
            }) || []
        },
    },
    mounted() {
        this.fetchFishingPermits()
    },
    methods: {
        async fetchFishingPermits() {
            this.setLoading(true)
            const permits = await apiFishingPermits.getAllFishingPermits()
            this.setFishingPermitList(permits)
            this.setLoading(false)
        },
        setFishingPermitList(permits: IFishingPermit[]): void {
            this.fishingPermitList = permits
        },
        setLoading(value: boolean): void {
            this.loading = value
        }
    }
}
</script>

<style lang="less" scoped>
.component-AllFishingPermits {
    .permit-list-wrapper {

        table {
            // th,
            // td {
            //     border: 2px solid var(--green-1);
            // }
        }
    }
}
</style>