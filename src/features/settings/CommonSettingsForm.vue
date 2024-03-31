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
                <MyInputNumber name="bonus_percent" label="Процент бонусов" />
                <MyInputText name="instagram" label="Instagram" />
            </div>

            <div class="flex-1">
                <MyInputText name="vk" label="VK" />
                <MyInputText name="whatsapp" label="WhatsApp" />
                <MyInputText name="viber" label="Viber" />
                <MyInputText name="youtube" label="YouTube" />
                <MyInputText name="phone" label="Телефон" />
                <MyInputText name="email" label="Email" />
            </div>
        </div>
        <MyMultiSelect
            placeholder="Выберите"
            label="Важные теги"
            name="tags"
            :options="tagsOptions || []"
            :max-selected-labels="3"
        />

        <MyInputText name="title" label="Title" />
        <MyInputText name="description" label="Описание" />
        <MyInputText name="keywords" label="Ключевые слова" />

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
import MyMultiSelect from '@/components/MyMultiSelect.vue'
import { useTags } from '@/features/tags'

const toast = useToast()
const queryClient = useQueryClient()

const { data: tagsOptions } = useTags(
    {
        limit: 99999999,
        offset: 0,
        search: ''
    },
    (v) => v.list.map((t) => ({ code: t.id, label: `[id: ${t.id}]: ${t.name}` }))
)

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
        bonus_percent: yup.number().required().label('Процент бонусов от суммы заказа'),
        instagram: yup.string().label('Ссылка на Instagram'),
        vk: yup.string().label('Ссылка на ВК'),
        whatsapp: yup.string().label('Номер WhatsApp'),
        viber: yup.string().label('Номер Viber'),
        youtube: yup.string().label('Ссылка на YouTube'),
        phone: yup.string().required().label('Номер телефона'),
        email: yup.string().required().label('Электронная почта'),
        tags: yup.array().of(yup.number()).required().label('Важные теги'),

        title: yup.string().required().label('Title'),
        description: yup.string().label('Описание'),
        keywords: yup.string().label('Ключевые слова')
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
        queryClient.invalidateQueries(['settings'])
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
