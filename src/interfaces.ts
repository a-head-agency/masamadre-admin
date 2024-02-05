export interface User {
    id: number
    name: string
    surname: string
    phone: string
    role: string
    status: string
    tolal_order: number
    bonuses: number
    last_update: string
}

export interface Dish {
    created_at: string
    deleted_at: string | null
    id: number
    updated_at: string
    active: boolean
    have: boolean
    img: string
    name: string
    price: number
}

export interface Review {
    id: number
    user_id: number
    text: string
    status: boolean
    create_date: string
}

export interface CreateDish {
    name: string | undefined
    description: string | undefined
    price: number | undefined
    sale_price: number | undefined
    img: string | undefined
    category_id: number | undefined
    iiko_id: number | undefined
    count: number | undefined
    weight: number | undefined
    energy: number | undefined
    belki: number | undefined
    ziri: number | undefined
    uglevodi: number | undefined
    color: string | undefined
    size: number | undefined
    have: boolean | undefined
    can_deliver: boolean | undefined
    active: boolean | undefined
}

export interface UpdateDish extends CreateDish {
    id: number
}

export interface CreateRestaurant {
    name: string
    adres: string
    lat: number
    lng: number
    geo: string
}

export interface Restaurant {
    id: number
    name: string
    adres: string
}

export interface UpdateRestaurant {
    name: string
    adres: string
    lat: number
    lng: number
    geo: string
}
