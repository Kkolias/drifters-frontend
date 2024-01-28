<template>
    <div class="component-Profile">
        <LoadingIndicator v-if="loading" />
        <div v-if="!loading" class="user-info-wrapper">
            <div class="info-wrapper">
                <label for="name">Nimi:</label>
                <p id="name">{{ firstName }} {{ lastName }}</p>
            </div>
            <div class="info-wrapper">
                <label for="name">Sähköposti:</label>
                <p id="name">{{ email }}</p>
            </div>
            <div class="info-wrapper">
                <label for="name">Rooli:</label>
                <p id="name">{{ role }}</p>
            </div>
            <div class="info-wrapper">
                <label for="name">Liittynyt:</label>
                <p id="name">{{ createdAtDate }}</p>
            </div>
            <button class="secondary" @click="logout()">Logout</button>
        </div>
    </div>
</template>

<script lang="ts">
import userApi from '~/utils/api-user'
import type { IUser } from '../interfaces/user.interface'
import { formatISODateToString } from '~/utils/time'

interface ProfileData {
    userData: IUser | null
    loading: boolean
}

export default {
    data: (): ProfileData => ({
        userData: null,
        loading: false
    }),
    computed: {
        firstName(): string {
            return this.userData?.firstName || ''
        },
        lastName(): string {
            return this.userData?.lastName || ''
        },
        role(): string {
            return this.userData?.role || ''
        },
        email(): string {
            return this.userData?.email || ''
        },
        createdAtDate(): string {
            const date = this.userData?.createdAt || ''
            return formatISODateToString(date)
        }
    },
    mounted() {
        this.fetchUser()
    },
    methods: {
        async fetchUser() {
            this.setLoading(true)
            const user = await userApi.getUserByToken()
            this.setUserData(user)
            this.setLoading(false)
        },
        logout() {
            userApi.eraseToken()
            this.$router.push("/login")
        },
        setUserData(user: any): void {
            this.userData = user
        },
        setLoading(value: boolean): void {
            this.loading = value
        }
    }
}
</script>

<style lang="less" scoped>
.component-Profile {
    .user-info-wrapper {
        border: 2px solid var(--black-2);
        border-radius: 10px;
        padding: 24px;
        max-width: 400px;
        margin: auto;

        .info-wrapper {
            margin: 12px 0;

            label {
                font-size: 14px;
                color: var(--white-2);
            }

            p {
                margin: 0;
                font-size: 18px;
            }
        }
    }
}
</style>