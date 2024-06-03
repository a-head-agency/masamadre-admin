import { CUDScheme } from '@/common/schemes'
import { z } from 'zod'

export const ListedModScheme = CUDScheme.extend({
    id: z.number(),
    name: z.string(),
    price: z.number(),
    rkeeper_group_id: z.string(),
    rkeeper_id: z.string(),
    active: z.boolean()
})
