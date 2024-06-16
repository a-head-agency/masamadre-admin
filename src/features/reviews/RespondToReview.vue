<script setup lang="ts">
import { inject } from 'vue'

import { useForm } from 'vee-validate'
import * as yup from 'yup'

import MyInputNumber from '@/components/MyInputNumber.vue'
import MyTextArea from '@/components/MyTextarea.vue'

import { useChangeReviewStatus } from './composables'
import { type IReview } from './interfaces'

const dialogRef = inject('dialogRef') as any
const review = dialogRef.value.data.review as IReview

const { handleSubmit } = useForm({
    validationSchema: yup.object({
        id: yup.number().required().label('ID обращения'),
        user_id: yup.number().required().label('ID пользователя'),
        text: yup.string().required().label('Ответ')
    }),
    initialValues: {
        id: review.id,
        user_id: review.user_id
    }
})

const { mutate, isPending } = useChangeReviewStatus()

const onSubmit = handleSubmit((vals) => {
    mutate(vals)
})
</script>

<template>
    <form @submit.prevent="onSubmit">
        <div class="grid grid-cols-1 gap-x-4 md:grid-cols-2">
            <MyInputNumber name="id" label="ID" disabled />
            <MyInputNumber name="user_id" label="ID пользователя" disabled />
        </div>

        <div class="mb-4 rounded-lg bg-indigo-50 p-4 text-gray-900">
            <p>{{ review.text }}</p>
        </div>

        <MyTextArea name="text" label="Ответ" />

        <Button
            class="mt-4 flex w-full items-center"
            type="submit"
            label="Сохранить"
            :loading="isPending"
            :disabled="isPending"
        />
    </form>
</template>
