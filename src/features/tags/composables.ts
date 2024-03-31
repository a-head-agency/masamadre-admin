import { type MaybeRef } from 'vue'
import { useMutation, useQuery, useQueryClient } from '@tanstack/vue-query'
import type { ITag } from './interfaces'

import { axiosPrivate } from '@/network'
import { useToast } from 'primevue/usetoast'

interface GetTagsResponse {
    list: ITag[]
    total: number
}

interface QueryConfig {
    offset: MaybeRef<number>
    limit: MaybeRef<number>
    search: MaybeRef<string>
}

export const useTags = <SData>(
    queryConfig: QueryConfig,
    selector?: (response: GetTagsResponse) => SData
) => {
    const { offset, limit, search } = queryConfig
    return useQuery({
        queryKey: ['tags', { offset, limit, search }] as any,
        queryFn: async ({ queryKey }) => {
            const response = await axiosPrivate.get<GetTagsResponse>('admin/tags', {
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

export const useCreateTag = () => {
    const toast = useToast()
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (vars: any) => axiosPrivate.post('admin/tag', vars),
        onSuccess(_, vars) {
            toast.add({
                severity: 'success',
                life: 3000,
                summary: 'Успешно',
                detail: `Создан тег ${vars.name}`
            })
            queryClient.invalidateQueries(['tags'])
        },
        onError(error: any) {
            toast.add({
                severity: 'error',
                life: 3000,
                summary: 'Не удалось создать тег',
                detail: error
            })
        }
    })
}

export const useUpdateTag = () => {
    const toast = useToast()
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (vars: any) => axiosPrivate.put('admin/tag', vars),
        onSuccess(_, vars) {
            toast.add({
                severity: 'success',
                life: 3000,
                summary: 'Успешно',
                detail: `Изменен тег ${vars.name}`
            })
            queryClient.invalidateQueries(['tags'])
        },
        onError(error: any) {
            toast.add({
                severity: 'error',
                life: 3000,
                summary: 'Не удалось Изменен тег',
                detail: error
            })
        }
    })
}

// export const useDeleteRestaurant = () => {
//   const toast = useToast()
//   const queryClient = useQueryClient()

//   return useMutation({
//     mutationFn: (vars: { id: number; name: string }) =>
//       new Promise((res, rej) =>
//         setTimeout(() => res('Restaurant deletion route is not implemented.'), 1000)
//       ),
//     onSuccess(_, vars) {
//       toast.add({
//         severity: 'success',
//         life: 3000,
//         summary: 'Успешно',
//         detail: `Удален ресторан ${vars.name} (id: ${vars.id})`
//       })
//       queryClient.invalidateQueries(['rests'])
//     },
//     onError(error: any) {
//       toast.add({
//         severity: 'error',
//         life: 3000,
//         summary: 'Не удалось удалить ресторан',
//         detail: error
//       })
//     }
//   })
// }

// export const useUpdateRestaurant = () => {
//   const toast = useToast()
//   const queryClient = useQueryClient()

//   return useMutation({
//     mutationFn: async (vars: any) => Promise.reject('Restaurant update route is not implemented.'),
//     onSuccess(_, vars) {
//       toast.add({
//         severity: 'success',
//         life: 3000,
//         summary: 'Успешно',
//         detail: `Изменен ресторан ${vars.name} (id: ${vars.id})`
//       })
//       queryClient.invalidateQueries(['rests'])
//     },
//     onError(error: any) {
//       toast.add({
//         severity: 'error',
//         life: 3000,
//         summary: 'Не удалось изменить ресторан',
//         detail: error
//       })
//     }
//   })
// }
