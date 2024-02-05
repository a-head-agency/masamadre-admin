<template>
    <div>
        <p class="mb-8 text-lg leading-loose">
            Вы уверены, что хотите удалить тег
            <span
                class="inline-block min-w-max whitespace-nowrap rounded-lg bg-indigo-100 px-4 font-bold"
            >
                {{ tag.name }} (id: {{ tag.id }})
            </span>
        </p>
        <div class="flex justify-end gap-4">
            <Button label="Нет" class="flex-1" severity="secondary" @click="dialogRef.close()" />
            <Button label="Да" class="flex-1" severity="danger" @click="deleteTag()" />
        </div>
    </div>
</template>

<script setup lang="ts">
import { useMutation, useQueryClient } from '@tanstack/vue-query'
import { inject, reactive } from 'vue'
import { useToast } from 'primevue/usetoast'
import type { ITag } from '@/features/tags'
import { axiosPrivate } from '@/network'

const toast = useToast()
const queryClient = useQueryClient()

const dialogRef = inject('dialogRef') as any
const tag = dialogRef.value.data.tag as ITag

const deleteMutation = reactive(
    useMutation({
        // TODO: Add tag deletioon route
        mutationFn: (vars: { id: number }) =>
            axiosPrivate.delete('admin/tag', {
                params: {
                    id: vars.id
                }
            }),
        onSuccess() {
            toast.add({
                severity: 'success',
                life: 3000,
                summary: 'Успешно',
                detail: `Удален тег ${tag.name} (id: ${tag.id})`
            })
            queryClient.invalidateQueries(['tags'])
        },
        onError(error: any) {
            toast.add({
                severity: 'error',
                life: 3000,
                summary: 'Не удалось удалить тег',
                detail: error
            })
        }
    })
)

const deleteTag = () => {
    deleteMutation.mutate({ id: tag.id })
    dialogRef.value.close()
}
</script>
