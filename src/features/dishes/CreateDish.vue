<template>
    <form class="mt-8" @submit="onSubmit">
        <div class="mb-8 grid grid-cols-3 items-center justify-items-center gap-4">
            <MyInputText name="name" label="Название" />
            <MyInputText label="RKeeper ID" name="rkeeper_id" />
            <MyInputNumber label="Вес" name="weight" />
            <MyInputNumber label="Количество кусочков" name="count" />
            <MyInputNumber label="Цена" name="price" />
            <MyInputNumber
                label="Пищевая ценность"
                name="pich_cen"
                :min-fraction-digits="0"
                :max-fraction-digits="2"
            />
            <MyInputNumber
                label="Энергетическая ценность"
                name="energ_cen"
                :min-fraction-digits="0"
                :max-fraction-digits="2"
            />
            <MyInputNumber label="Белки" name="belki" />
            <MyInputNumber label="Жиры" name="ziri" />
            <MyInputNumber label="Углеводы" name="uglevodi" />

            <DropdownSelect
                class="w-full"
                name="color"
                label="Цвет карточки"
                placeholder="Выберите"
                :options="possibleCardColors"
            >
                <template #option="slotProps">
                    <div class="flex items-center gap-4">
                        <div
                            class="aspect-square h-6 rounded-md border-2 border-gray-500"
                            :style="{ backgroundColor: slotProps.option.label }"
                        ></div>
                        <span>{{ slotProps.option.label }}</span>
                    </div>
                </template>
                <template #value="slotProps">
                    <div v-if="slotProps.value" class="flex items-center gap-4">
                        <div
                            class="aspect-square h-6 rounded-md border-2 border-gray-500"
                            :style="{ backgroundColor: slotProps.value.label }"
                        ></div>
                        <span>{{ slotProps.value.label }}</span>
                    </div>
                    <span v-else>Выберите</span>
                </template>
            </DropdownSelect>

            <DropdownSelect
                class="w-full"
                name="size"
                label="Размер карточки"
                placeholder="Выберите"
                :options="[
                    {
                        label: 'Маленький',
                        code: 1
                    },
                    {
                        label: 'Большой',
                        code: 2
                    }
                ]"
            ></DropdownSelect>

            <MyMultiSelect
                class="w-full"
                name="categories"
                label="Категории"
                placeholder="Выберите"
                :options="possibleCategories || []"
            />

            <MyMultiSelect
                class="w-full"
                name="tags"
                placeholder="Выберите"
                label="Теги"
                :options="possibleTags || []"
            />

            <div class="col-span-1 col-start-1 row-span-2 row-start-1 w-full">
                <MyUploadImage
                    class="rounded-lg"
                    name="img"
                    :aspect-ratio="1"
                    filename-prop-in-request="file"
                    filename-prop-in-response="link"
                    upload-route="admin/upload"
                />
            </div>
        </div>

        <h2 class="mb-6 text-lg font-bold">Наполнение</h2>
        <div class="grid grid-flow-row grid-cols-1 gap-x-4">
            <MyInputText name="short_description" label="Краткое описание" />
            <MyInputText name="description" label="Полное описание" />
            <MyInputText name="content" label="Состав" />
            <MyInputText name="alerg" label="Аллергены" />
            <MyInputText name="date_contain" label="Срок хранения" />
        </div>

        <h2 class="mb-6 text-lg font-bold">SEO</h2>
        <div class="mb-6 grid grid-flow-row grid-cols-2 gap-x-4">
            <MyInputText name="alt" label="Альтернативный текст" />
            <MyInputText name="link" label="Ссылка" />
            <MyInputText name="description_seo" label="Описание" />
            <MyInputText name="title" label="Title" />
            <MyInputText class="col-span-full" name="keywords" label="Ключевые слова" />
        </div>

        <h2 class="mb-6 text-lg font-bold">Время показа</h2>
        <div class="mb-8 flex items-center justify-center gap-8">
            <MyCalendar name="from_hour" time-only />
            <div class="h-px w-8 bg-black"></div>
            <MyCalendar name="to_hour" time-only />
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
import { computed, ref, watch } from 'vue'
import MyUploadImage from '@/components/MyUploadImage.vue'
import { useFieldArray, useFieldValue, useForm } from 'vee-validate'
import * as yup from 'yup'

import DropdownSelect from '@/components/DropdownSelect.vue'
import MyInputText from '@/components/MyInputText.vue'
import MyInputNumber from '@/components/MyInputNumber.vue'
import MyInputSwitch from '@/components/MyInputSwitch.vue'

import { useCategories } from '@/features/categories'
import { useCreateDish } from './composables'
import { useRestaurants } from '@/features/restaurants'
import { useTags } from '../tags'
import MyMultiSelect from '@/components/MyMultiSelect.vue'
import MyCalendar from '@/components/MyCalendar.vue'

const possibleCardColors = ref([
    { label: '#FAFAFA', code: 1 },
    { label: '#FADEC3', code: 2 },
    { label: '#E6F0F8', code: 3 },
    { label: '#F0EDBA', code: 4 },
    { label: '#FEEDB1', code: 5 }
])

const { handleSubmit } = useForm({
    validationSchema: yup.object({
        name: yup.string().required().label('Название'),
        img: yup.string().required().label('Изображение'),
        price: yup.number().required().label('Цена'),
        categories: yup.array().required().label('Категория'),
        color: yup.string().required().label('Цвет карточки'),
        belki: yup.number().required().label('Количество белков'),
        pich_cen: yup.number().required().label('Пищевая ценность'),
        energ_cen: yup.number().required().label('Энергетическая ценность'),
        uglevodi: yup.number().required().label('Количество углеводов'),
        ziri: yup.number().required().label('Количество жиров'),
        weight: yup.number().required().label('Вес'),
        count: yup.number().required().label('Количество кусочков'),
        size: yup.number().required().label('Размер карточки'),
        rkeeper_id: yup.string().required().label('RKeeper ID'),
        tags: yup.array().label('Теги'),
        active: yup.boolean().label('Активно'),
        can_deliver: yup.boolean().label('Можно доставить'),
        have: yup.boolean().label('В наличии'),
        from_hour: yup.number().required().label('Доступно С'),
        to_hour: yup.number().required().label('Доступно ДО'),
        link: yup.string().required().label('Ссылка'),
        keywords: yup.string().label('Ключевые слова'),
        description_seo: yup.string().label('Описание'),
        title: yup.string().label('Title'),

        short_description: yup.string().required().label('Краткое описание'),
        description: yup.string().required().label('Полное описание'),
        content: yup.string().required().label('Состав'),
        alerg: yup.string().required().label('Аллергены'),
        date_contain: yup.string().required().label('Срок хранения'),

        vars: yup.array().of(
            yup.object({
                rest_id: yup.number().required().label('ID ресторана'),
                price: yup.number().required().label('Цена'),
                active: yup.boolean().label('Активно'),
                can_deliver: yup.boolean().label('Можно доставить'),
                have: yup.boolean().label('В наличии')
            })
        )
    }),
    initialValues: {
        from_hour: 600,
        to_hour: 2200
    }
})

const active = useFieldValue<boolean>('active')
const can_deliver = useFieldValue<boolean>('can_deliver')
const have = useFieldValue<boolean>('have')
const price = useFieldValue<number>('price')

const { replace, fields } = useFieldArray<any>('vars')

const { mutate, isLoading } = useCreateDish()

const { data: possibleCategories } = useCategories({ offset: 0, limit: 9999999, search: '' }, (r) =>
    r.list.map((v) => ({ label: v.name, code: v.id }))
)
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

const { data: possibleTags } = useTags(
    {
        offset: 0,
        limit: 99999999,
        search: ''
    },
    (r) => r.list.map((v) => ({ label: v.name, code: v.id }))
)

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

const onSubmit = handleSubmit((vals) => {
    mutate({
        category: -1,
        ...vals
    })
})
</script>
