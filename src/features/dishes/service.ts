import { z } from 'zod'

import { axiosPrivate } from '@/common/network'
import type { GetIden, GetListConfigWithSearch } from '@/common/types'

import * as DishesSchemes from './schemes'

export interface GetListConfigDishes extends GetListConfigWithSearch {
    categoryID: number
}

export async function getList(config: GetListConfigDishes) {
    const schema = z.object({
        list: DishesSchemes.ListedDishScheme.array(),
        total: z.number()
    })
    const response = await axiosPrivate.get('admin/dishes', {
        params: {
            offset: config.offset,
            limit: config.categoryID ? 999999999 : config.limit,
            search: config.search,
            id: config.categoryID
        }
    })

    const data = schema.parse(response.data)

    if (config.categoryID) {
        // total либо отсутсвует либо не соответсвует данным,
        // поэтому просто выставляем total равным длинне массива list
        data.total = data.list.length
    }
    return data
}

export async function getDetailed(config: GetIden) {
    const response = await axiosPrivate.get('admin/dish', {
        params: {
            id: config.id
        }
    })
    const data = DishesSchemes.DetailedDishScheme.parse(response.data)
    return data
}
