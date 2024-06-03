<template>
    <div
        class="w-full rounded-lg border-2 p-4 transition-colors"
        :class="{
            'border-red-400': errorMessage,
            'border-gray': !errorMessage
        }"
    >
        <div class="flex flex-wrap items-center gap-x-4 gap-y-2">
            <FileUpload
                name="file"
                :auto="true"
                mode="basic"
                customUpload
                @uploader="fileUploader"
                @select="onSelect"
                :accept="props.accept"
            />
            <div v-if="value || errorMessage" class="order-1 w-full">
                <small>{{ value || '&nbsp;' }}</small>
                <small class="p-error">{{ errorMessage || '&nbsp;' }}</small>
            </div>
            <div class="ml-auto flex flex-col justify-between gap-2">
                <button type="button" @click="reset()">
                    <i class="pi pi-times-circle" style="font-size: 1rem"></i>
                </button>
                <div class="relative aspect-square h-4">
                    <Transition name="fade" mode="default">
                        <i
                            v-if="isUploading"
                            class="pi pi-spin pi-spinner absolute inset-0"
                            style="font-size: 100%"
                        ></i>
                        <i
                            v-else-if="isUploaded"
                            class="pi pi-check-circle absolute inset-0 text-green-500"
                            style="font-size: 100%"
                        ></i>
                    </Transition>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { axiosPrivate } from '@/network'
import type { FileUploadSelectEvent, FileUploadUploaderEvent } from 'primevue/fileupload'
import { useToast } from 'primevue/usetoast'
import { useField } from 'vee-validate'
import { ref } from 'vue'

const props = defineProps<{
    name: string
    uploadRoute: string
    filenamePropInResponse: string
    filenamePropInRequest: string
    accept?: string
}>()

const toast = useToast()
const { setValue, value, errorMessage, resetField } = useField<string>(() => props.name)

const fileBlobURL = ref<string>()
const isSelected = ref(false)
const isUploading = ref(false)
const isUploaded = ref(false)
const abortController = ref()

const fileUploader = (e: FileUploadUploaderEvent) => {
    abortController.value = new AbortController()
    const files = e.files as any
    const formData = new FormData()
    formData.append(props.filenamePropInRequest, files[0])
    isUploading.value = true
    isUploaded.value = false
    axiosPrivate
        .post(props.uploadRoute, formData, {
            signal: abortController.value.signal
        })
        .then((response) => {
            setValue(response.data[props.filenamePropInResponse])
            isUploaded.value = true
        })
        .catch((error) => {
            if (error.code === 'ERR_CANCELED') {
                toast.add({
                    severity: 'info',
                    life: 3000,
                    summary: 'Файл не загружен',
                    detail: 'Загрузка была отменена пользователем'
                })
            } else {
                toast.add({
                    severity: 'error',
                    life: 3000,
                    summary: 'Не удалось загрузить файл',
                    detail: error
                })
            }
        })
        .finally(() => {
            isUploading.value = false
        })
}

const onSelect = (e: FileUploadSelectEvent) => {
    isSelected.value = true
    isUploaded.value = false
    fileBlobURL.value = e.files[0].objectURL
}

const reset = () => {
    if (abortController.value) {
        abortController.value.abort()
    }
    resetField()
    isUploaded.value = false
    isUploading.value = false
    isSelected.value = false
}
</script>
