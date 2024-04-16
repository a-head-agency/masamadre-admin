<template>
    <form class="w-full" @submit.prevent="onSubmit">
        <div class="mb-6">
            <MyInputText name="name" label="Название" />
            <MyInputSwitch name="show_title" label="Показывать название категории" />

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
        </div>

        <h2 class="mb-6 text-lg font-bold">SEO</h2>
        <div class="grid grid-flow-row grid-cols-1 gap-x-4">
            <MyInputText name="link" label="Ссылка" />
            <MyInputText name="keywords" label="Ключевые слова" />
            <MyInputText name="description_seo" label="Описание" />
            <MyInputText name="title" label="Title" />
        </div>

        <Button
            class="mt-4 flex w-full items-center"
            type="submit"
            label="Создать"
            :loading="isLoading"
            :disabled="isLoading"
        />
    </form>
</template>

<script setup lang="ts">
import MyInputText from '@/components/MyInputText.vue'
import { useForm } from 'vee-validate'
import * as yup from 'yup'
import { useCreateCategory } from './composables'
import DropdownSelect from '@/components/DropdownSelect.vue'
import { CategoryTypeBadge, CategoryStatusBadge } from '.'
import MyInputSwitch from '@/components/MyInputSwitch.vue'

const { handleSubmit } = useForm({
    validationSchema: yup.object({
        name: yup.string().required().label('Название'),
        active: yup.boolean().required().label('Активна'),
        link: yup.string().required().label('Ссылка'),
        keywords: yup.string().label('Ключевые слова'),
        description_seo: yup.string().label('Описание'),
        title: yup.string().label('Title'),
        type: yup.number().required().label('Тип категории'),
        show_title: yup.boolean().required().label('Показывать название категории')
    }),
    initialValues: {
        active: false,
        type: 0,
        show_title: true
    }
})

const { mutate, isLoading } = useCreateCategory()

const onSubmit = handleSubmit((vals) => {
    mutate({
        ...vals,
        addable: false
    })
})
</script>
