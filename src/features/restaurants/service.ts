import { z } from 'zod'

import { axiosPrivate } from '@/common/network'
import type { GetIden, GetListConfigWithSearch } from '@/common/types'

import * as RestsSchemes from './schemes'

export async function getList(config: GetListConfigWithSearch) {
    const schema = z.object({
        list: RestsSchemes.ListedRestScheme.array(),
        total: z.number()
    })
    const response = await axiosPrivate.get('admin/rests', {
        params: {
            offset: config.offset,
            limit: config.limit,
            search: config.search
        }
    })

    const data = schema.parse(response.data)
    return data
}

export async function getDetailed(config: GetIden) {
    const response = await axiosPrivate.get('admin/rest', {
        params: {
            id: config.id
        }
    })
    const data = RestsSchemes.DetailedRestScheme.parse(response.data)
    return data
}
