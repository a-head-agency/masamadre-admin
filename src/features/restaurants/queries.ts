import { createQueryKeys } from '@lukemorales/query-key-factory'
import { RestsService } from '.'
import type { GetIden, GetListConfigWithSearch } from '@/common/types'

export const queries = createQueryKeys('rests', {
    list: (config: GetListConfigWithSearch) => ({
        queryKey: [{ config }],
        queryFn: () => RestsService.getList(config)
    }),
    detail: (config: GetIden) => ({
        queryKey: [{ config }],
        queryFn: async () => {
            return await RestsService.getDetailed(config)
        }
    })
})
