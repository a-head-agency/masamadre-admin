<template>
    <form @submit="onSubmit">
        <div class="mb-2 flex gap-8">
            <MyInputText class="flex-1" name="name" label="Название" />
        </div>
        <div class="flex items-center gap-8">
            <DropdownSelect
                class="flex-1"
                name="active"
                label="Активность"
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
                    <Tag
                        v-if="slotProps.value.code === false"
                        icon="pi pi-ban"
                        :value="slotProps.value.label"
                        severity="danger"
                    />
                    <Tag
                        v-else-if="slotProps.value.code === true"
                        icon="pi pi-check-circle"
                        :value="slotProps.value.label"
                        severity="success"
                    />
                </template>
                <template #option="slotProps">
                    <Tag
                        v-if="slotProps.option.code === false"
                        icon="pi pi-ban"
                        :value="slotProps.option.label"
                        severity="danger"
                    />
                    <Tag
                        v-else-if="slotProps.option.code === true"
                        icon="pi pi-check-circle"
                        :value="slotProps.option.label"
                        severity="success"
                    />
                </template>
            </DropdownSelect>
            <MyCalendarRange class="flex-1" name="date_range" label="Период активности" />
        </div>
        <div class="mb-8">
            <p class="mb-2 text-center font-medium">Десктопная версия (3:4)</p>
            <MyUploadImage
                class="mx-auto max-w-[50%]"
                name="img"
                :aspect-ratio="3 / 4"
                filename-prop-in-request="file"
                filename-prop-in-response="link"
                upload-route="admin/upload"
            />
        </div>
        <div class="mb-8">
            <p class="mb-2 text-center font-medium">Мобильная версия (2:1)</p>
            <MyUploadImage
                class="mx-auto max-w-[50%]"
                name="phone_img"
                :aspect-ratio="2 / 1"
                filename-prop-in-request="file"
                filename-prop-in-response="link"
                upload-route="admin/upload"
            />
        </div>

        <MyEditor class="h-full flex-1" name="text" label="Контент" />

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
import { useForm } from 'vee-validate'
import * as yup from 'yup'

import MyUploadImage from '@/components/MyUploadImage.vue'
import MyInputText from '@/components/MyInputText.vue'
import MyEditor from '@/components/MyEditor.vue'
import DropdownSelect from '@/components/DropdownSelect.vue'
import MyCalendarRange from '@/components/MyCalendarRange.vue'
import { useCreatePromotion } from './composables'
import { pad } from '@/utils'

const { handleSubmit } = useForm({
    validationSchema: yup.object({
        name: yup.string().required().label('Название акции'),
        img: yup.string().required().label('Десктопная версия изображения'),
        phone_img: yup.string().required().label('Мобильная версия изображения'),
        text: yup.string().required().label('Контент'),
        active: yup.boolean().required().label('Активность'),
        date_range: yup
            .array()
            .of(yup.date().required())
            .min(2)
            .required()
            .label('Период активности')
    }),
    initialValues: {
        active: false
    }
})

const { mutate, isLoading } = useCreatePromotion()

const onSubmit = handleSubmit((vals: any) => {
    vals.start =
        vals.date_range[0].getFullYear() +
        '-' +
        pad(vals.date_range[0].getMonth() + 1, 2) +
        '-' +
        pad(vals.date_range[0].getDate(), 2)
    vals.end =
        vals.date_range[1].getFullYear() +
        '-' +
        pad(vals.date_range[1].getMonth() + 1, 2) +
        '-' +
        pad(vals.date_range[1].getDate(), 2)
    delete vals.date_range
    mutate(vals)
})
</script>
