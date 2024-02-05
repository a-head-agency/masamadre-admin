<template>
    <form @submit="onSubmit">
        <div class="mb-2 flex gap-8">
            <MyInputNumber disabled class="mb-2 flex-1" name="id" label="ID статьи" />
            <DropdownSelect
                class="flex-1"
                name="active"
                label="Активность"
                placeholder="Выберите"
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
                    <template v-if="slotProps.value">
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
        </div>
        <MyInputText class="mb-2" name="name" label="Название" />
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
            label="Сохранить"
            :loading="isLoading"
            :disabled="isLoading"
        />
    </form>
</template>

<script setup lang="ts">
import { inject } from 'vue'
import MyUploadImage from '@/components/MyUploadImage.vue'
import { useForm } from 'vee-validate'
import * as yup from 'yup'

import MyInputText from '@/components/MyInputText.vue'
import MyEditor from '@/components/MyEditor.vue'

import { useArticle, type IBlog, useUpdateArticle } from './composables'
import MyInputNumber from '@/components/MyInputNumber.vue'
import DropdownSelect from '@/components/DropdownSelect.vue'

const dialogRef = inject('dialogRef') as any
const article = dialogRef.value.data.article as IBlog

const { data: articleData } = useArticle(article.id, (v) => {
    return v
})

const { handleSubmit } = useForm({
    validationSchema: yup.object({
        id: yup.number().required().label('ID статьи'),
        name: yup.string().required().label('Название статьи'),
        img: yup.string().required().label('Десктопная версия изображения'),
        phone_img: yup.string().required().label('Мобильная версия изображения'),
        text: yup.string().required().label('Контент'),
        active: yup.boolean().required().label('Активность')
    }),
    initialValues: articleData
})

const { mutate, isLoading } = useUpdateArticle()

const onSubmit = handleSubmit((vals) => {
    mutate(vals)
})
</script>
