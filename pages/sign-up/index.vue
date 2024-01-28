<template>
    <div class="page-sign-up">
        <SignUpForm />
    </div>
</template>

<script lang="ts">
import userApi from '../../utils/api-user'
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
        },
    }
}
</script>