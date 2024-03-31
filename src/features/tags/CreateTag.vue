<template>
    <form class="p-2" @submit="onSubmit">
        <div class="flex flex-col items-center justify-between gap-4 md:flex-row">
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
            <div class="w-full grow">
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
            label="Создать"
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
import DropdownSelect from '@/components/DropdownSelect.vue'
import { useCreateTag } from './composables'

const { handleSubmit } = useForm({
    validationSchema: yup.object({
        name: yup.string().required().label('Название тега'),
        img: yup.string().required().label('Изображение')
    }),
    initialValues: {
        active: false
    }
})

const { mutate, isLoading } = useCreateTag()

const onSubmit = handleSubmit((v) => {
    mutate(v)
})
</script>
