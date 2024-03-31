<template>
    <form @submit="onSubmitDocuments">
        <h1 class="mb-6 text-xl font-bold">Документы</h1>
        <MyEditor
            class="mb-4"
            label="Политика конфиденциальности в отношении обработки персональных данных"
            name="policy"
        />
        <MyEditor class="mb-4" label="Публичная оферта" name="ofert" />
        <MyEditor label="Пользовательское соглашение" name="users" />

        <Button label="Сохранить документы" class="mt-4 w-full" type="submit" />
    </form>
</template>

<script setup lang="ts">
import * as yup from 'yup'
import { useMutation, useQuery, useQueryClient } from '@tanstack/vue-query'
import { useToast } from 'primevue/usetoast'
import { axiosPrivate } from '@/network'
import { useForm } from 'vee-validate'

import MyEditor from '@/components/MyEditor.vue'

const toast = useToast()
const queryClient = useQueryClient()

const { data } = useQuery({
    queryKey: ['documents'],
    queryFn: async () => {
        const response = await axiosPrivate.get('admin/settings/text')
        return response.data
    }
})

const { handleSubmit: handleSubmitDocuments } = useForm({
    validationSchema: yup.object({
        policy: yup.string().required().label('Политика конфиденциальности'),
        ofert: yup.string().required().label('Публичная оферта'),
        users: yup.string().required().label('Пользовательское соглашение')
    }),
    initialValues: data
})

const { mutate: mutateDocuments } = useMutation({
    mutationFn: (vars: any) => axiosPrivate.put('admin/settings/text', vars),
    onSuccess: () => {
        toast.add({
            summary: 'Документы обновлены',
            severity: 'success',
            life: 3000
        })
        queryClient.invalidateQueries(['documents'])
    },
    onError: (error) => {
        toast.add({
            summary: 'Ошибка',
            detail: error,
            life: 3000
        })
    }
})

const onSubmitDocuments = handleSubmitDocuments((vals) => {
    mutateDocuments(vals)
})
</script>
