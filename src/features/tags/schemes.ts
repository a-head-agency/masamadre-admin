import { CUDScheme } from '@/common/schemes'
import { z } from 'zod'

export const ListedTagScheme = CUDScheme.extend({
    id: z.number(),
    name: z.string(),
    img: z.string(),
    active: z.boolean()
})
