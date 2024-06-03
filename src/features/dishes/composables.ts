import { axiosPrivate } from '@/network'
import { useMutation, useQueryClient } from '@tanstack/vue-query'
import { useToast } from 'primevue/usetoast'
import { queries } from './queries'

export const useCreateDish = () => {
    const toast = useToast()
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: async (vars: any) => {
            const response = await axiosPrivate.post('admin/dish', vars)
            return response
        },
        onSuccess(_, vars) {
            toast.add({
                severity: 'success',
                life: 3000,
                summary: 'Успешно',
                detail: `Добавлено блюдо ${vars.name}`
            })
            queryClient.invalidateQueries({
                queryKey: queries._def
            })
        },
        onError(error: any) {
            toast.add({
                severity: 'error',
                life: 3000,
                summary: 'Не удалось создать блюдо',
                detail: error
            })
        }
    })
}

export const useUpdateDish = () => {
    const toast = useToast()
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: async (vars: any) => {
            const response = await axiosPrivate.put('admin/dish', vars)
            return response
        },
        onSuccess(_, vars) {
            toast.add({
                severity: 'success',
                life: 3000,
                summary: 'Успешно',
                detail: `Обновлено блюдо ${vars.name}`
            })
            queryClient.invalidateQueries({
                queryKey: queries._def
            })
        },
        onError(error: any) {
            toast.add({
                severity: 'error',
                life: 3000,
                summary: 'Не удалось обновить блюдо',
                detail: error
            })
        }
    })
}

export interface SaveDishesOrderingMutation {
    positions: {
        id: number
        position: number
    }[]
    category_id: number
}

export const useSaveDishesOrdering = () => {
    const queryClient = useQueryClient()
    const toast = useToast()

    return useMutation({
        mutationFn: async (vals: SaveDishesOrderingMutation) => {
            const response = await axiosPrivate.post('admin/dishes/positions', vals)
            return response.data
        },
        onSuccess() {
            toast.add({
                severity: 'success',
                life: 3000,
                summary: 'Успешно',
                detail: `Порядок блюд сохранён.`
            })
            queryClient.invalidateQueries({
                queryKey: queries._def
            })
        },
        onError(error: any) {
            toast.add({
                severity: 'error',
                life: 3000,
                summary: 'Не удалось сохранить порядок',
                detail: error
            })
        }
    })
}

export const useDeleteDish = () => {
    const queryClient = useQueryClient()
    const toast = useToast()

    return useMutation({
        mutationFn: (vals: { id: number; name: string }) =>
            axiosPrivate.delete('admin/dish', {
                params: {
                    id: vals.id
                }
            }),
        onSuccess(_, vals) {
            toast.add({
                severity: 'success',
                life: 3000,
                summary: 'Успешно',
                detail: `Удалено блюдо ${vals.name} (id: ${vals.id})`
            })
            queryClient.invalidateQueries({
                queryKey: queries._def
            })
        },
        onError(error: any) {
            toast.add({
                severity: 'error',
                life: 3000,
                summary: 'Не удалось удалить блюдо',
                detail: error
            })
        }
    })
}
