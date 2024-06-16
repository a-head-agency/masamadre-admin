import { useMutation, useQueryClient } from '@tanstack/vue-query'

import { useToast } from 'primevue/usetoast'

import { axiosPrivate } from '@/common/network'

export const useCreateCategory = () => {
    const toast = useToast()
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (vars: any) => axiosPrivate.post('admin/category', vars),
        onSuccess(_, vars) {
            toast.add({
                severity: 'success',
                life: 3000,
                summary: 'Успешно',
                detail: `Добавлена категория ${vars.name}`
            })
            queryClient.invalidateQueries({ queryKey: ['categories'] })
        },
        onError(error: any) {
            toast.add({
                severity: 'error',
                life: 3000,
                summary: 'Не удалось создать категорию',
                detail: error
            })
        }
    })
}

export const useDeleteCategory = () => {
    const toast = useToast()
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: async (vars: { id: number; name: string }) => {
            const response = await axiosPrivate.delete('admin/category', {
                params: {
                    id: vars.id
                }
            })
            return response
        },
        onSuccess(_, vars) {
            toast.add({
                severity: 'success',
                life: 3000,
                summary: 'Успешно',
                detail: `Удалена категория ${vars.name} (id: ${vars.id})`
            })
            queryClient.invalidateQueries({ queryKey: ['categories'] })
        },
        onError(error: any) {
            toast.add({
                severity: 'error',
                life: 3000,
                summary: 'Не удалось удалить категорию',
                detail: error
            })
        }
    })
}

export const useUpdateCategory = () => {
    const toast = useToast()
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: async (vars: any) => {
            const response = await axiosPrivate.put('admin/category', vars)
            return response.data
        },
        onSuccess(_, vars) {
            toast.add({
                severity: 'success',
                life: 3000,
                summary: 'Успешно',
                detail: `Изменена категория ${vars.name} (id: ${vars.id})`
            })
            queryClient.invalidateQueries({ queryKey: ['categories'] })
        },
        onError(error: any) {
            toast.add({
                severity: 'error',
                life: 3000,
                summary: 'Не удалось изменить категорию',
                detail: error
            })
        }
    })
}

export interface SaveCategoriesOrderingMutation {
    positions: {
        id: number
        position: number
    }[]
    category_id: number
}

export const useSaveCategoriesOrdering = () => {
    const queryClient = useQueryClient()
    const toast = useToast()

    return useMutation({
        mutationFn: async (vals: SaveCategoriesOrderingMutation) => {
            const response = await axiosPrivate.post('admin/category/positions', vals)
            return response.data
        },
        onSuccess() {
            toast.add({
                severity: 'success',
                life: 3000,
                summary: 'Успешно',
                detail: `Порядок категорий сохранён.`
            })
            queryClient.invalidateQueries({ queryKey: ['categories'] })
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
