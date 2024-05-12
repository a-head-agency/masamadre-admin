import type { ITag } from '@/features/tags'
import type { ICategory } from '@/features/categories'

export interface IVariation {
    id: number
    rest_id: number
    rest_name: string
    rest_address: string
    price: number
    active: boolean
    can_deliver: boolean
    can_order: boolean
    in_rest: boolean
    have: boolean
}

export interface IDish {
    active: boolean
    belki: number
    can_deliver: boolean
    categories: ICategory[]
    color: number
    count: number
    created_at: string
    deleted_at: string | null
    description: string
    energ_cen: number
    from_hour: number
    have: boolean
    id: number
    rkeeper_id: string
    img: string
    name: string
    pich_cen: number
    price: number
    size: number
    to_hour: number
    uglevodi: number
    updated_at: string
    weight: number
    ziri: number
    link: string | undefined
    keywords: string | undefined
    description_seo: string | undefined
    title: string | undefined
    alt: string | undefined
    iiko_sale_id: string | undefined
    images: string[]
    make_date: string

    short_description: string | undefined
    content: string | undefined
    alerg: string | undefined
    date_contain: string | undefined

    tags: ITag[]

    vars: IVariation[]
}
