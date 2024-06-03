import type { GetListConfigWithSearch } from '@/common/types'
import { axiosPrivate } from '@/network'
import { z } from 'zod'
import { ListedCategoryScheme } from './schemes'

export type GetListConfig = Omit<GetListConfigWithSearch, 'limit' | 'offset'>

export async function getList(config: GetListConfig) {
    const schema = z.object({
        list: ListedCategoryScheme.array(),
        total: z.number()
    })
    const response = await axiosPrivate.get('admin/categories', {
        params: {
            offset: 0,
            limit: 999999999,
            search: config.search
        }
    })
    const data = schema.parse(response.data)
    data.total = data.list.length
    return data
}
