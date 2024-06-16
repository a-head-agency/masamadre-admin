<script setup lang="ts">
import { reactive } from 'vue'

import { useMutation, useQueryClient } from '@tanstack/vue-query'

import { useConfirm } from 'primevue/useconfirm'
import { useToast } from 'primevue/usetoast'

import { axiosPrivate } from '@/common/network'

const props = defineProps<{
    disabled?: boolean
    banner?: any
}>()

const toast = useToast()
const confirm = useConfirm()
const queryClient = useQueryClient()

const deleteMutation = reactive(
    useMutation({
        mutationFn: () =>
            axiosPrivate.delete('admin/banner', {
                params: {
                    id: props.banner?.id
                }
            }),
        onSuccess() {
            toast.add({
                severity: 'success',
                life: 3000,
                summary: 'Успешно',
                detail: `Удален баннер (id: ${props.banner?.id})`
            })
            queryClient.invalidateQueries({ queryKey: ['banners'] })
        },
        onError(error: any) {
            toast.add({
                severity: 'error',
                life: 3000,
                summary: 'Не удалось удалить баннер',
                detail: error
            })
        }
    })
)

const confirmDelete = () => {
    confirm.require({
        message: `Вы уверены, что хотите удалить баннер (id: ${props.banner?.id}) ?`,
        header: 'Подтверждение',
        icon: 'pi pi-info-circle',
        acceptClass: 'p-button-danger',
        accept: () => {
            deleteMutation.mutate()
        },
        reject: () => {}
    })
}
</script>

<template>
    <div>
        <div class="flex justify-end gap-4">
            <Button
                label="Удалить баннер"
                :disabled="disabled"
                icon="pi pi-times"
                severity="danger"
                @click="confirmDelete"
            />
        </div>
    </div>
</template>
