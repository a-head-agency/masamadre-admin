export interface IAddition {
    category: number
    count: number
    created_at: string
    deleted_at: string | null
    id: number
    img: string
    name: string
    price: number
    updated_at: string
    weight: number
    vars: {
        id: number
        rest_id: number
        rest_name: string
        rest_address: string
        price: number
        active: boolean
        can_deliver: boolean
        have: boolean
    }[]
}
