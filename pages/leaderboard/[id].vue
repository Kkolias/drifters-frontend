<template>
    <div class="page-leaderboard">
        <LoadingIndicator v-if="loading" />
        <div v-if="!loading">
            <pre>
                {{ leaderboard }}
            </pre>
        </div>
        <!-- <FishingPermitCard v-if="!loading" :permitData="permitData" @updatePermitData="setPermitData" /> -->
    </div>
</template>

<script lang="ts">
import type { ILeaderboard } from '~/interfaces/leaderboard.interface'
import authenticatedView from '../../mixins/authenticatedView.vue'
import apiDriftLeaderboard from '~/utils/drifting/api-drift-leaderboard'

interface IByIdPageData {
    leaderboard: ILeaderboard | null,
    loading: boolean
}
export default {
    mixins: [authenticatedView],
    data: (): IByIdPageData => ({
        leaderboard: null,
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
            const leaderboard = await apiDriftLeaderboard.getLeaderboardById(this.id)
            this.setLeaderboard(leaderboard)
            this.setLoading(false)
        },
        setLeaderboard(leaderboard: ILeaderboard | null): void {
            this.leaderboard = leaderboard
        },
        setLoading(value: boolean): void {
            this.loading = value
        },
    }
}
</script>