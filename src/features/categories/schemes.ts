import { z } from 'zod'

import { CUDScheme } from '@/common/schemes'

export const ListedCategoryScheme = CUDScheme.extend({
    id: z.number(),
    name: z.string(),
    active: z.boolean(),
    type: z.number(),
    subtitle: z.string(),
    title: z.string(),
    show_title: z.boolean(),
    description_seo: z.string(),
    keywords: z.string(),
    link: z.string()
})

export const DetailedDishScheme = ListedCategoryScheme.extend({})
