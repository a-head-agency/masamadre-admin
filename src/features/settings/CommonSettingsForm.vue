<template>
    <form @submit="onSubmitCommonSettings">
        <h1 class="mb-6 text-xl font-bold">Общие настройки</h1>
        <div class="flex flex-col lg:flex-row lg:gap-8">
            <div class="flex-1">
                <MyInputNumber
                    name="from_delivery"
                    label="Бесплатная доставки при заказе от..."
                    mode="currency"
                    currency="RUB"
                />
                <MyInputNumber
                    name="deliver_price"
                    label="Цена доставки"
                    mode="currency"
                    currency="RUB"
                />
                <MyInputText name="time_deliver" label="Время доставки" />
                <MyInputNumber
                    name="min_price"
                    label="Минимальная сумма заказа"
                    mode="currency"
                    currency="RUB"
                />
            </div>

            <div class="flex-1">
                <MyInputText name="phone" label="Телефон" />
            </div>
        </div>

        <MyInputText name="title" label="Title" />
        <MyInputText name="description" label="Описание" />
        <MyInputText name="keywords" label="Ключевые слова" />

        <MyEditor label="Время работы" name="time_work" />

        <Button label="Обновить настройки" class="mt-4 w-full" type="submit" />
    </form>
</template>

<script setup lang="ts">
import * as yup from 'yup'
import { useQuery, useMutation, useQueryClient } from '@tanstack/vue-query'
import { useToast } from 'primevue/usetoast'
import { axiosPrivate } from '@/network'
import { useForm } from 'vee-validate'

import MyInputText from '@/components/MyInputText.vue'
import MyInputNumber from '@/components/MyInputNumber.vue'
import MyEditor from '@/components/MyEditor.vue'

const toast = useToast()
const queryClient = useQueryClient()

const { data } = useQuery({
    queryKey: ['settings'],
    queryFn: async () => {
        const response = await axiosPrivate.get('admin/settings')
        return response.data
    }
})

const { handleSubmit } = useForm({
    validationSchema: yup.object({
        from_delivery: yup
            .number()
            .required()
            .label('Сумма, начиная с которой доставка бесплатная'),
        deliver_price: yup.number().required().label('Цена доставки'),
        time_deliver: yup.string().required().label('Время доставки'),
        min_price: yup.number().required().label('Минимальная сумма заказа'),
        phone: yup.string().min(11).required().label('Номер телефона'),

        title: yup.string().label('Title'),
        description: yup.string().label('Описание'),
        keywords: yup.string().label('Ключевые слова'),
        time_work: yup.string().required().label('Время работы')
    }),
    initialValues: data
})

const { mutate: mutate } = useMutation({
    mutationFn: (vars: any) => axiosPrivate.put('admin/settings', vars),
    onSuccess: () => {
        toast.add({
            summary: 'Настройки обновлены',
            severity: 'success',
            life: 3000
        })
        queryClient.invalidateQueries({ queryKey: ['settings'] })
    },
    onError: (error) => {
        toast.add({
            summary: 'Ошибка',
            detail: error,
            life: 3000
        })
    }
})

const onSubmitCommonSettings = handleSubmit((vals) => {
    mutate(vals)
})
</script>
