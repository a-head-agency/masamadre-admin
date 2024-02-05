<template>
    <form @submit="onSubmit" class="w-full">
        <DropdownSelect
            name="active"
            label="Активна"
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

        <MyInputText class="mb-4" :name="`link`" label="Ссылка" />

        <div class="mx-auto w-64 mb-8">
            <p class="text-base mb-1 text-center font-medium">Превью</p>
            <MyUploadImage
                name="preview"
                class="rounded-lg"
                filename-prop-in-request="file"
                filename-prop-in-response="link"
                upload-route="admin/upload"
                :aspect-ratio="9 / 16"
            />
        </div>

        <MyUploadFile
            class="mb-6"
            name="file"
            uploadRoute="admin/upload"
            filenamePropInRequest="file"
            filenamePropInResponse="link"
            accept=".mp4,.mov"
        />

        <video
            v-if="videoSrc"
            class="mx-auto rounded-xl shadow-lg"
            width="320"
            :src="videoSrc"
            autoplay
            controls
            loop
        ></video>

        <Button class="mt-12 flex w-full justify-center p-4" type="submit">Создать</Button>
    </form>
</template>

<script setup lang="ts">
import DropdownSelect from '@/components/DropdownSelect.vue'
import { useMutation, useQueryClient } from '@tanstack/vue-query'
import { useToast } from 'primevue/usetoast'
import { useFieldValue, useForm } from 'vee-validate'
import * as yup from 'yup'
import { axiosPrivate } from '@/network'
import MyInputText from '@/components/MyInputText.vue'
import MyUploadFile from '@/components/MyUploadFile.vue'
import MyUploadImage from '@/components/MyUploadImage.vue'

const toast = useToast()
const queryClient = useQueryClient()

const { handleSubmit } = useForm({
    validationSchema: yup.object({
        file: yup.string().required().label('Видео'),
        preview: yup.string().required().label('Превью'),
        link: yup.string().required().label('Ссылка'),
        active: yup.boolean().required().label('Статус')
    }),
    initialValues: {
        active: false
    }
})

const videoSrc = useFieldValue<string>('file')

const { mutate } = useMutation({
    mutationFn: (vars: any) =>
        axiosPrivate.post('admin/story', {
            type: 2,
            ...vars
        }),
    onSuccess() {
        toast.add({
            severity: 'success',
            life: 3000,
            summary: 'Успешно',
            detail: `История создана`
        })
        queryClient.invalidateQueries(['stories'])
    },
    onError(error: any) {
        toast.add({
            severity: 'error',
            life: 3000,
            summary: 'Не удалось создать историю',
            detail: error
        })
    }
})

const onSubmit = handleSubmit((vals) => {
    mutate(vals)
})
</script>
