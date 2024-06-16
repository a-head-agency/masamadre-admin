<script setup lang="ts">
import { inject } from 'vue'

import { useForm } from 'vee-validate'
import * as yup from 'yup'

import MyInputNumber from '@/components/MyInputNumber.vue'

import { useGiftBonusesToUser } from './composables'
import type { IUser } from './interfaces'

const dialogRef = inject('dialogRef') as any
const user = dialogRef.value.data.user as IUser

const { handleSubmit } = useForm({
    validationSchema: yup.object({
        user_id: yup.number().required().label('ID пользователя'),
        bonuses: yup.number().required().label('Количество бонусов')
    }),
    initialValues: {
        user_id: user.id
    }
})

const { mutateAsync, isPending } = useGiftBonusesToUser()

const onSubmit = handleSubmit((vals) => {
    mutateAsync(vals).then(dialogRef.value.close)
})
</script>

<template>
    <form @submit="onSubmit">
        <MyInputNumber name="user_id" label="ID" disabled />
        <MyInputNumber name="bonuses" label="Количество бонусов" />

        <Button
            class="mt-8 flex w-full items-center p-4"
            type="submit"
            label="Подарить"
            :loading="isPending"
            :disabled="isPending"
        />
    </form>
</template>
