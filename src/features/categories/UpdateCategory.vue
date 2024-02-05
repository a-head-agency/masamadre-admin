<template>
    <form @submit.prevent="onSubmit">
        <div>
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
        active: yup.boolean().required().label('Активно')
    }),
    initialValues: {
        id: category.id,
        name: category.name,
        active: category.active
    }
})

const { mutate, isLoading } = useUpdateCategory()

const onSubmit = handleSubmit((vals) => {
    mutate(vals)
})
</script>
