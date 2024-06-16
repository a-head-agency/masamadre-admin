import { z } from 'zod'

import { CUDScheme } from '@/common/schemes'

export const ListedModScheme = CUDScheme.extend({
    id: z.number(),
    name: z.string(),
    price: z.number(),
    rkeeper_id: z.string(),
    active: z.boolean()
})
