export interface IOrder {
    id: number
    user_id: number
    promo: string
    status: string
    price: number
    adres: number
    count_items: number
    rest: number
    pay_type: number // 0 - карта, 1 - наличные, 2 - Тинькофф
    rkeeper_id: string
    created_at: string
}
