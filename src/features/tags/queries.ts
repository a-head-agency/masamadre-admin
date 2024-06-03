import { createQueryKeys } from '@lukemorales/query-key-factory'
import { type GetListConfig, getList } from './service'

export const queries = createQueryKeys('tags', {
    list: (config: GetListConfig) => ({
        queryKey: [{ config }],
        queryFn: () => getList(config)
    })
})
