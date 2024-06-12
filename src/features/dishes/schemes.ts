import { z } from 'zod'

import { TagsSchemes } from '@/features/tags'

import { CUDScheme } from '@/common/schemes'
import { ModsSchemes } from '../mods'

export const ModGroupScheme = z.object({
    id: z.number(),
    name: z.string(),
    modificators: ModsSchemes.ListedModScheme.array(),
    type: z.string()
})

export const ListedDishScheme = CUDScheme.extend({
    active: z.boolean(),
    belki: z.number(),
    can_deliver: z.boolean(),
    color: z.number(),
    count: z.number(),
    created_at: z.string(),
    deleted_at: z.string().nullable(),
    description: z.string(),
    energ_cen: z.number(),
    from_hour: z.number(),
    have: z.boolean(),
    id: z.number(),
    rkeeper_id: z.string(),
    img: z.string(),
    name: z.string(),
    pich_cen: z.number(),
    price: z.number(),
    size: z.number(),
    to_hour: z.number(),
    uglevodi: z.number(),
    updated_at: z.string(),
    weight: z.number(),
    ziri: z.number(),
    link: z.string().optional(),
    keywords: z.string().optional(),
    description_seo: z.string().optional(),
    title: z.string().optional(),
    alt: z.string().optional(),
    iiko_sale_id: z.string().optional(),
    make_date: z.string(),
    short_description: z.string().optional(),
    content: z.string().optional(),
    alerg: z.string().optional(),
    date_contain: z.string().optional()
})

export const DetailedDishScheme = ListedDishScheme.extend({
    categories: z.number().array(),
    images: z.string().array(),
    tags: TagsSchemes.ListedTagScheme.array(),
    vars: CUDScheme.extend({
        id: z.number(),
        active: z.boolean(),
        can_deliver: z.boolean(),
        can_order: z.boolean(),
        have: z.boolean(),
        in_rest: z.boolean(),
        dish_id: z.number(),
        price: z.number(),
        rest_id: z.number(),
        rest_name: z.string().optional(),
        rest_address: z.string().optional()
    }).array(),
    mod_group: ModGroupScheme.array()
})
