import { type MaybeRef } from 'vue'
import { useMutation, useQuery, useQueryClient } from '@tanstack/vue-query'
import type { IReview } from './interfaces'

import { axiosPrivate } from '@/network'
import { useToast } from 'primevue/usetoast'

interface GetReviewsResponse {
    list: IReview[]
    total: number
}

interface QueryConfig {
    offset: MaybeRef<number>
    limit: MaybeRef<number>
    search: MaybeRef<string>
}

export const useReviews = <SData>(
    queryConfig: QueryConfig,
    selector?: (response: GetReviewsResponse) => SData
) => {
    const { offset, limit, search } = queryConfig
    return useQuery({
        queryKey: ['reviews', { offset, limit, search }] as any,
        queryFn: async ({ queryKey }) => {
            const response = await axiosPrivate.get<GetReviewsResponse>('admin/reviews', {
                params: {
                    offset: (queryKey[1] as any).offset as number,
                    limit: (queryKey[1] as any).limit as number,
                    search: (queryKey[1] as any).search as string
                }
            })
            for (const review of response.data.list) {
                if (review.UserID) {
                    review.user_id = review.UserID
                }
            }
            return response.data
        },
        select: selector,
        keepPreviousData: true
    })
}

export const useChangeReviewStatus = () => {
    const toast = useToast()
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (vars: any) => axiosPrivate.post('admin/user/review', vars),
        onSuccess(_, vars) {
            toast.add({
                severity: 'success',
                life: 3000,
                summary: 'Успешно',
                detail: `Статус обращения id: ${vars.user_id} изменён`
            })
            queryClient.invalidateQueries(['reviews'])
        },
        onError(error: any) {
            toast.add({
                severity: 'error',
                life: 3000,
                summary: 'Не удалось изменить статус обращения',
                detail: error
            })
        }
    })
}
