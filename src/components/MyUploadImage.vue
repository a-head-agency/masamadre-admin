<template>
    <div
        class="relative flex h-full w-full flex-col items-center overflow-hidden border-2 transition-colors"
        :class="{
            'border-red-400': errorMessage,
            'border-gray': !errorMessage,
            'border-black': isDragging
        }"
        @dragover="onDragOver"
        @dragleave="onDragLeave"
        @drop="onDrop"
    >
        <div
            class="relative z-0 h-full w-full"
            :style="{
                aspectRatio: props.aspectRatio
            }"
        >
            <Transition name="fade" mode="out-in">
                <div v-if="isSelected" class="h-full w-full overflow-hidden rounded-md">
                    <div>
                        <Cropper
                            :style="{
                                aspectRatio: props.aspectRatio
                            }"
                            ref="cropper"
                            :src="editingFileUrl || value"
                            :stencil-props="{
                                handlers: {},
                                movable: false,
                                resizable: false,
                                aspectRatio: props.aspectRatio
                            }"
                            :moveImage="isEditingImage"
                            defaultBoundaries="fill"
                            :stencil-size="stencilSize"
                            :resize-image="{
                                touch: isEditingImage,
                                wheel: isEditingImage,
                                adjustStencil: false
                            }"
                            image-restriction="none"
                        />
                    </div>
                </div>
                <div v-else class="h-full w-full">
                    <input
                        type="file"
                        :id="inputID"
                        @change="onChange"
                        class="peer absolute h-px w-px opacity-0"
                        ref="inputRef"
                    />
                    <label
                        :for="inputID"
                        class="flex h-full w-full cursor-pointer items-center justify-center rounded-md p-4 text-center ring-indigo-300 transition-shadow peer-focus:ring-2"
                    >
                        <span>
                            Перетащите сюда картику, либо выберите кликнув
                            <u>здесь</u>
                        </span>
                    </label>
                </div>
            </Transition>
        </div>

        <Transition name="fade" mode="out-in">
            <div
                v-if="isSelected"
                class="absolute left-0 top-0 z-20 flex w-full items-center justify-center gap-2 p-2 text-white"
            >
                <button
                    type="button"
                    class="flex h-8 max-w-[10rem] flex-1 basis-0 items-center justify-center rounded-md bg-black bg-opacity-50 px-2 text-sm leading-none transition-all hover:bg-opacity-75"
                    @click="reset()"
                >
                    <i class="pi pi-times mr-1 text-sm"></i>
                    Удалить
                </button>

                <button
                    type="button"
                    :disabled="isUploading"
                    class="flex h-8 max-w-[10rem] flex-1 basis-0 items-center justify-center rounded-md bg-black bg-opacity-50 px-2 text-sm leading-none transition-all hover:bg-opacity-75"
                    @click="saveOrEditAction()"
                >
                    <Transition name="fade" mode="out-in" :duration="200">
                        <span v-if="isUploading"><i class="pi pi-spin pi-spinner"></i></span>
                        <span v-else-if="isEditingImage">
                            <i class="pi pi-check mr-1 text-sm"></i>
                            Сохранить
                        </span>
                        <span v-else>
                            <i class="pi pi-pencil mr-1 text-sm"></i>
                            Обрезать
                        </span>
                    </Transition>
                </button>
            </div>
        </Transition>

        <Transition name="fade" mode="out-in">
            <div
                v-if="isEditingImage"
                class="absolute bottom-2 left-2 top-2 flex flex-col items-center justify-center gap-2"
            >
                <button
                    type="button"
                    class="flex aspect-square h-8 items-center justify-center rounded-md bg-black bg-opacity-50 transition-all hover:bg-opacity-75"
                    @click="rotate(90)"
                >
                    <i class="pi pi-refresh text-lg text-white"></i>
                </button>
                <button
                    type="button"
                    class="flex aspect-square h-8 items-center justify-center rounded-md bg-black bg-opacity-50 transition-all hover:bg-opacity-75"
                    @click="rotate(-90)"
                >
                    <i class="pi pi-replay text-lg text-white"></i>
                </button>
            </div>
        </Transition>

        <small class="p-error absolute bottom-2 z-20 max-w-full px-4 text-center font-medium">
            {{ errorMessage || '&nbsp;' }}
        </small>
    </div>
</template>

<script setup lang="ts">
import { axiosPrivate } from '@/network'
import { useToast } from 'primevue/usetoast'
import { useField } from 'vee-validate'
import { computed, onUnmounted, ref, watch } from 'vue'
import { Cropper } from 'vue-advanced-cropper'
import { v4 as uuidv4 } from 'uuid'
import 'vue-advanced-cropper/dist/style.css'

const props = defineProps<{
    name: string
    uploadRoute: string
    filenamePropInRequest: string
    filenamePropInResponse: string
    aspectRatio?: number
}>()

const cropper = ref<any>()

const stencilSize = (v: any) => {
    const boundaries = v.boundaries
    return {
        width: boundaries.width,
        height: boundaries.height
    }
}

const rotate = (angle: number) => {
    if (cropper.value) {
        cropper.value.rotate(angle)
    }
}

const inputID = uuidv4()

const toast = useToast()
const { setValue, value, errorMessage, resetField } = useField<string>(() => props.name)

const reset = () => {
    if (editingFileUrl.value) {
        URL.revokeObjectURL(editingFileUrl.value)
        editingFileUrl.value = undefined
    }
    isUploading.value = false
    isUploaded.value = false
    isDragging.value = false
    isEditingImage.value = false
    files.value = []
    if (inputRef.value) {
        inputRef.value.files = [] as any
    }
    resetField({
        value: undefined
    })
}

const save = () => {
    if (cropper.value) {
        isUploading.value = true
        isUploaded.value = false

        const { canvas } = cropper.value.getResult()
        if (canvas) {
            const formData = new FormData()
            canvas.toBlob((blob: any) => {
                const file = new File([blob], 'img.png')
                formData.append(props.filenamePropInRequest, file)
                axiosPrivate
                    .post(props.uploadRoute, formData)
                    .then((response) => {
                        setValue(response.data[props.filenamePropInResponse])
                        isUploaded.value = true
                    })
                    .catch((error) => {
                        toast.add({
                            severity: 'error',
                            life: 3000,
                            summary: 'Не удалось загрузить файл',
                            detail: error
                        })
                        isEditingImage.value = true
                    })
                    .finally(() => {
                        isUploading.value = false
                    })
            }, 'image/png')
        }
    }
}

const saveOrEditAction = () => {
    if (isEditingImage.value) {
        // image is being edited - save it
        isEditingImage.value = false
        save()
    } else {
        // image is saved - edit it
        isEditingImage.value = true
    }
}

const editingFileUrl = ref<string>()
const isSelected = computed(() => !!editingFileUrl.value || !!value.value)
const isUploading = ref(false)
const isUploaded = ref(false)
const isDragging = ref(false)
const isEditingImage = ref(false)
const inputRef = ref<HTMLInputElement>()
const files = ref<File[]>([])

watch(
    [editingFileUrl, value],
    () => {
        if (!editingFileUrl.value) {
            editingFileUrl.value = value.value
        }
    },
    {
        immediate: true
    }
)

onUnmounted(() => {
    if (editingFileUrl.value) {
        URL.revokeObjectURL(editingFileUrl.value)
    }
})

const onChange = () => {
    if (inputRef.value) {
        files.value = [...(inputRef.value.files || [])]

        if (files.value[0]) {
            const file = files.value[0]
            const fileSize = Math.round((file.size / 1024 / 1024) * 100) / 100
            const fileExtention = file.name.split('.').pop()!
            const fileName = file.name.split('.').shift()
            const isImage = ['jpg', 'jpeg', 'png', 'gif'].includes(fileExtention)
            console.log(fileSize, fileExtention, fileName, isImage)

            // revoke previous blob url if one exists
            if (editingFileUrl.value) {
                console.log('revoked: ', editingFileUrl.value)
                URL.revokeObjectURL(editingFileUrl.value)
            }
            editingFileUrl.value = URL.createObjectURL(file)
            isEditingImage.value = true
        }
    }
}
const onDragOver = (e: Event) => {
    e.preventDefault()
    isDragging.value = true
}
const onDragLeave = () => {
    isDragging.value = false
}
const onDrop = (e: DragEvent) => {
    e.preventDefault()
    if (inputRef.value) {
        inputRef.value.files = e.dataTransfer?.files || null
    }
    onChange()
    isDragging.value = false
}
</script>
