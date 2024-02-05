import { computed, unref, type MaybeRef } from 'vue'
import { useQuery, useQueryClient } from '@tanstack/vue-query'
import { axiosPrivate } from '@/network'
import { pad } from '@/utils'

interface GetStatsResponse {
    clients_
    last_
    new_clients: number
    new_reviews: number
    orders: number

    stats: {
        id: number
        date: string
        new_users: number
        date_int: number
        created_at: string | null
        updated_at: string | null
        deleted_at: string | null
    }[]
}

interface QueryConfig {
    from: MaybeRef<Date>
    to: MaybeRef<Date>
}

export const useStats = <SData>(queryConfig: QueryConfig, selector?: (response: any) => SData) => {
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
        queryFn: async () => {
            return {
                clients_count: 3,
                last_price: 1900,
                new_clients: 63,
                new_reviews: 63,
                orders: 75,
                price: 83065,
                stats: [
                    {
                        id: 1,
                        created_at: '2024-01-28T16:20:26.663+03:00',
                        updated_at: '2024-01-28T18:54:16.751+03:00',
                        deleted_at: null,
                        date: '28-1-2024',
                        date_int: 1706448026,
                        new_users: 4
                    },
                    {
                        id: 2,
                        created_at: '2024-01-29T04:04:04.081+03:00',
                        updated_at: '2024-01-29T23:08:11.6+03:00',
                        deleted_at: null,
                        date: '29-1-2024',
                        date_int: 1706490244,
                        new_users: 16,
                        new_reviews: 2
                    },
                    {
                        id: 3,
                        created_at: '2024-01-30T02:31:14.165+03:00',
                        updated_at: '2024-01-30T23:23:49.604+03:00',
                        deleted_at: null,
                        date: '30-1-2024',
                        date_int: 1706571074,
                        price: 8190,
                        count: 7,
                        new_users: 7,
                        new_reviews: 1
                    },
                    {
                        id: 4,
                        created_at: '2024-01-31T07:03:32.985+03:00',
                        updated_at: '2024-01-31T21:19:44.466+03:00',
                        deleted_at: null,
                        date: '31-1-2024',
                        date_int: 1706673812,
                        price: 51960,
                        count: 51,
                        new_users: 27
                    },
                    {
                        id: 5,
                        created_at: '2024-02-01T08:41:35.658+03:00',
                        updated_at: '2024-02-01T15:23:46.159+03:00',
                        deleted_at: null,
                        date: '1-2-2024',
                        date_int: 1706766095,
                        price: 6975,
                        count: 6,
                        new_users: 5
                    },
                    {
                        id: 6,
                        created_at: '2024-02-02T12:48:52.837+03:00',
                        updated_at: '2024-02-02T21:37:19.393+03:00',
                        deleted_at: null,
                        date: '2-2-2024',
                        date_int: 1706867332,
                        price: 10210,
                        count: 7
                    },
                    {
                        id: 7,
                        created_at: '2024-02-03T01:28:00.858+03:00',
                        updated_at: '2024-02-03T11:06:32.563+03:00',
                        deleted_at: null,
                        date: '3-2-2024',
                        date_int: 1706912880,
                        price: 1470,
                        count: 1,
                        new_users: 1
                    },
                    {
                        id: 8,
                        created_at: '2024-02-04T10:24:55.792+03:00',
                        updated_at: '2024-02-04T23:02:00.339+03:00',
                        deleted_at: null,
                        date: '4-2-2024',
                        date_int: 1707031495,
                        price: 4260,
                        count: 3,
                        new_users: 3
                    }
                ]
            } as any

            // const response = await axiosPrivate.post<GetStatsResponse>('admin/stats', {
            //     from: (queryKey[1] as any).from,
            //     to: (queryKey[1] as any).to
            // })

            // return response.data
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
