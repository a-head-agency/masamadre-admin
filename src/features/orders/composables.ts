import { type MaybeRef } from 'vue'
import { useMutation, useQuery, useQueryClient } from '@tanstack/vue-query'
import type { IOrder } from './interfaces'

import { axiosPrivate } from '@/network'
import { useToast } from 'primevue/usetoast'

interface GetOrdersResponse {
    list: IOrder[]
    total: number
}

interface QueryConfig {
    offset: MaybeRef<number>
    limit: MaybeRef<number>
    search: MaybeRef<string>
}

export const useOrders = <SData>(
    queryConfig: QueryConfig,
    selector?: (response: GetOrdersResponse) => SData
) => {
    const { offset, limit, search } = queryConfig
    return useQuery({
        queryKey: ['orders', { offset, limit, search }] as any,
        queryFn: async ({ queryKey }) => {
            return {
                list: [],
                total: 0
            } satisfies GetOrdersResponse
            const response = await axiosPrivate.get<GetOrdersResponse>('admin/orders', {
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

export const useUpdateOrderStatus = () => {
    const toast = useToast()
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (vars: any) => axiosPrivate.post('admin/order', vars),
        onSuccess(_, vars) {
            toast.add({
                severity: 'success',
                life: 3000,
                summary: 'Успешно',
                detail: `Изменен статус заказа (id: ${vars.id})`
            })
            queryClient.invalidateQueries(['orders'])
        },
        onError(error: any) {
            toast.add({
                severity: 'error',
                life: 3000,
                summary: 'Не удалось изменить статус',
                detail: error
            })
        }
    })
}

export const useOrder = (id: MaybeRef<number | undefined>) => {
    return useQuery({
        queryKey: ['orders', { id }],
        queryFn: async ({ queryKey }) => {
            console.log({ queryKey })
            const orderId = (queryKey[1] as any).id
            const response = await axiosPrivate.get('admin/order', {
                params: {
                    id: orderId
                }
            })
            console.log(response.data)
            return response.data
        }
    })
}
