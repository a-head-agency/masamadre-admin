<template>
    <form class="mt-8" @submit="onSubmit">
        <div class="mb-8 grid grid-cols-3 items-center justify-items-center gap-4">
            <MyInputText label="Название" name="name" />
            <MyInputNumber label="Вес" name="weight" />
            <MyInputNumber label="Цена" name="price" mode="currency" currency="RUB" />
            <MyInputNumber label="Количество" name="count" />

            <div class="col-span-1 col-start-1 row-span-2 row-start-1 w-full">
                <MyUploadImage
                    class="rounded-lg"
                    name="img"
                    :aspect-ratio="4 / 3"
                    filename-prop-in-request="file"
                    filename-prop-in-response="link"
                    upload-route="admin/upload"
                />
            </div>
        </div>

        <div class="mb-8 flex flex-wrap items-center justify-center gap-12">
            <MyInputSwitch label="В наличии" :name="`have`" />
            <MyInputSwitch label="Можно доставить" :name="`can_deliver`" />
            <MyInputSwitch label="Активно" :name="`active`" />
        </div>

        <h2 class="mb-6 text-lg font-bold">По ресторанам</h2>
        <MultiSelect
            class="mb-8 w-full"
            display="chip"
            v-model="restaurantsFieldArray"
            :options="restaurantsOptions"
            optionLabel="rest_name"
            data-key="rest_id"
            placeholder="Выберите рестораны"
        />
        <div class="mb-8">
            <fieldset
                v-for="(field, idx) in fields"
                :key="field.key"
                class="relative mb-4 rounded-lg border-2 border-gray-200 p-4"
            >
                <h3 class="absolute top-0 -translate-y-1/2 bg-white px-3 font-semibold">
                    "{{ field.value.rest_name }}" - {{ field.value.rest_address }}
                </h3>
                <div class="flex gap-4">
                    <MyInputNumber
                        class="flex-1"
                        :name="`vars[${idx}].rest_id`"
                        disabled
                        label="ID ресторана"
                    />
                    <MyInputNumber
                        class="flex-1"
                        :name="`vars[${idx}].price`"
                        label="Цена"
                        mode="currency"
                        currency="RUB"
                    />
                </div>
                <div class="flex flex-wrap items-center justify-center gap-12">
                    <MyInputSwitch label="В наличии" :name="`vars[${idx}].have`" />
                    <MyInputSwitch label="Можно доставить" :name="`vars[${idx}].can_deliver`" />
                    <MyInputSwitch label="Активно" :name="`vars[${idx}].active`" />
                </div>
            </fieldset>
        </div>

        <Button
            class="mt-8 flex w-full items-center p-4"
            type="submit"
            label="Создать"
            :loading="isLoading"
            :disabled="isLoading"
        />
    </form>
</template>

<script setup lang="ts">
import MyUploadImage from '@/components/MyUploadImage.vue'
import { useFieldArray, useFieldValue, useForm } from 'vee-validate'
import * as yup from 'yup'

import MyInputText from '@/components/MyInputText.vue'
import MyInputNumber from '@/components/MyInputNumber.vue'
import MyInputSwitch from '@/components/MyInputSwitch.vue'
import { useCreateAddition } from './composables'
import { useRestaurants } from '@/features/restaurants'
import { computed, ref, watch } from 'vue'

const { handleSubmit } = useForm({
    validationSchema: yup.object({
        name: yup.string().required().label('Название'),
        img: yup.string().required().label('Изображение'),
        price: yup.number().required().label('Цена'),
        weight: yup.number().required().label('Вес'),
        count: yup.number().required().label('Количество кусочков'),
        active: yup.boolean().label('Активно'),
        can_deliver: yup.boolean().label('Можно доставить'),
        have: yup.boolean().label('В наличии'),
        vars: yup.array().of(
            yup.object({
                rest_id: yup.number().required().label('ID ресторана'),
                price: yup.number().required().label('Цена'),
                active: yup.boolean().label('Активно'),
                can_deliver: yup.boolean().label('Можно доставить'),
                have: yup.boolean().label('В наличии')
            })
        )
    })
})

const active = useFieldValue<boolean>('active')
const can_deliver = useFieldValue<boolean>('can_deliver')
const have = useFieldValue<boolean>('have')
const price = useFieldValue<number>('price')

const { replace, fields } = useFieldArray<any>('vars')

const { data: restaurantsData } = useRestaurants(
    {
        offset: 0,
        limit: 99999999,
        search: ''
    },
    (resp) => {
        return resp.list.map((r) => ({
            rest_id: r.id,
            rest_address: r.adres,
            rest_name: r.name
        }))
    }
)

const restaurantsOptions = computed(() => {
    return (
        restaurantsData.value?.map((v) => ({
            ...v,
            active: active.value,
            can_deliver: can_deliver.value,
            have: have.value,
            price: price.value
        })) || []
    )
})

const restaurantsFieldArray = ref<
    {
        rest_id: number
        price: number
        active: boolean
        can_deliver: boolean
        have: boolean
        rest_name: string
        rest_address: string
    }[]
>([])
watch(
    [restaurantsFieldArray],
    ([value]) => {
        replace(value.map((v) => ({ ...v })))
    },
    {
        immediate: true
    }
)

const { mutate, isLoading } = useCreateAddition()

const onSubmit = handleSubmit((vals) => {
    mutate(vals)
})
</script>
