<template>
    <form class="p-2" @submit="onSubmit">
        <div class="flex items-center justify-between gap-4">
            <div class="aspect-square h-64 shrink-0">
                <MyUploadImage
                    name="img"
                    class="rounded-lg"
                    :aspectRatio="1 / 1"
                    uploadRoute="admin/upload"
                    filenamePropInRequest="file"
                    filenamePropInResponse="link"
                />
            </div>
            <div class="grow">
                <MyInputNumber name="id" label="ID" disabled />
                <MyInputText name="name" label="Название" />
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
            :loading="isLoading"
            :disabled="isLoading"
        />
    </form>
</template>

<script setup lang="ts">
import { useForm } from 'vee-validate'
import * as yup from 'yup'
import MyInputText from '@/components/MyInputText.vue'
import MyUploadImage from '@/components/MyUploadImage.vue'
import { useUpdateTag } from './composables'
import { inject } from 'vue'
import type { ITag } from './interfaces'
import MyInputNumber from '@/components/MyInputNumber.vue'
import DropdownSelect from '@/components/DropdownSelect.vue'

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

const { mutate, isLoading } = useUpdateTag()

const onSubmit = handleSubmit((v) => {
    mutate(v)
})
</script>
