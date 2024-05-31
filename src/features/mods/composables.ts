import { type MaybeRef } from 'vue'
import { useMutation, useQuery, useQueryClient } from '@tanstack/vue-query'
import type { IMod } from './interfaces'

import { axiosPrivate } from '@/network'
import { useToast } from 'primevue/usetoast'

interface GetModsResponse {
    list: IMod[]
    total: number
}

interface QueryConfig {
    offset: MaybeRef<number>
    limit: MaybeRef<number>
    search: MaybeRef<string>
}

export const useMods = <SData>(
    queryConfig: QueryConfig,
    selector?: (response: GetModsResponse) => SData
) => {
    const { offset, limit, search } = queryConfig
    return useQuery({
        queryKey: ['mods', { offset, limit, search }] as any,
        queryFn: async ({ queryKey }) => {
            const response = await axiosPrivate.get<GetModsResponse>('admin/mods', {
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

export const useCreateMod = () => {
    const toast = useToast()
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (vars: any) => axiosPrivate.post('admin/mod', vars),
        onSuccess(_, vars) {
            toast.add({
                severity: 'success',
                life: 3000,
                summary: 'Успешно',
                detail: `Создан модификатор ${vars.name}`
            })
            queryClient.invalidateQueries(['mods'])
        },
        onError(error: any) {
            toast.add({
                severity: 'error',
                life: 3000,
                summary: 'Не удалось создать модификатор',
                detail: error
            })
        }
    })
}

export const useUpdateMod = () => {
    const toast = useToast()
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (vars: any) => axiosPrivate.put('admin/mod', vars),
        onSuccess(_, vars) {
            toast.add({
                severity: 'success',
                life: 3000,
                summary: 'Успешно',
                detail: `Изменен модификатор ${vars.name}`
            })
            queryClient.invalidateQueries(['mods'])
        },
        onError(error: any) {
            toast.add({
                severity: 'error',
                life: 3000,
                summary: 'Не удалось изменить модификатор',
                detail: error
            })
        }
    })
}

export const useDeleteMod = () => {
    const toast = useToast()
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (vars: any) => axiosPrivate.delete('admin/mod', {
            params: {
                id: vars.id
            }
        }),
        onSuccess(_, vars) {
            toast.add({
                severity: 'success',
                life: 3000,
                summary: 'Успешно',
                detail: `Удалён модификатор ${vars.name}`
            })
            queryClient.invalidateQueries(['mods'])
        },
        onError(error: any) {
            toast.add({
                severity: 'error',
                life: 3000,
                summary: 'Не удалось удалить модификатор',
                detail: error
            })
        }
    })
}