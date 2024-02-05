<template>
    <div>
        <p class="mb-8 text-lg leading-loose">
            Вы уверены, что хотите удалить ресторан
            <span
                class="inline-block min-w-max whitespace-nowrap rounded-lg bg-indigo-100 px-4 font-bold"
            >
                {{ restaurant.name }} (id: {{ restaurant.id }})
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
import type { Restaurant } from '@/interfaces'

const dialogRef = inject('dialogRef') as any
const restaurant = dialogRef.value.data.restaurant as Restaurant

const toast = useToast()
const queryClient = useQueryClient()

const deleteMutation = reactive(
    useMutation({
        mutationFn: () =>
            axiosPrivate.delete('admin/rest', {
                params: { id: restaurant.id }
            }),
        onSuccess() {
            toast.add({
                severity: 'success',
                life: 3000,
                summary: 'Успешно',
                detail: `Удален ресторан ${restaurant.name} (id: ${restaurant.id})`
            })
            queryClient.invalidateQueries(['rests'])
        },
        onError(error: any) {
            toast.add({
                severity: 'error',
                life: 3000,
                summary: 'Не удалось удалить ресторан',
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
