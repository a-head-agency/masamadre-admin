<script setup lang="ts">
import { reactive, ref } from 'vue'

import { useMutation } from '@tanstack/vue-query'
import { useForm } from 'vee-validate'
import * as yup from 'yup'

import { useToast } from 'primevue/usetoast'

import { axiosPrivate } from '@/common/network'

import MyInputNumber from '@/components/MyInputNumber.vue'
import MyInputText from '@/components/MyInputText.vue'
import MyUploadImage from '@/components/MyUploadImage.vue'

const toast = useToast()

const visible = ref(false)

const schema = yup.object({
    src: yup.string().required().label('Баннер'),
    // TODO: add conditional validation. Only one of the bottom properties could be specified.
    // Also check about default values for fields.
    acc_id: yup.number().label('ID акции').default(-1),
    link: yup.string().label('Ссылка на акцию')
})

const { handleSubmit } = useForm({
    validationSchema: schema
})

const schemaDefaults = schema.getDefault()

const createMutation = reactive(
    useMutation({
        mutationFn: (payload: any) => {
            const response = axiosPrivate.post('admin/banner', payload)
            return response
        },
        onSuccess(data, variables) {
            toast.add({
                severity: 'success',
                life: 3000,
                summary: 'Успешно',
                detail: `Создан баннер ${variables.src}`
            })
        },
        onError(error: any) {
            toast.add({
                severity: 'error',
                life: 3000,
                summary: 'Не удалось создать баннер',
                detail: error
            })
        }
    })
)

const onSubmit = handleSubmit((vals) => {
    createMutation.mutate(vals)
})
</script>

<template>
    <div>
        <div class="flex justify-end gap-4">
            <Button label="Создать баннер" icon="pi pi-external-link" @click="visible = true" />
        </div>

        <Dialog
            v-model:visible="visible"
            modal
            header="Создать баннер"
            class="m-4 w-full max-w-4xl"
        >
            <form class="p-2" @submit="onSubmit">
                <MyInputText class="mb-4" name="link" label="Ссылка на акцию" />
                <MyInputNumber
                    class="mb-4"
                    name="acc_id"
                    label="ID акции"
                    :initial-value="schemaDefaults.acc_id"
                />

                <MyUploadImage
                    class="rounded-lg"
                    name="src"
                    filename-prop-in-request="image"
                    filename-prop-in-response="fileLink"
                    upload-route="admin/upload"
                />

                <Button
                    class="mt-8 flex w-full items-center p-4"
                    type="submit"
                    label="Создать"
                    :loading="createMutation.isPending"
                    :disabled="createMutation.isPending"
                />
            </form>
        </Dialog>
    </div>
</template>
