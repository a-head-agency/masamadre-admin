import { type MaybeRef } from 'vue'
import { useMutation, useQuery, useQueryClient } from '@tanstack/vue-query'
import type { IBanner } from './interfaces'

import { axiosPrivate } from '@/network'
import { useToast } from 'primevue/usetoast'

interface GetBannersResponse {
    list: IBanner[]
    total: number
}

interface QueryConfig {
    offset: MaybeRef<number>
    limit: MaybeRef<number>
    search: MaybeRef<string>
}

export const useBanners = <SData>(
    queryConfig: QueryConfig,
    selector?: (response: GetBannersResponse) => SData
) => {
    const { offset, limit, search } = queryConfig
    return useQuery({
        queryKey: ['banners', { offset, limit, search }] as any,
        queryFn: async ({ queryKey }) => {
            return {
                list: [],
                total: 0
            } satisfies GetBannersResponse
            const response = await axiosPrivate.get<GetBannersResponse>('admin/banners', {
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

export const useCreateBanner = () => {
    const toast = useToast()
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (vars: any) => axiosPrivate.post('admin/banner', vars),
        onSuccess() {
            toast.add({
                severity: 'success',
                life: 3000,
                summary: 'Успешно',
                detail: `Баннер создан`
            })
            queryClient.invalidateQueries(['banners'])
        },
        onError(error: any) {
            toast.add({
                severity: 'error',
                life: 3000,
                summary: 'Не удалось создать баннер',
                detail: error
            })
        }
    })
}

export const useUpdateBanner = () => {
    const toast = useToast()
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (vars: any) => axiosPrivate.put('admin/banner', vars),
        onSuccess() {
            toast.add({
                severity: 'success',
                life: 3000,
                summary: 'Успешно',
                detail: `Баннер изменён`
            })
            queryClient.invalidateQueries(['banners'])
        },
        onError(error: any) {
            toast.add({
                severity: 'error',
                life: 3000,
                summary: 'Не удалось изменить баннер',
                detail: error
            })
        }
    })
}

export const useDeleteBanner = () => {
    const toast = useToast()
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (vars: any) =>
            axiosPrivate.delete('admin/banner', {
                params: {
                    id: vars.id
                }
            }),
        onSuccess(_, vars) {
            toast.add({
                severity: 'success',
                life: 3000,
                summary: 'Успешно',
                detail: `Удален баннер (id: ${vars.id})`
            })
            queryClient.invalidateQueries(['banners'])
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
}
