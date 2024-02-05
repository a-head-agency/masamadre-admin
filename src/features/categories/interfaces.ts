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
}

export interface IUpdateCategory {
    id: number
    name: string
}
