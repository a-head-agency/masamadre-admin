import { type MaybeRef } from 'vue'
import { useMutation, useQuery, useQueryClient } from '@tanstack/vue-query'
import type { IStoryImage, IStoryVideo } from './interfaces'

import { axiosPrivate } from '@/network'
import { useToast } from 'primevue/usetoast'

type IStory = IStoryImage | IStoryVideo

interface GetStoriesResponse {
    list: IStory[]
    total: number
}

interface QueryConfig {
    offset: MaybeRef<number>
    limit: MaybeRef<number>
    search: MaybeRef<string>
}

export const useStories = <SData>(
    queryConfig: QueryConfig,
    selector?: (response: GetStoriesResponse) => SData
) => {
    const { offset, limit, search } = queryConfig
    return useQuery({
        queryKey: ['stories', { offset, limit, search }] as any,
        queryFn: async ({ queryKey }) => {
            return {
                list: [],
                total: 0
            } satisfies GetStoriesResponse
            const response = await axiosPrivate.get<GetStoriesResponse>('admin/stories', {
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
