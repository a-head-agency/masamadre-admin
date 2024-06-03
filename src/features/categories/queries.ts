import { createQueryKeys } from '@lukemorales/query-key-factory'
import { getList, type GetListConfig } from './service'

export const queries = createQueryKeys('categories', {
    list: (config: GetListConfig) => ({
        queryKey: [{ config }],
        queryFn: () => getList(config)
    })
})
