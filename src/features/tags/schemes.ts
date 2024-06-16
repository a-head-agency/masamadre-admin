import { z } from 'zod'

import { CUDScheme } from '@/common/schemes'

export const ListedTagScheme = CUDScheme.extend({
    id: z.number(),
    name: z.string(),
    img: z.string(),
    active: z.boolean()
})
