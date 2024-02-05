import { type MaybeRef } from 'vue'
import { useMutation, useQuery, useQueryClient } from '@tanstack/vue-query'
import type { IRestaurant } from './interfaces'

import { axiosPrivate } from '@/network'
import { useToast } from 'primevue/usetoast'

interface GetRestaurantsResponse {
    list: IRestaurant[]
    total: number
}

interface QueryConfig {
    offset: MaybeRef<number>
    limit: MaybeRef<number>
    search: MaybeRef<string>
}

export const useRestaurants = <SData>(
    queryConfig: QueryConfig,
    selector?: (response: GetRestaurantsResponse) => SData
) => {
    const { offset, limit, search } = queryConfig
    return useQuery({
        queryKey: ['rests', { offset, limit, search }] as any,
        queryFn: async ({ queryKey }) => {
            return {
                list: [],
                total: 0
            } satisfies GetRestaurantsResponse
            const response = await axiosPrivate.get<GetRestaurantsResponse>('admin/rests', {
                params: {
                    offset: (queryKey[1] as any).offset as number,
                    limit: (queryKey[1] as any).limit as number,
                    search: (queryKey[1] as any).search as string
                }
            })
            return response.data
        },
        select: selector,
        keepPreviousData: true
    })
}

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
            queryClient.invalidateQueries(['rests'])
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
        mutationFn: (vars: { id: number; name: string }) =>
            new Promise((res, rej) =>
                setTimeout(() => res('Restaurant deletion route is not implemented.'), 1000)
            ),
        onSuccess(_, vars) {
            toast.add({
                severity: 'success',
                life: 3000,
                summary: 'Успешно',
                detail: `Удален ресторан ${vars.name} (id: ${vars.id})`
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
            queryClient.invalidateQueries(['rests'])
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
