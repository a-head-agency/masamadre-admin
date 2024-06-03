import { CUDScheme } from '@/common/schemes'
import { z } from 'zod'

export const ListedRestScheme = CUDScheme.extend({
    id: z.number(),
    name: z.string(),
    active: z.boolean(),
    adres: z.string().optional()
})

export const DetailedRestScheme = ListedRestScheme.extend({
    org_id: z.string().optional(),
    terminal_id: z.string().optional(),
    curier_card: z.string().optional(),
    online: z.string().optional(),
    cash: z.string().optional(),
    type_rest: z.string().optional(),
    type_curier: z.string().optional(),
    lat: z.number().optional(),
    lng: z.number().optional(),
    geo: z.string().optional(),

    yookassa_id: z.string().optional(),
    yookassa_key: z.string().optional(),

    mon_from: z.number().optional(),
    mon_to: z.number().optional(),
    thu_from: z.number().optional(),
    thu_to: z.number().optional(),
    wed_from: z.number().optional(),
    wed_to: z.number().optional(),
    thurs_from: z.number().optional(),
    thurs_to: z.number().optional(),
    fri_from: z.number().optional(),
    fri_to: z.number().optional(),
    sat_from: z.number().optional(),
    sat_to: z.number().optional(),
    sun_from: z.number().optional(),
    sun_to: z.number().optional()
})
