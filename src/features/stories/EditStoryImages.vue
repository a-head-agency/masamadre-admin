<template>
    <form @submit="onSubmit" class="w-full">
        <MyInputNumber name="id" label="ID" />
        <DropdownSelect
            class="mb-4"
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

        <div class="mx-auto mb-8 w-64">
            <p class="mb-1 text-center text-base font-medium">Превью</p>
            <MyUploadImage
                name="preview"
                class="rounded-lg"
                filename-prop-in-request="file"
                filename-prop-in-response="link"
                upload-route="admin/upload"
                :aspect-ratio="9 / 16"
            />
        </div>

        <div v-if="fields.length === 0" class="flex flex-col items-center gap-2">
            <p class="text-center">Создайте первый слайд истории</p>
            <i class="pi pi-arrow-down text-base"></i>
        </div>

        <fieldset
            v-for="(field, idx) in fields"
            :key="field.key"
            class="relative mb-4 flex w-full flex-wrap items-center justify-center gap-8 rounded-lg border-2 border-dashed border-gray-200 p-4"
        >
            <div class="mt-8 w-72 shrink-0">
                <MyUploadImage
                    :name="`story_items[${idx}].img`"
                    class="rounded-lg"
                    filename-prop-in-request="file"
                    filename-prop-in-response="link"
                    upload-route="admin/upload"
                    :aspect-ratio="9 / 16"
                />
            </div>

            <div class="grow">
                <MyInputText :name="`story_items[${idx}].text`" label="Альтернативый текст" />
                <MyTextarea :name="`story_items[${idx}].text`" label="Текст" />
            </div>
            <button class="absolute right-4 top-4" type="button" @click="remove(idx)">
                <i class="pi pi-times-circle" style="font-size: 1rem"></i>
            </button>
        </fieldset>
        <Button
            class="mt-8 flex w-full justify-center p-4"
            severity="secondary"
            type="button"
            @click="push({})"
        >
            <i class="pi pi-plus" style="font-size: 1rem"></i>
        </Button>

        <Button
            class="mt-12 flex w-full justify-center p-4"
            type="submit"
            :disabled="fields.length === 0"
        >
            Создать
        </Button>
    </form>
</template>

<script setup lang="ts">
import MyTextarea from '@/components/MyTextarea.vue'
import MyUploadImage from '@/components/MyUploadImage.vue'
import DropdownSelect from '@/components/DropdownSelect.vue'
import { useMutation, useQueryClient } from '@tanstack/vue-query'
import { useToast } from 'primevue/usetoast'
import { useForm, useFieldArray } from 'vee-validate'
import * as yup from 'yup'
import { axiosPrivate } from '@/network'
import type { IStoryImage } from '.'
import { computed } from 'vue'
import MyInputNumber from '@/components/MyInputNumber.vue'
import MyInputText from '@/components/MyInputText.vue'

const props = defineProps<{
    story: IStoryImage
}>()

const toast = useToast()
const queryClient = useQueryClient()

const { handleSubmit } = useForm({
    validationSchema: yup.object({
        id: yup.number().required().label('ID'),
        active: yup.boolean().required().label('Статус'),
        preview: yup.string().required().label('Превью'),
        story_items: yup
            .array()
            .of(
                yup.object({
                    text: yup.string().required().label('Текст'),
                    img: yup.string().required().label('Изображение')
                })
            )
            .required()
            .min(1, 'Нельзя создать пустую историю. Добавьте слайдов.')
    }),
    initialValues: computed(() => ({
        id: props.story.id,
        active: props.story.active,
        preview: props.story.preview,
        story_items: props.story.story_items.map((i) => ({
            img: i.img,
            text: i.text
        }))
    }))
})

const { push, remove, fields } = useFieldArray('story_items')

const { mutate } = useMutation({
    mutationFn: (vars: any) =>
        axiosPrivate.put('admin/story', {
            type: 1,
            ...vars
        }),
    onSuccess() {
        toast.add({
            severity: 'success',
            life: 3000,
            summary: 'Успешно',
            detail: `История изменена`
        })
        queryClient.invalidateQueries(['stories'])
    },
    onError(error: any) {
        toast.add({
            severity: 'error',
            life: 3000,
            summary: 'Не удалось изменить историю',
            detail: error
        })
    }
})

const onSubmit = handleSubmit((vals) => {
    mutate(vals)
})
</script>
