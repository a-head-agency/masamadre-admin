import axios from 'axios'

import pinia from '@/stores'
import { useUserStore } from '@/stores/user'

const baseURL = 'https://api.masamadre.ru'

export const axiosPublic = axios.create({
    baseURL
})

export const axiosPrivate = axios.create({
    baseURL
})

axiosPrivate.interceptors.request.use(
    (config) => {
        const userStore = useUserStore(pinia)
        if (userStore.isAuthenticated) {
            config.headers['Authorization'] = userStore.accessToken
        } else {
            userStore.signOut()
        }
        return config
    },
    (error) => Promise.reject(error)
)

axiosPrivate.interceptors.response.use(
    (res) => res,
    async (err) => {
        const userStore = useUserStore(pinia)

        const originalConfig = err.config
        if (err.response) {
            if (
                (err.response.status === 403 || err.response.status === 401) &&
                !originalConfig._retry
            ) {
                originalConfig._retry = true

                try {
                    const rs = await axiosPrivate.post('/api/refresh', {
                        refreshToken: userStore.refreshToken
                    })
                    const { accessToken, refreshToken } = rs.data
                    userStore.accessToken = accessToken
                    userStore.refreshToken = refreshToken

                    axiosPrivate.defaults.headers.common['Authorization'] = accessToken

                    return axiosPrivate(originalConfig)
                } catch (_error: any) {
                    if (_error.response && _error.response.data) {
                        userStore.isAuthenticated = false
                        return Promise.reject(_error.response.data)
                    }

                    userStore.isAuthenticated = false
                    return Promise.reject(_error)
                }
            }
        }

        return Promise.reject(err)
    }
)

axiosPrivate.interceptors.response.use(
    (res) => res,
    (error) => Promise.reject(error)
)

axiosPublic.interceptors.response.use(
    (res) => res,
    (error) => Promise.reject(error)
)
