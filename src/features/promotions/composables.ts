import type { MaybeRef } from 'vue'

import { useMutation, useQuery, useQueryClient } from '@tanstack/vue-query'

import { useToast } from 'primevue/usetoast'

import { axiosPrivate } from '@/common/network'

export interface IPromotion {
    id: number
    created_at: string | null
    updated_at: string | null
    deleted_at: string | null
    start: string
    end: string
    img: string
    name: string
    text: string
    active: boolean
}

interface GetPromotionsResponse {
    list: IPromotion[]
    total: number
}

interface QueryConfig {
    offset: MaybeRef<number>
    limit: MaybeRef<number>
}

export const usePromotions = <SData>(
    queryConfig: QueryConfig,
    selector?: (response: GetPromotionsResponse) => SData
) => {
    const { offset, limit } = queryConfig
    return useQuery({
        queryKey: ['promotions', { offset, limit }] as any,
        queryFn: async ({ queryKey }) => {
            const response = await axiosPrivate.get<GetPromotionsResponse>('admin/promos', {
                params: {
                    offset: (queryKey[1] as any).offset as number,
                    limit: (queryKey[1] as any).limit as number
                }
            })
            return response.data
        },
        select: selector,
        placeholderData: (v) => v
    })
}

type GetPromotionResponse = IPromotion

export const usePromotion = <SData>(
    id: MaybeRef<number>,
    selector?: (response: GetPromotionResponse) => SData
) => {
    return useQuery({
        queryKey: ['promotions', { id }] as any,
        queryFn: async ({ queryKey }) => {
            const response = await axiosPrivate.get<GetPromotionResponse>('admin/promo', {
                params: {
                    id: (queryKey[1] as any).id as number
                }
            })
            return response.data
        },
        select: selector,
        placeholderData: (v) => v
    })
}

export const useCreatePromotion = () => {
    const toast = useToast()
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: async (vars: any) => {
            const response = await axiosPrivate.post('admin/promo', vars)
            return response
        },
        onSuccess(_, vars) {
            toast.add({
                severity: 'success',
                life: 3000,
                summary: 'Успешно',
                detail: `Создана статья ${vars.name}`
            })
            queryClient.invalidateQueries({ queryKey: ['promotions'] })
        },
        onError(error: any) {
            toast.add({
                severity: 'error',
                life: 3000,
                summary: 'Не удалось создать акцию',
                detail: error
            })
        }
    })
}

export const useUpdatePromotion = () => {
    const toast = useToast()
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: async (vars: any) => {
            const response = await axiosPrivate.put('admin/promo', vars)
            return response
        },
        onSuccess(_, vars) {
            toast.add({
                severity: 'success',
                life: 3000,
                summary: 'Успешно',
                detail: `Обновлена акция ${vars.name}`
            })
            queryClient.invalidateQueries({ queryKey: ['promotions'] })
        },
        onError(error: any) {
            toast.add({
                severity: 'error',
                life: 3000,
                summary: 'Не удалось обновить акцию',
                detail: error
            })
        }
    })
}
