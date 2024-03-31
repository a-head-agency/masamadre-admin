<template>
    <form @submit.prevent="onSubmit">
        <div class="mb-6">
            <MyInputNumber name="id" label="ID" disabled />
            <MyInputText name="name" label="Название" />
            <div class="flex gap-4">
                <DropdownSelect
                    class="flex-1"
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
            </div>
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
            label="Сохранить"
            :loading="isLoading"
            :disabled="isLoading"
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
import type { ICategory } from './interfaces'
import { CategoryStatusBadge } from '.'

const dialogRef = inject('dialogRef') as any
const category = dialogRef.value.data.category as ICategory

const { handleSubmit } = useForm({
    validationSchema: yup.object({
        id: yup.number().required().label('ID категории'),
        name: yup.string().required().label('Название категории'),
        active: yup.boolean().required().label('Активно'),
        link: yup.string().required().label('Ссылка'),
        keywords: yup.string().label('Ключевые слова'),
        description_seo: yup.string().label('Описание'),
        title: yup.string().label('Title')
    }),
    initialValues: {
        id: category.id,
        name: category.name,
        active: category.active,
        link: category.link,
        keywords: category.keywords,
        description_seo: category.description_seo,
        title: category.title
    }
})

const { mutate, isLoading } = useUpdateCategory()

const onSubmit = handleSubmit((vals) => {
    mutate(vals)
})
</script>
