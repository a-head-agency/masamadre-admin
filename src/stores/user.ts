import { ref } from 'vue'
import { defineStore } from 'pinia'
import router from '@/router'

export const useUserStore = defineStore(
    'user',
    () => {
        const isAuthenticated = ref(false)
        const accessToken = ref<string>()
        const refreshToken = ref<string>()
        const userID = ref<number>()

        const signOut = () => {
            isAuthenticated.value = false
            accessToken.value = undefined
            refreshToken.value = undefined
            userID.value = undefined
            router.push({ name: 'login' })
        }

        return { isAuthenticated, signOut, accessToken, refreshToken, userID }
    },
    { persist: true }
)
