<script setup lang="ts">
import { inject } from 'vue'

import { useForm } from 'vee-validate'
import * as yup from 'yup'

import DropdownSelect from '@/components/DropdownSelect.vue'
import MyInputNumber from '@/components/MyInputNumber.vue'
import MyInputText from '@/components/MyInputText.vue'
import MyUploadImage from '@/components/MyUploadImage.vue'

import { useUpdateTag } from './composables'
import type { ITag } from './interfaces'

const dialogRef = inject('dialogRef') as any
const tag = dialogRef.value.data.tag as ITag

const { handleSubmit } = useForm({
    validationSchema: yup.object({
        id: yup.number().required().label('ID тэга'),
        name: yup.string().required().label('Название тега'),
        img: yup.string().required().label('Изображение'),
        active: yup.boolean().required().label('Активен')
    }),
    initialValues: {
        id: tag.id,
        name: tag.name,
        img: tag.img,
        active: tag.active
    }
})

const { mutate, isPending } = useUpdateTag()

const onSubmit = handleSubmit((v) => {
    mutate(v)
})
</script>

<template>
    <form class="p-2" @submit="onSubmit">
        <div class="flex flex-col items-center justify-between gap-4 md:flex-row">
            <div class="aspect-square h-64 shrink-0">
                <MyUploadImage
                    name="img"
                    class="rounded-lg"
                    :aspect-ratio="1 / 1"
                    upload-route="admin/upload"
                    filename-prop-in-request="file"
                    filename-prop-in-response="link"
                />
            </div>
            <div class="w-full grow">
                <MyInputNumber class="w-full" name="id" label="ID" disabled />
                <MyInputText class="w-full" name="name" label="Название" />
                <MyInputText class="w-full" name="alt" label="Альтернативный текст" />
                <DropdownSelect
                    name="active"
                    label="Активен"
                    placeholder="Выберите"
                    :options="[
                        {
                            label: 'Не активен',
                            code: false
                        },
                        {
                            label: 'Активен',
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
