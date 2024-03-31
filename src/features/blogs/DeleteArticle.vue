<template>
    <div>
        <p class="mb-8 text-lg leading-loose">
            Вы уверены, что хотите удалить статью
            <span class="block w-fit rounded-lg bg-indigo-100 px-4 font-bold">
                {{ article.name }} (id: {{ article.id }})
            </span>
        </p>
        <div class="flex justify-end gap-4">
            <Button label="Нет" class="flex-1" severity="secondary" @click="dialogRef.close()" />
            <Button label="Да" class="flex-1" severity="danger" @click="deleteDish()" />
        </div>
    </div>
</template>

<script setup lang="ts">
import { useMutation, useQueryClient } from '@tanstack/vue-query'
import { reactive, inject } from 'vue'
import { axiosPrivate } from '@/network'
import { useToast } from 'primevue/usetoast'
import type { IBlog } from '.'

const dialogRef = inject('dialogRef') as any
const article = dialogRef.value.data.article as IBlog

const toast = useToast()
const queryClient = useQueryClient()

const deleteMutation = reactive(
    useMutation({
        mutationFn: () =>
            axiosPrivate.delete('admin/blog', {
                params: {
                    id: article.id
                }
            }),
        onSuccess() {
            toast.add({
                severity: 'success',
                life: 3000,
                summary: 'Успешно',
                detail: `Удалена статья ${article.name} (id: ${article.id})`
            })
            queryClient.invalidateQueries(['blogs'])
        },
        onError(error: any) {
            toast.add({
                severity: 'error',
                life: 3000,
                summary: 'Не удалось удалить статью',
                detail: error
            })
        }
    })
)

const deleteDish = () => {
    deleteMutation.mutate()
    dialogRef.value.close()
}
</script>
