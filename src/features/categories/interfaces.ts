export interface ICreateCategory {
    name: string
}

export interface ICategory {
    id: number
    created_at: string
    updated_at: string
    deleted_at: string | null
    name: string
    active: boolean
    addable: boolean
    link: string | undefined
    keywords: string | undefined
    description_seo: string | undefined
    title: string | undefined
    type: number | undefined
    show_title: boolean
}

export interface IUpdateCategory {
    id: number
    name: string
}
