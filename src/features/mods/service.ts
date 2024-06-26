import { z } from 'zod'

import { axiosPrivate } from '@/common/network'
import type { GetListConfigWithSearch } from '@/common/types'

import { ListedModScheme } from './schemes'

export type GetListConfig = GetListConfigWithSearch

export async function getList(config: GetListConfig) {
    const schema = z.object({
        list: ListedModScheme.array(),
        total: z.number()
    })

    const response = await axiosPrivate.get('admin/mods', {
        params: {
            offset: config.offset,
            limit: config.limit,
            search: config.search
        }
    })

    const data = schema.parse(response.data)
    return data
}
