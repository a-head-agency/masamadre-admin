import { z } from 'zod'

export const CUDScheme = z.object({
    created_at: z.string(),
    updated_at: z.string(),
    deleted_at: z.string().nullable()
})
