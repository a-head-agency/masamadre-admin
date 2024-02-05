<template>
    <form class="w-full" @submit.prevent="onSubmit">
        <div>
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
import { CategoryStatusBadge } from '.'

const { handleSubmit } = useForm({
    validationSchema: yup.object({
        name: yup.string().required().label('Название'),
        active: yup.boolean().required().label('Активна')
    }),
    initialValues: {
        active: false
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
