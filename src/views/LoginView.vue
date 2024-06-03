<script setup lang="ts">
import logoSrc from '@/assets/logo.svg'

import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { storeToRefs } from 'pinia'
import { useToast } from 'primevue/usetoast'

import { useMutation } from '@tanstack/vue-query'
import { axiosPublic } from '@/network'
import { useForm } from 'vee-validate'
import * as yup from 'yup'
import MyInputText from '@/components/MyInputText.vue'
import { md5 } from 'js-md5'

const toast = useToast()

const router = useRouter()
const userStore = useUserStore()
const { isAuthenticated, accessToken, refreshToken } = storeToRefs(userStore)

const { handleSubmit } = useForm({
    validationSchema: yup.object({
        login: yup.string().required().label('Логин'),
        password: yup.string().required().label('Пароль')
    })
})

const { isPending, mutate } = useMutation<any, any, any>({
    mutationFn: async (payload: any) => {
        payload.password = md5(payload.password)
        return axiosPublic.post('admin/auth', payload)
    },
    onSuccess({ data }) {
        accessToken.value = data.token
        refreshToken.value = data.refreshToken
        isAuthenticated.value = true
        router.push({ name: 'dashboard' })
    },
    onError(error: any) {
        const body = error.response.data

        if (error.response.status === 401) {
            toast.add({
                severity: 'error',
                life: 3000,
                summary: 'Ошибка',
                detail: 'Неверный логин или пароль'
            })
        } else {
            toast.add({
                severity: 'error',
                life: 3000,
                summary: 'Ошибка',
                detail: body
            })
        }
    }
})

const signIn = handleSubmit((vals) => {
    mutate(vals)
})
</script>

<template>
    <main class="flex min-h-screen items-center justify-center p-4">
        <div class="flex flex-col items-center">
            <div class="mb-4 flex w-full flex-col items-center justify-center text-center">
                <img :src="logoSrc" alt="Image" class="mb-12 w-full max-w-xs" />
                <div class="text-900 mb-3 text-3xl font-medium">
                    Вход в панель администратора
                </div>
            </div>

            <form class="w-full max-w-sm" @submit="signIn">
                <MyInputText label="Логин" type="text" name="login" />
                <MyInputText label="Пароль" type="password" name="password" />

                <Button
                    icon="pi pi-user"
                    class="mt-4 flex w-full items-center p-4"
                    label="Войти"
                    type="submit"
                    :loading="isPending"
                    :disabled="isPending"
                />
            </form>
        </div>
    </main>
</template>
