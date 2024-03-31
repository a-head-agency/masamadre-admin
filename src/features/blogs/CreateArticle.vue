<template>
    <form @submit="onSubmit">
        <div class="grid grid-cols-1 gap-x-4 lg:grid-cols-2">
            <MyInputNumber disabled class="flex-1" name="id" label="ID статьи" />
            <DropdownSelect
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
        </div>
        <MyInputText class="mb-2" name="name" label="Название" />

        <div class="mb-8">
            <p class="mb-2 text-center font-medium">Десктопная версия (3:4)</p>
            <MyUploadImage
                class="mx-auto sm:max-w-[50%]"
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
                class="mx-auto sm:max-w-[50%]"
                name="phone_img"
                :aspect-ratio="2 / 1"
                filename-prop-in-request="file"
                filename-prop-in-response="link"
                upload-route="admin/upload"
            />
        </div>

        <MyEditor class="mb-6 h-full flex-1" name="text" label="Контент" />

        <h2 class="mb-6 text-lg font-bold">SEO</h2>
        <div class="grid grid-flow-row grid-cols-1 gap-x-4 lg:grid-cols-2">
            <MyInputText name="link" label="Ссылка" />
            <MyInputText name="title" label="Title" />
            <MyInputText class="col-span-full" name="description_seo" label="Описание" />
            <MyInputText class="col-span-full" name="keywords" label="Ключевые слова" />
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
import { useForm } from 'vee-validate'
import * as yup from 'yup'

import MyUploadImage from '@/components/MyUploadImage.vue'
import MyInputNumber from '@/components/MyInputNumber.vue'
import MyInputText from '@/components/MyInputText.vue'
import MyEditor from '@/components/MyEditor.vue'
import DropdownSelect from '@/components/DropdownSelect.vue'
import { useCreateArticle } from './composables'

const { handleSubmit } = useForm({
    validationSchema: yup.object({
        name: yup.string().required().label('Название статьи'),
        img: yup.string().required().label('Десктопная версия изображения'),
        phone_img: yup.string().required().label('Мобильная версия изображения'),
        text: yup.string().required().label('Контент'),
        active: yup.boolean().required().label('Активность'),
        link: yup.string().required().label('Ссылка'),
        keywords: yup.string().label('Ключевые слова'),
        description_seo: yup.string().label('Описание'),
        title: yup.string().label('Title')
    }),
    initialValues: {
        active: false
    }
})

const { mutate, isLoading } = useCreateArticle()

const onSubmit = handleSubmit((vals) => {
    mutate(vals)
})
</script>
