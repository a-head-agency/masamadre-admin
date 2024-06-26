import { createQueryKeys } from '@lukemorales/query-key-factory'

import { queryClient } from '@/common/query-client'
import type { GetIden } from '@/common/types'

import { RestsQueries } from '@/features/restaurants'

import { getDetailed, getList, type GetListConfigDishes } from './service'

export const queries = createQueryKeys('dishes', {
    list: (config: GetListConfigDishes) => ({
        queryKey: [{ config }],
        queryFn: () => getList(config)
    }),
    detail: (config: GetIden) => ({
        queryKey: [{ config }],
        queryFn: async () => {
            const [rests, data] = await Promise.all([
                queryClient.ensureQueryData(
                    RestsQueries.list({ offset: 0, limit: 999999999, search: '' })
                ),
                getDetailed(config)
            ])

            for (const v of data.vars) {
                const rest = rests.list.find((r) => r.id === v.rest_id)
                if (!rest) {
                    throw new Error(
                        `Ресторан с ID = ${v.rest_id} не найден, хотя существует вариация блюда в которой он указан: `
                    )
                }
                v.rest_name = rest.name
                v.rest_address = rest.adres
            }

            return data
        }
    })
})
