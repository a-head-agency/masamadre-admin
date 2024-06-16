import { createQueryKeys } from '@lukemorales/query-key-factory'

import { getList, type GetListConfig } from './service'

export const queries = createQueryKeys('mods', {
    list: (config: GetListConfig) => ({
        queryKey: [{ config }],
        queryFn: () => getList(config)
    })
})
