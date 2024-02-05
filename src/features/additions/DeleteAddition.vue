<template>
    <div>
        <p class="mb-8 text-lg leading-loose">
            Вы уверены, что хотите удалить добавку
            <span
                class="inline-block min-w-max whitespace-nowrap rounded-lg bg-indigo-100 px-4 font-bold"
            >
                {{ addition.name }} (id: {{ addition.id }})
            </span>
        </p>
        <div class="flex justify-end gap-4">
            <Button label="Нет" class="flex-1" severity="secondary" @click="dialogRef.close()" />
            <Button label="Да" class="flex-1" severity="danger" @click="deleteaddition()" />
        </div>
    </div>
</template>

<script setup lang="ts">
import { useMutation, useQueryClient } from '@tanstack/vue-query'
import { reactive, inject } from 'vue'
import { axiosPrivate } from '@/network'
import { useToast } from 'primevue/usetoast'
import type { IAddition } from './interfaces'

const dialogRef = inject('dialogRef') as any
const addition = dialogRef.value.data.addition as IAddition

const toast = useToast()
const queryClient = useQueryClient()

const deleteMutation = reactive(
    useMutation({
        mutationFn: () =>
            axiosPrivate.delete('admin/dish', {
                params: {
                    id: addition.id
                }
            }),
        onSuccess() {
            toast.add({
                severity: 'success',
                life: 3000,
                summary: 'Успешно',
                detail: `Удалена добавка ${addition.name} (id: ${addition.id})`
            })
            queryClient.invalidateQueries(['additions'])
        },
        onError(error: any) {
            toast.add({
                severity: 'error',
                life: 3000,
                summary: 'Не удалось удалить добавку',
                detail: error
            })
        }
    })
)

const deleteaddition = () => {
    deleteMutation.mutate()
    dialogRef.value.close()
}
</script>
