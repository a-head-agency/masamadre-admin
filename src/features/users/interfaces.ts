export interface IUser {
    id: number
    name: string
    surname: string
    phone: string
    role: 'user' | 'admin'
    status: number
    // summ: number
    // email: string
    bonuses: number
    birthday: string
    // choosed_adres: number
    // choosed_rest: number
    // get_pushes: boolean
    // last_point: number
    // point: string
    // referal: string
    // share_id: string
    created_at: string
    deleted_at: null
    updated_at: string
}
