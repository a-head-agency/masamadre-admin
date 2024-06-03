<template>
    <form @submit.prevent="onSubmit">
        <MyInputNumber name="id" label="ID" disabled />
        <MyInputText name="name" label="Название" />
        <MyInputSwitch class="mb-5" name="show_title" label="Показывать название категории" />

        <MyInputText name="subtitle" label="Подкатегория" />

        <DropdownSelect
            name="active"
            label="Активно"
            :options="[
                {
                    label: 'Не активна',
                    code: false
                },
                {
                    label: 'Активна',
                    code: true
                }
            ]"
        >
            <template #value="slotProps">
                <CategoryStatusBadge :code="slotProps.value.code" />
            </template>
            <template #option="slotProps">
                <CategoryStatusBadge :code="slotProps.option.code" />
            </template>
        </DropdownSelect>
        <DropdownSelect
            name="type"
            label="Тип отображения"
            :options="[
                {
                    label: 'Обычная сетка',
                    code: 0
                },
                {
                    label: 'Горизонтальный слайдер',
                    code: 1
                },
                {
                    label: 'Колонки',
                    code: 2
                }
            ]"
        >
            <template #value="slotProps">
                <CategoryTypeBadge :code="slotProps.value.code" />
            </template>
            <template #option="slotProps">
                <CategoryTypeBadge :code="slotProps.option.code" />
            </template>
        </DropdownSelect>

        <h2 class="section-header">SEO</h2>
        <div class="grid grid-flow-row grid-cols-1 gap-x-4">
            <MyInputText name="link" label="Ссылка" />
            <MyInputText name="keywords" label="Ключевые слова" />
            <MyInputText name="description_seo" label="Описание" />
            <MyInputText name="title" label="Title" />
        </div>

        <Button
            class="mt-4 flex w-full items-center"
            type="submit"
            label="Сохранить"
            :loading="isPending"
            :disabled="isPending"
        />
    </form>
</template>

<script setup lang="ts">
import { inject } from 'vue'
import MyInputNumber from '@/components/MyInputNumber.vue'
import MyInputText from '@/components/MyInputText.vue'
import DropdownSelect from '@/components/DropdownSelect.vue'
import { useForm } from 'vee-validate'
import * as yup from 'yup'
import { useUpdateCategory } from './composables'
import { CategoryStatusBadge, CategoryTypeBadge } from '.'
import MyInputSwitch from '@/components/MyInputSwitch.vue'
import { z } from 'zod'
import type { ListedCategoryScheme } from './schemes'

type Entity = z.infer<typeof ListedCategoryScheme>

const dialogRef = inject('dialogRef') as any
const entity = dialogRef.value.data.entity as Entity

const { handleSubmit } = useForm({
    validationSchema: yup.object({
        id: yup.number().required().label('ID категории'),
        name: yup.string().required().label('Название категории'),
        active: yup.boolean().required().label('Активно'),
        link: yup.string().required().label('Ссылка'),
        keywords: yup.string().label('Ключевые слова'),
        description_seo: yup.string().label('Описание'),
        title: yup.string().label('Title'),
        subtitle: yup.string().label('Подкатегория'),
        type: yup.number().required().label('Тип категории'),
        show_title: yup.boolean().required().label('Показывать название категории')
    }),
    initialValues: {
        id: entity.id,
        name: entity.name,
        active: entity.active,
        link: entity.link,
        keywords: entity.keywords,
        description_seo: entity.description_seo,
        title: entity.title,
        type: entity.type,
        show_title: entity.show_title,
        subtitle: entity.subtitle
    }
})

const { mutate, isPending } = useUpdateCategory()

const onSubmit = handleSubmit((vals) => {
    mutate(vals)
})
</script>
