<script setup lang="ts">
import { useMutation } from '@tanstack/vue-query'
import { toTypedSchema } from '@vee-validate/yup'
import { storeToRefs } from 'pinia'
import { useForm } from 'vee-validate'
import { useRouter } from 'vue-router'
import * as yup from 'yup'

import { useToast } from 'primevue/usetoast'

import logoSrc from '@/assets/logo.svg'

import MyInputText from '@/components/MyInputText.vue'

import { useUserStore } from '@/stores/user'

import { AuthUserService } from '@/features/auth/user'

const toast = useToast()

const router = useRouter()
const userStore = useUserStore()
const { isAuthenticated, accessToken, refreshToken } = storeToRefs(userStore)

const { handleSubmit } = useForm({
    validationSchema: toTypedSchema(
        yup.object({
            login: yup.string().required().label('Логин'),
            password: yup.string().required().label('Пароль')
        })
    )
})

const { isPending, mutate } = useMutation({
    mutationFn: AuthUserService.signIn,
    onSuccess(data) {
        if (data) {
            accessToken.value = data.token
            refreshToken.value = data.refreshToken
            isAuthenticated.value = true
            router.push({ name: 'dashboard' })
        }
    },
    onError(error) {
        if (error instanceof AuthUserService.SignInErrors.InvalidCredentials) {
            toast.add({
                severity: 'error',
                life: 3000,
                summary: 'Ошибка',
                detail: 'Неверный логин или пароль'
            })
        }
        if (error instanceof AuthUserService.SignInErrors.UnknownError) {
            toast.add({
                severity: 'error',
                life: 3000,
                summary: 'Неизвестная ошибка',
                detail: error.message
            })
        }
        if (error instanceof AuthUserService.SignInErrors.InvalidData) {
            toast.add({
                severity: 'error',
                life: 3000,
                summary: 'Ошибка',
                detail: 'Некорректные данные с API'
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
                <div class="text-900 mb-3 text-3xl font-medium">Вход в панель администратора</div>
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
