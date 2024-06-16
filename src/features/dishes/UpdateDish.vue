<script setup lang="ts">
import { computed, inject, ref, toRaw, watch } from 'vue'

import { useQuery } from '@tanstack/vue-query'
import { toTypedSchema } from '@vee-validate/yup'
import mime from 'mime-types'
import { useFieldArray, useFieldValue, useForm } from 'vee-validate'
import * as yup from 'yup'
import type { z } from 'zod'

import { axiosPrivate } from '@/common/network'

import DropdownSelect from '@/components/DropdownSelect.vue'
import MyCalendar from '@/components/MyCalendar.vue'
import MyInputNumber from '@/components/MyInputNumber.vue'
import MyInputSwitch from '@/components/MyInputSwitch.vue'
import MyInputText from '@/components/MyInputText.vue'
import MyMultiSelect from '@/components/MyMultiSelect.vue'
import MyUploadImage from '@/components/MyUploadImage.vue'

import { CategoriesQueries } from '@/features/categories'
import { useMods } from '@/features/mods'
import { RestsQueries } from '@/features/restaurants'
import { useTags } from '@/features/tags'

import { useUpdateDish } from './composables'
import { queries as DishesQueries } from './queries'
import * as DishesSchemes from './schemes'

type Entity = z.infer<typeof DishesSchemes.ListedDishScheme>

const dialogRef = inject('dialogRef') as any
const entity = dialogRef.value.data.entity as Entity

const { data: dishData } = useQuery({
    ...DishesQueries.detail({ id: entity.id }),
    select: (v) => ({
        ...v,
        tags: v.tags.map((t) => t.id),
        mod_group: v.mod_group.map((v) => ({
            name: v.name,
            modificators: v.modificators.map((m) => m.id),
            type: v.type
        }))
    })
})

const validationSchema = yup.object({
    id: yup.number().required().label('ID'),
    name: yup.string().required().label('Название'),
    img: yup.string().required().label('Изображение'),
    price: yup.number().required().label('Цена'),
    categories: yup.array().required().label('Категория'),
    belki: yup.number().required().label('Количество белков'),
    pich_cen: yup.number().required().label('Пищевая ценность'),
    energ_cen: yup.number().required().label('Энергетическая ценность'),
    uglevodi: yup.number().required().label('Количество углеводов'),
    ziri: yup.number().required().label('Количество жиров'),
    weight: yup.number().required().label('Вес'),
    count: yup.number().required().label('Количество кусочков'),
    description: yup.string().label('Описание'),
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
    images: yup.array().of(yup.string().required()).default([]).label('Слайдер'),

    make_date: yup.string().label('Год производства'),
    flag: yup.string().label('Флаг страны'),
    malbec: yup.string().label('Сорт винограда'),
    maker: yup.string().label('Страна изготовитель'),

    mod_group: yup.array().of(
        yup.object({
            name: yup.string().required().label('Название группы'),
            modificators: yup.array().required().of(yup.number()).label('Модификаторы'),
            type: yup.string().required()
        })
    ),

    vars: yup.array().of(
        yup.object({
            rest_id: yup.number().required().label('ID ресторана'),
            price: yup.number().required().label('Цена'),
            active: yup.boolean().label('Активно'),
            can_deliver: yup.boolean().label('Можно доставить'),
            can_order: yup.boolean().label('Самовывоз'),
            in_rest: yup.boolean().label('В ресторане'),
            have: yup.boolean().label('В наличии')
        })
    )
})

const { handleSubmit, setFieldValue, resetForm } = useForm({
    validationSchema: toTypedSchema(validationSchema),
    keepValuesOnUnmount: true
})

const aspectRatioOptions = [
    {
        code: 'square',
        label: 'Квадрат',
        value: 1
    },
    {
        code: 'high',
        label: 'Высокий',
        value: 142 / 540
    }
]
const imageAspectRatio = ref(aspectRatioOptions[0])

watch(
    [dishData],
    () => {
        if (dishData.value?.make_date) {
            imageAspectRatio.value = aspectRatioOptions[1]
        }
        const raw = Object.assign({}, toRaw(dishData.value))
        resetForm({
            values: raw
        })
    },
    {
        immediate: true
    }
)

const active = useFieldValue<boolean>('active')
const can_deliver = useFieldValue<boolean>('can_deliver')
const have = useFieldValue<boolean>('have')
const price = useFieldValue<number>('price')
const images = useFieldValue<string[]>('images')

const uploadFiles = (event: any) => {
    const target: HTMLInputElement = event.target
    const links: string[] = []
    for (const file of target.files || []) {
        links.push(URL.createObjectURL(file))
    }
    setFieldValue('images', (images.value || []).concat(links))
}

const deleteImg = (index: number) => {
    const oldImages = images.value
    const newImages = oldImages.filter((_, idx) => idx !== index)
    setFieldValue('images', newImages)
}

const { replace, fields } = useFieldArray<any>('vars')

const { mutate, isPending } = useUpdateDish()

const { data: possibleCategories } = useQuery({
    ...CategoriesQueries.list({ search: '' }),
    select: (r) => r.list.map((v) => ({ label: v.name, code: v.id }))
})

const { data: possibleMods } = useMods({ offset: 0, limit: 999999999, search: '' }, (r) =>
    r.list.map((v) => ({ label: v.name, code: v.id }))
)

const { data: restaurantsData } = useQuery({
    ...RestsQueries.list({ offset: 0, limit: 999999999, search: '' }),
    select: (v) =>
        v.list.map((r) => ({
            rest_id: r.id,
            rest_address: r.adres,
            rest_name: r.name
        }))
})

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
        limit: 999999999,
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
        can_order: boolean
        in_rest: boolean
        have: boolean
        rest_name?: string
        rest_address?: string
    }[]
>([])
watch(
    [restaurantsFieldArray],
    ([value]) => {
        console.log('replacing with', value)
        replace(value.map((v) => ({ ...v })))
    },
    {
        immediate: true
    }
)

watch(
    [restaurantsData, dishData],
    () => {
        if (restaurantsData.value && dishData.value) {
            const copy = dishData.value.vars.map((v) => Object.assign({}, v))
            restaurantsFieldArray.value = copy
        }
    },
    {
        immediate: true
    }
)

interface ModGroupItem {
    name: string
    modificators: number[]
    type: string
}
const {
    fields: fieldsModGroups,
    push: pushModGroup,
    remove: removeModGroup
} = useFieldArray<ModGroupItem>('mod_group')

const onSubmit = handleSubmit(async (vals: any) => {
    // upload object files
    let uploadedPhotos: string[] = []
    const filesToBeUploaded: File[] = []
    for (const photoUrl of vals.images) {
        if (photoUrl.startsWith('blob:')) {
            const blob = await fetch(photoUrl).then((r) => r.blob())
            const file = new File([blob], `img.${mime.extension(blob.type)}`)
            filesToBeUploaded.push(file)
        } else {
            uploadedPhotos.push(photoUrl)
        }
    }

    if (filesToBeUploaded.length) {
        // upload blob files

        const links = await Promise.all(
            filesToBeUploaded.map((file) => {
                const formData = new FormData()
                formData.append('file', file)
                return axiosPrivate.post('admin/upload', formData).then((r) => r.data.link)
            })
        )

        vals.images = links
    }

    vals.modificators = vals.mods
    delete vals.mods

    mutate({
        category: -1,
        ...vals
    })
})
</script>

<template>
    <form class="mt-8" @submit="onSubmit">
        <div class="mb-8 flex justify-center">
            <div class="flex w-full max-w-xs flex-col items-center">
                <div class="mb-4 flex justify-center">
                    <SelectButton
                        v-model="imageAspectRatio"
                        :options="aspectRatioOptions"
                        option-label="label"
                        :allow-empty="false"
                    />
                </div>
                <div
                    :key="imageAspectRatio.code"
                    class="w-full"
                    :style="{
                        aspectRatio: imageAspectRatio.value,
                        maxWidth: imageAspectRatio.code === 'square' ? '20rem' : '6.5rem'
                    }"
                >
                    <MyUploadImage
                        class="rounded-lg"
                        name="img"
                        :aspect-ratio="imageAspectRatio.value"
                        filename-prop-in-request="file"
                        filename-prop-in-response="link"
                        upload-route="admin/upload"
                    />
                </div>
            </div>
        </div>
        <div
            class="mb-8 grid grid-cols-1 items-center justify-items-center gap-x-4 md:grid-cols-2 lg:grid-cols-3"
        >
            <MyInputNumber name="id" label="ID" disabled />
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
        </div>

        <h2 class="section-header">Слайдер</h2>
        <div class="mb-4 overflow-x-auto scroll-smooth">
            <div class="flex items-stretch gap-4">
                <div
                    v-for="(img, idx) in images"
                    :key="img"
                    class="relative h-64 min-w-[10rem] shrink-0"
                >
                    <button
                        class="absolute right-1 top-1 z-40 flex h-6 w-6 items-center justify-center rounded-lg bg-gray-900 shadow-md outline-none transition-shadow focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-1"
                        type="button"
                        @click="deleteImg(idx)"
                    >
                        <i class="pi pi-times block text-[0.75rem] text-white"></i>
                    </button>
                    <img class="h-full w-auto" :src="img" alt="" />
                </div>
            </div>
        </div>
        <div class="mb-8">
            <input type="file" multiple @change="uploadFiles" />
        </div>

        <h2 class="section-header">Наполнение</h2>
        <div class="grid grid-flow-row grid-cols-1 gap-x-4">
            <MyInputText name="short_description" label="Краткое описание" />
            <MyInputText name="description" label="Полное описание" />
            <MyInputText name="content" label="Состав" />
            <MyInputText name="alerg" label="КБЖУ" />
            <MyInputText name="date_contain" label="Срок хранения" />
            <MyInputText name="make_date" label="Год производства" />
            <MyInputText name="flag" label="Флаг страны" />
            <MyInputText name="malbec" label="Сорт винограда" />
            <MyInputText name="maker" label="Страна изготовитель" />
            <DropdownSelect
                name="cert"
                label="Сертификация"
                placeholder="Выберите"
                :options="[
                    {
                        code: 'eco',
                        label: 'Eco'
                    },
                    {
                        code: 'org',
                        label: 'Org'
                    },
                    {
                        code: 'bio',
                        label: 'Bio'
                    }
                ]"
            />
        </div>

        <h2 class="section-header">SEO</h2>
        <div class="mb-6 grid grid-flow-row grid-cols-1 gap-x-4 md:grid-cols-2">
            <MyInputText name="alt" label="Альтернативный текст" />
            <MyInputText name="link" label="Ссылка" />
            <MyInputText name="description_seo" label="Описание" />
            <MyInputText name="title" label="Title" />
            <MyInputText class="col-span-full" name="keywords" label="Ключевые слова" />
        </div>

        <h2 class="section-header">Время показа</h2>
        <div class="mb-8">
            <MyCalendar class="w-full" label="Время начала" name="from_hour" time-only />
            <MyCalendar class="w-full" label="Время окончания" name="to_hour" time-only />
        </div>

        <div class="mb-8 flex flex-col gap-2">
            <MyInputSwitch label="В наличии" :name="`have`" />
            <MyInputSwitch label="Можно доставить" :name="`can_deliver`" />
            <MyInputSwitch label="Активно" :name="`active`" />
        </div>

        <h2 class="section-header">Модификаторы</h2>
        <div class="mb-8">
            <fieldset
                v-for="(field, idx) in fieldsModGroups"
                :key="field.key"
                class="relative mb-2 flex flex-col gap-4 rounded-lg border-2 border-gray-200 p-4"
            >
                <button class="absolute right-2 top-2" type="button" @click="removeModGroup(idx)">
                    <i class="pi pi-times-circle" style="font-size: 1rem"></i>
                </button>
                <div class="w-full">
                    <label class="text-900 mb-2 block font-medium">Название группы</label>
                    <InputText v-model="field.value.name" class="w-full" />
                </div>

                <div class="w-full">
                    <label class="text-900 mb-2 block font-medium">Тип</label>
                    <Dropdown
                        v-model="field.value.type"
                        class="w-full"
                        option-value="code"
                        option-label="label"
                        :options="[
                            {
                                code: 'options',
                                label: 'Опции'
                            },
                            {
                                code: 'additions',
                                label: 'Добавки'
                            }
                        ]"
                    />
                </div>
                <div class="w-full">
                    <label class="text-900 mb-2 block font-medium">Модификаторы</label>
                    <MultiSelect
                        v-model="field.value.modificators"
                        class="w-full"
                        :options="possibleMods"
                        option-value="code"
                        option-label="label"
                    />
                </div>
            </fieldset>
            <button
                class="group flex w-full items-center gap-4"
                @click="pushModGroup({ name: '', modificators: [], type: 'options' })"
            >
                <div class="grow border-b-2"></div>
                <span class="flex items-center gap-2">
                    <i
                        class="pi pi-plus transition-transform group-hover:rotate-90"
                        style="font-size: 0.8em"
                    ></i>
                    Добавить группу
                </span>
                <div class="grow border-b-2"></div>
            </button>
        </div>

        <h2 class="section-header">По ресторанам</h2>
        <MultiSelect
            v-model="restaurantsFieldArray"
            class="mb-8 w-full"
            display="chip"
            :options="restaurantsOptions"
            option-label="rest_name"
            data-key="rest_id"
            placeholder="Выберите рестораны"
        />
        <div class="mb-8">
            <fieldset
                v-for="(field, idx) in fields"
                :key="field.key"
                class="relative mb-4 rounded-lg border-2 border-gray-200 p-4"
            >
                <h3
                    class="absolute top-0 -translate-y-1/2 bg-white px-3 font-semibold text-pv-text-color"
                >
                    "{{ field.value.rest_name }}"
                    <template v-if="field.value.rest_address">
                        - {{ field.value.rest_address }}
                    </template>
                </h3>
                <div class="grid grid-cols-1 gap-x-2 md:grid-cols-2">
                    <MyInputNumber
                        class="flex-1"
                        :name="`vars[${idx}].rest_id`"
                        :initial-value="field.value.rest_id"
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
                <div class="grid grid-cols-1 gap-2 md:grid-cols-2 lg:grid-cols-3">
                    <MyInputSwitch label="В наличии" :name="`vars[${idx}].have`" />
                    <MyInputSwitch label="Можно доставить" :name="`vars[${idx}].can_deliver`" />
                    <MyInputSwitch label="Активно" :name="`vars[${idx}].active`" />
                    <MyInputSwitch label="Самовывоз" :name="`vars[${idx}].can_order`" />
                    <MyInputSwitch label="В ресторане" :name="`vars[${idx}].in_rest`" />
                </div>
            </fieldset>
        </div>

        <Button
            class="mt-8 flex w-full items-center p-4"
            type="submit"
            label="Сохранить"
            :loading="isPending"
            :disabled="isPending"
        />
    </form>
</template>
