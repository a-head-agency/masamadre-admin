import { useMutation, useQueryClient } from '@tanstack/vue-query'

import { axiosPrivate } from '@/network'
import { useToast } from 'primevue/usetoast'

export const useCreateRestaurant = () => {
    const toast = useToast()
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (vars: any) => axiosPrivate.post('admin/rest', vars),
        onSuccess(_, vars) {
            toast.add({
                severity: 'success',
                life: 3000,
                summary: 'Успешно',
                detail: `Добавлен ресторан ${vars.name}`
            })
            queryClient.invalidateQueries({ queryKey: ['rests'] })
        },
        onError(error: any) {
            toast.add({
                severity: 'error',
                life: 3000,
                summary: 'Не удалось создать ресторан',
                detail: error
            })
        }
    })
}

export const useDeleteRestaurant = () => {
    const toast = useToast()
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (vars: { id: number; name: string }) => {
            const response = axiosPrivate.delete('admin/rest', {
                params: { id: vars.id }
            })
            return response
        },
        onSuccess(_, vars) {
            toast.add({
                severity: 'success',
                life: 3000,
                summary: 'Успешно',
                detail: `Удален ресторан ${vars.name} (id: ${vars.id})`
            })
            queryClient.invalidateQueries({ queryKey: ['rests'] })
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
}

export const useUpdateRestaurant = () => {
    const toast = useToast()
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: async (vars: any) =>
            Promise.reject('Restaurant update route is not implemented.'),
        onSuccess(_, vars) {
            toast.add({
                severity: 'success',
                life: 3000,
                summary: 'Успешно',
                detail: `Изменен ресторан ${vars.name} (id: ${vars.id})`
            })
            queryClient.invalidateQueries({ queryKey: ['rests'] })
        },
        onError(error: any) {
            toast.add({
                severity: 'error',
                life: 3000,
                summary: 'Не удалось изменить ресторан',
                detail: error
            })
        }
    })
}
