<template>
    <div class="page-login main-page">
        <LoginForm />
    </div>
</template>

<script lang="ts">
import userApi from '~/utils/api-user';

export default {
    async mounted() {
        const logged = await this.isLogged()
        if (logged) this.$router.push("/")
    },
    methods: {
        async getUser() {
            return await userApi.getUserByToken()
        },
        async isLogged(): Promise<boolean> {
            try {

                const user = await this.getUser()

                if (!user) return false

                return !!user
            } catch (error) {
                return false

            }
        }
    }
}
</script>


<style lang="less" scoped>
.page-login {
    margin: auto;
}
</style>