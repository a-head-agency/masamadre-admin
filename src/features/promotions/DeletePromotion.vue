<script setup lang="ts">
import { inject, reactive } from 'vue'

import { useMutation, useQueryClient } from '@tanstack/vue-query'

import { useToast } from 'primevue/usetoast'

import { axiosPrivate } from '@/common/network'

import type { IPromotion } from './composables'

const dialogRef = inject('dialogRef') as any
const promotion = dialogRef.value.data.promotion as IPromotion

const toast = useToast()
const queryClient = useQueryClient()

const deleteMutation = reactive(
    useMutation({
        mutationFn: () =>
            axiosPrivate.delete('admin/promo', {
                params: {
                    id: promotion.id
                }
            }),
        onSuccess() {
            toast.add({
                severity: 'success',
                life: 3000,
                summary: 'Успешно',
                detail: `Удалена акция ${promotion.name} (id: ${promotion.id})`
            })
            queryClient.invalidateQueries({ queryKey: ['promotions'] })
        },
        onError(error: any) {
            toast.add({
                severity: 'error',
                life: 3000,
                summary: 'Не удалось удалить акцию',
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

<template>
    <div>
        <p class="mb-8 text-lg leading-loose">
            Вы уверены, что хотите удалить акцию
            <span class="block rounded-lg bg-indigo-100 px-4 font-bold">
                {{ promotion.name }} (id: {{ promotion.id }})
            </span>
        </p>
        <div class="flex justify-end gap-4">
            <Button label="Нет" class="flex-1" severity="secondary" @click="dialogRef.close()" />
            <Button label="Да" class="flex-1" severity="danger" @click="deleteDish()" />
        </div>
    </div>
</template>
