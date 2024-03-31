import { computed, unref, type MaybeRef } from 'vue'
import { useQuery, useQueryClient } from '@tanstack/vue-query'
import { axiosPrivate } from '@/network'
import { pad } from '@/utils'

interface GetStatsResponse {
    clients_count: number
    last_price: number
    new_clients: number
    new_reviews: number
    orders: number
    price: number
    stats: { date: string; price: number; count: number; new_users: number }[]
}

interface QueryConfig {
    from: MaybeRef<Date>
    to: MaybeRef<Date>
}

export const useStats = <SData>(
    queryConfig: QueryConfig,
    selector?: (response: GetStatsResponse) => SData
) => {
    const { from, to } = queryConfig

    console.log(from, to)

    const _from = computed(
        () =>
            unref(from).getFullYear() +
            '-' +
            pad(unref(from).getMonth() + 1, 2) +
            '-' +
            pad(unref(from).getDate(), 2)
    )
    const _to = computed(
        () =>
            unref(to).getFullYear() +
            '-' +
            pad(unref(to).getMonth() + 1, 2) +
            '-' +
            pad(unref(to).getDate(), 2)
    )

    return useQuery({
        queryKey: ['stats', { from: _from, to: _to }] as any,
        queryFn: async ({ queryKey }) => {
            const response = await axiosPrivate.post<GetStatsResponse>('admin/stats', {
                from: (queryKey[1] as any).from,
                to: (queryKey[1] as any).to
            })

            return response.data
        },
        select: selector,
        keepPreviousData: true
    })
}

export const useInvalidateStats = () => {
    const queryClient = useQueryClient()

    return () => {
        queryClient.invalidateQueries(['stats'])
    }
}
