import { type MaybeRef } from 'vue'
import { useMutation, useQuery, useQueryClient } from '@tanstack/vue-query'
import type { ICategory } from './interfaces'

import { axiosPrivate } from '@/network'
import { useToast } from 'primevue/usetoast'

interface GetCategoriesResponse {
    list: ICategory[]
    total: number
}

interface QueryConfig {
    offset: MaybeRef<number>
    limit: MaybeRef<number>
    search: MaybeRef<string>
}

export const useCategories = <SData>(
    queryConfig: QueryConfig,
    selector?: (response: GetCategoriesResponse) => SData
) => {
    const { offset, limit, search } = queryConfig
    return useQuery({
        queryKey: ['categories', { offset, limit, search }] as any,
        queryFn: async ({ queryKey }) => {
            const response = await axiosPrivate.get<GetCategoriesResponse>('admin/categories', {
                params: {
                    offset: (queryKey[1] as any).offset as number,
                    limit: (queryKey[1] as any).limit as number,
                    search: (queryKey[1] as any).search as string
                }
            })
            response.data.total = response.data.list.length
            return response.data
        },
        select: selector,
        keepPreviousData: true
    })
}

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
            queryClient.invalidateQueries(['categories'])
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
            queryClient.invalidateQueries(['categories'])
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
            queryClient.invalidateQueries(['categories'])
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

export const useAdditionsCategory = () => {
    return useCategories(
        {
            limit: 99999999,
            offset: 0,
            search: ''
        },
        (v) => {
            return v.list.find((t) => t.addable)
        }
    )
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
            queryClient.invalidateQueries(['categories'])
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
