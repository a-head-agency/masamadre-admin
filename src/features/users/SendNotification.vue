<template>
    <form @submit="onSubmit">
        <MyInputNumber name="user_id" label="ID пользователя" disabled />
        <MyInputText name="title" label="Заголовок" class="mb-4" />
        <MyInputText name="text" label="Тело" class="mb-4" />

        <h2 class="mb-1 text-lg font-medium">Куда отправить?</h2>
        <small class="p-error mb-3 block">{{ errors[''] || '&nbsp;' }}</small>
        <div class="flex flex-col gap-2">
            <MyInputSwitch name="push" label="Пуш" />
            <MyInputSwitch name="email" label="Электронная почта" />
            <MyInputSwitch name="phone" label="SMS" />
        </div>
        <Button
            class="mt-8 flex w-full items-center p-4"
            type="submit"
            label="Отправить"
            :loading="isPending"
            :disabled="isPending"
        />
    </form>
</template>

<script setup lang="ts">
import MyInputNumber from '@/components/MyInputNumber.vue'
import { useForm } from 'vee-validate'
import yup from '@/yup'
import MyInputSwitch from '@/components/MyInputSwitch.vue'
import { useSendNotification } from './composables'
import type { IUser } from './interfaces'
import { inject } from 'vue'
import MyInputText from '@/components/MyInputText.vue'

const dialogRef = inject('dialogRef') as any
const user = dialogRef.value.data.user as IUser

const { handleSubmit, errors } = useForm({
    validationSchema: (
        yup.object({
            user_id: yup.number().required().label('ID пользователя'),
            title: yup.string().required().label('Заголовок'),
            text: yup.string().required().label('Тело'),
            push: yup.boolean().label('Пуш-уведомление'),
            email: yup.boolean().label('Электронная почта'),
            phone: yup.boolean().label('SMS')
        }) as any
    ).atLeastOneIsTrueOf([
        {
            key: 'push',
            label: 'Пуш-уведомление'
        },
        {
            key: 'email',
            label: 'Электронная почта'
        },
        {
            key: 'phone',
            label: 'SMS'
        }
    ]),
    initialValues: {
        user_id: user.id,
        push: true
    }
})

const { mutateAsync, isPending } = useSendNotification()

const onSubmit = handleSubmit((vals) => {
    mutateAsync(vals).then(dialogRef.value.close)
})
</script>
