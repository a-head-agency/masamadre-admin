<template>
    <form @submit="onSubmit">
        <h1 class="mb-6 text-xl font-bold">Разослать уведомления</h1>
        <MyInputText name="title" label="Заголовок" />

        <MyInputText name="text" label="Текст" />

        <small class="p-error mb-3 block">{{ errors[''] || '&nbsp;' }}</small>
        <MyInputSwitch name="push" label="Пуш" :initial-value="true" />
        <MyInputSwitch name="email" label="Электронная почта" />
        <MyInputSwitch name="phone" label="SMS" />

        <Button
            class="mt-8 flex w-full items-center p-4"
            type="submit"
            label="Отправить"
            :loading="isLoading"
            :disabled="isLoading"
        />
    </form>
</template>

<script setup lang="ts">
import MyInputText from '@/components/MyInputText.vue'
import MyInputSwitch from '@/components/MyInputSwitch.vue'
import { useForm } from 'vee-validate'
import yup from '@/yup'
import { useSendNotification } from '@/features/users'

const { handleSubmit, errors } = useForm({
    validationSchema: (
        yup.object({
            title: yup.string().required().label('Заголовок'),
            text: yup.string().required().label('Тело'),
            push: yup.boolean().label('Пуш-уведомление'),
            email: yup.boolean().label('Электронная почта'),
            phone: yup.boolean().label('SMS')
        }) as any
    ).atLeastOneIsTrueOf(['push', 'email', 'phone'])
})

const { mutate, isLoading } = useSendNotification()

const onSubmit = handleSubmit((vals) => {
    mutate(vals)
})
</script>
