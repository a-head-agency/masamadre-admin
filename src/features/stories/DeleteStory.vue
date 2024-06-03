<template>
    <div>
        <p class="mb-8 text-lg leading-loose">
            Вы уверены, что хотите удалить историю
            <span
                class="inline-block min-w-max whitespace-nowrap rounded-lg bg-indigo-100 px-4 font-bold"
            >
                (id: {{ story.id }})
            </span>
        </p>
        <div class="flex justify-end gap-4">
            <Button label="Нет" class="flex-1" severity="secondary" @click="dialogRef.close()" />
            <Button label="Да" class="flex-1" severity="danger" @click="deleteRestaurant()" />
        </div>
    </div>
</template>

<script setup lang="ts">
import { useMutation, useQueryClient } from '@tanstack/vue-query'
import { inject, reactive } from 'vue'
import { axiosPrivate } from '@/network'
import { useToast } from 'primevue/usetoast'
import type { IStoryImage, IStoryVideo } from './interfaces'

const dialogRef = inject('dialogRef') as any
const story = dialogRef.value.data.story as IStoryImage | IStoryVideo

const toast = useToast()
const queryClient = useQueryClient()

const deleteMutation = reactive(
    useMutation({
        mutationFn: () =>
            axiosPrivate.delete('admin/story', {
                params: { id: story.id }
            }),
        onSuccess() {
            toast.add({
                severity: 'success',
                life: 3000,
                summary: 'Успешно',
                detail: `Удален история (id: ${story.id})`
            })
            queryClient.invalidateQueries({queryKey: ['stories']})
        },
        onError(error: any) {
            toast.add({
                severity: 'error',
                life: 3000,
                summary: 'Не удалось удалить историю',
                detail: error
            })
        }
    })
)

const deleteRestaurant = () => {
    deleteMutation.mutate()
    dialogRef.value.close()
}
</script>
