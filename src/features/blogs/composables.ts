import type { MaybeRef } from 'vue'

import { useMutation, useQuery, useQueryClient } from '@tanstack/vue-query'

import { useToast } from 'primevue/usetoast'

import { axiosPrivate } from '@/common/network'

export interface IBlog {
    id: number
    created_at: string | null
    updated_at: string | null
    deleted_at: string | null
    name: string
    img: string
    text: string
}

interface GetBlogsResponse {
    list: IBlog[]
    total: number
}

interface QueryConfig {
    offset: MaybeRef<number>
    limit: MaybeRef<number>
}

export const useArticles = <SData>(
    queryConfig: QueryConfig,
    selector?: (response: GetBlogsResponse) => SData
) => {
    const { offset, limit } = queryConfig
    return useQuery({
        queryKey: ['blogs', { offset, limit }] as any,
        queryFn: async ({ queryKey }) => {
            const response = await axiosPrivate.get<GetBlogsResponse>('admin/blogs', {
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

type GetBlogResponse = IBlog

export const useArticle = <SData>(
    id: MaybeRef<number>,
    selector?: (response: GetBlogResponse) => SData
) => {
    return useQuery({
        queryKey: ['blogs', { id }] as any,
        queryFn: async ({ queryKey }) => {
            const response = await axiosPrivate.get<GetBlogResponse>('admin/blog', {
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

export const useCreateArticle = () => {
    const toast = useToast()
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: async (vars: any) => {
            const response = await axiosPrivate.post('admin/blog', vars)
            return response
        },
        onSuccess(_, vars) {
            toast.add({
                severity: 'success',
                life: 3000,
                summary: 'Успешно',
                detail: `Создана статья ${vars.name}`
            })
            queryClient.invalidateQueries({ queryKey: ['blogs'] })
        },
        onError(error: any) {
            toast.add({
                severity: 'error',
                life: 3000,
                summary: 'Не удалось создать статью',
                detail: error
            })
        }
    })
}

export const useUpdateArticle = () => {
    const toast = useToast()
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: async (vars: any) => {
            const response = await axiosPrivate.put('admin/blog', vars)
            return response
        },
        onSuccess(_, vars) {
            toast.add({
                severity: 'success',
                life: 3000,
                summary: 'Успешно',
                detail: `Обновлена статья ${vars.name}`
            })
            queryClient.invalidateQueries({ queryKey: ['blogs'] })
        },
        onError(error: any) {
            toast.add({
                severity: 'error',
                life: 3000,
                summary: 'Не удалось обновить статью',
                detail: error
            })
        }
    })
}
