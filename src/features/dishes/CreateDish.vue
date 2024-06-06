<template>
    <form class="mt-8" @submit="onSubmit">
        <div class="mb-8 flex justify-center">
            <div class="flex w-full max-w-xs flex-col items-center">
                <div class="mb-4 flex justify-center">
                    <SelectButton
                        :options="aspectRatioOptions"
                        v-model="imageAspectRatio"
                        option-label="label"
                        :allow-empty="false"
                    />
                </div>

                <div
                    class="w-full"
                    :style="{
                        aspectRatio: imageAspectRatio.value,
                        height: imageAspectRatio.code === 'square' ? '20rem' : '25rem'
                    }"
                    :key="imageAspectRatio.code"
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


            <MyInputNumber name="max_modes" label="Максимальное количество модификаторов"/>
            <MyMultiSelect
                class="w-full"
                name="mods"
                placeholder="Выберите"
                label="Модификаторы"
                :options="possibleMods || []"
            />
        </div>

        <h2 class="section-header">Слайдер</h2>
        <div class="mb-4 overflow-x-auto scroll-smooth">
            <div class="flex items-stretch gap-4">
                <div
                    class="relative h-64 min-w-[10rem] shrink-0"
                    v-for="(img, idx) in images"
                    :key="img"
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
            <input type="file" @change="uploadFiles" multiple />
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
        <div class="mb-6 grid grid-flow-row grid-cols-2 gap-x-4">
            <MyInputText name="alt" label="Альтернативный текст" />
            <MyInputText name="link" label="Ссылка" />
            <MyInputText name="description_seo" label="Описание" />
            <MyInputText name="title" label="Title" />
            <MyInputText class="col-span-full" name="keywords" label="Ключевые слова" />
        </div>

        <h2 class="section-header">Время показа</h2>
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

        <h2 class="section-header">По ресторанам</h2>
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
                <h3
                    class="absolute top-0 -translate-y-1/2 bg-white px-3 font-semibold text-pv-text-color"
                >
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
            label="Создать"
            :loading="isPending"
            :disabled="isPending"
        />
    </form>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import MyUploadImage from '@/components/MyUploadImage.vue'
import { useFieldArray, useFieldValue, useForm } from 'vee-validate'
import * as yup from 'yup'
import mime from 'mime-types'

import MyInputText from '@/components/MyInputText.vue'
import MyInputNumber from '@/components/MyInputNumber.vue'
import MyInputSwitch from '@/components/MyInputSwitch.vue'
import DropdownSelect from '@/components/DropdownSelect.vue'

import { CategoriesQueries } from '@/features/categories'
import { useCreateDish } from './composables'
import { RestsQueries } from '@/features/restaurants'
import { useTags } from '@/features/tags'
import MyMultiSelect from '@/components/MyMultiSelect.vue'
import MyCalendar from '@/components/MyCalendar.vue'
import { axiosPrivate } from '@/network'
import { useMods } from '@/features/mods'
import { useQuery } from '@tanstack/vue-query'

const { handleSubmit, setFieldValue } = useForm<any>({
    validationSchema: yup.object({
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
        rkeeper_id: yup.string().required().label('RKeeper ID'),
        tags: yup.array().label('Теги'),
        mods: yup.array().label('Модификаторы'),
        active: yup.boolean().label('Активно'),
        can_deliver: yup.boolean().label('Можно доставить'),
        have: yup.boolean().label('В наличии'),
        from_hour: yup.number().required().label('Доступно С'),
        to_hour: yup.number().required().label('Доступно ДО'),
        link: yup.string().required().label('Ссылка'),
        keywords: yup.string().label('Ключевые слова'),
        description_seo: yup.string().label('Описание'),
        title: yup.string().required().label('Title'),
        images: yup.array().of(yup.string()).label('Слайдер'),

        short_description: yup.string().required().label('Краткое описание'),
        description: yup.string().required().label('Полное описание'),
        content: yup.string().required().label('Состав'),
        alerg: yup.string().required().label('КБЖУ'),
        date_contain: yup.string().required().label('Срок хранения'),
        make_date: yup.string().label('Год производства'),
        flag: yup.string().label('Флаг страны'),
        malbec: yup.string().label('Сорт винограда'),
        maker: yup.string().label('Страна изготовитель'),

        max_modes: yup.number().required().label('Максимальное количество модификаторов'),

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
    }),
    initialValues: {
        from_hour: 600,
        to_hour: 2200
    },
    keepValuesOnUnmount: true
})

const active = useFieldValue<boolean>('active')
const can_deliver = useFieldValue<boolean>('can_deliver')
const have = useFieldValue<boolean>('have')
const price = useFieldValue<number>('price')
const images = useFieldValue<string[]>('images')

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

const uploadFiles = (event: any) => {
    const target: HTMLInputElement = event.target
    const links: string[] = []
    for (const file of target.files || []) {
        links.push(URL.createObjectURL(file))
    }
    setFieldValue('images', links)
}

const deleteImg = (index: number) => {
    const oldImages = images.value
    const newImages = oldImages.filter((_, idx) => idx !== index)
    setFieldValue('images', newImages)
}

const { replace, fields } = useFieldArray<any>('vars')

const { mutate, isPending } = useCreateDish()

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

const onSubmit = handleSubmit(async (vals) => {
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
