<template>
    <form @submit.prevent="onSubmit">
        <h1 class="mb-6 text-xl font-bold">Акция</h1>

        <DropdownSelect name="promo" :options="types" label="Тип" />

        <DropdownSelect
            v-if="promo === 'dish'"
            name="dish_id"
            :options="dishesOptions || []"
            label="Блюдо"
        />

        <MyInputNumber
            v-if="promo === 'sum'"
            name="sum"
            label="Минимальная сумма заказа"
            mode="currency"
            currency="RUB"
        />
        <MyInputNumber v-if="promo === 'dish'" name="count" label="Количество" />

        <DropdownSelect
            v-if="promo"
            name="gift_id"
            :options="dishesOptions || []"
            label="Подарок"
        />

        <Button label="Сохранить" class="mt-4 w-full" type="submit" :disabled="isLoading" />
    </form>
</template>

<script setup lang="ts">
import DropdownSelect from '@/components/DropdownSelect.vue'
import MyInputNumber from '@/components/MyInputNumber.vue'
import { axiosPrivate } from '@/network'
import yup from '@/yup'
import { useMutation, useQuery, useQueryClient } from '@tanstack/vue-query'
import { useToast } from 'primevue/usetoast'
import { useFieldValue, useForm } from 'vee-validate'

const types = [
    {
        label: 'В зависимости от блюда',
        code: 'dish'
    },
    {
        label: 'В зависимости от суммы заказа',
        code: 'sum'
    }
]

const { data: dishesOptions } = useQuery({
    queryKey: ['short-dishes'],
    queryFn: async () => {
        const response = await axiosPrivate.get('admin/dishes/rec')
        return response.data
    },
    select: (v) => v.map((d) => ({ code: d.id, label: `[id: ${d.id}]: ${d.name}` })),
    enabled: false
})

const { data } = useQuery({
    queryKey: ['settings'],
    queryFn: async () => {
        const response = await axiosPrivate.get('admin/settings')
        return response.data
    },
    select: (vals) => {
        const promo = vals.promo
        if (promo.promo === '') {
            return undefined
        }
        return promo
    },
    enabled: false
})

const { handleSubmit } = useForm({
    validationSchema: yup.object({
        promo: yup.string().oneOf(['dish', 'sum']).label('Тип'),
        dish_id: yup
            .number()
            .label('Блюдо')
            .when('promo', {
                is: 'dish',
                then: (schema) => schema.required()
            }),
        gift_id: yup
            .number()
            .label('Подарок')
            .when('promo', {
                is: (v) => v === 'dish' || v === 'sum',
                then: (schema) => schema.required()
            }),
        sum: yup
            .number()
            .label('Минимальная сумма заказа')
            .when('promo', {
                is: 'sum',
                then: (schema) => schema.required()
            }),
        count: yup
            .number()
            .label('Количество')
            .when('promo', {
                is: 'dish',
                then: (schema) => schema.required()
            })
    }),
    keepValuesOnUnmount: true,
    initialValues: data
})

const promo = useFieldValue('promo')

const toast = useToast()
const queryClient = useQueryClient()

const { mutate: mutate, isLoading } = useMutation({
    mutationFn: (vars: any) => axiosPrivate.put('admin/settings', vars),
    onSuccess: () => {
        toast.add({
            summary: 'Настройки акции обновлены',
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

const onSubmit = handleSubmit((vals) => {
    if (vals.promo) {
        mutate({
            promo: vals
        })
    } else {
        mutate({
            promo: {
                promo: ''
            }
        })
    }
})
</script>
