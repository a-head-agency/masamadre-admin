import { axiosPrivate } from '@/network'
import { useMutation, useQuery, useQueryClient } from '@tanstack/vue-query'
import { useToast } from 'primevue/usetoast'
import type { IDish, IVariation } from './interfaces'
import type { MaybeRef } from 'vue'
import { useRestaurants } from '@/features/restaurants'
import type { ITag } from '@/features/tags'
import type { ICategory } from '../categories'

interface GetDishesResponse {
    list: IDish[]
    total: number
}

interface QueryConfig {
    offset: MaybeRef<number>
    limit: MaybeRef<number>
    search: MaybeRef<string>
    categoryID: MaybeRef<number>
}

export const useDishes = <SData>(
    queryConfig: QueryConfig,
    selector?: (response: GetDishesResponse) => SData
) => {
    const { offset, limit, search, categoryID } = queryConfig
    return useQuery({
        queryKey: ['dishes', { offset, limit, search, categoryID }] as [
            string,
            { offset: number; limit: number; search: string; categoryID: number }
        ],
        queryFn: async ({ queryKey }) => {
            const response = await axiosPrivate.get<GetDishesResponse>('admin/dishes', {
                params: {
                    offset: queryKey[1].offset,
                    limit: queryKey[1].limit,
                    search: queryKey[1].search,
                    id: queryKey[1].categoryID
                }
            })
            if (queryKey[1].categoryID) {
                // total либо отсутсвует либо не соответсвует данным,
                // поэтому просто выставляем total равным длинне массива list
                response.data.total = response.data.list.length
            }
            return response.data
        },
        select: selector,
        keepPreviousData: true
    })
}

interface GetDishResponse {
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
    images: string[] | null
    name: string
    pich_cen: number
    price: number
    size: number
    to_hour: number
    uglevodi: number
    updated_at: string
    weight: number
    ziri: number
    alt: string | undefined
    link: string | undefined
    keywords: string | undefined
    description_seo: string | undefined
    title: string | undefined
    iiko_sale_id: string | undefined

    short_description: string | undefined
    content: string | undefined
    alerg: string | undefined
    date_contain: string | undefined

    make_date: string

    tags: ITag[]

    vars: {
        id: number
        rest_id: number
        price: number
        active: boolean
        can_deliver: boolean
        in_rest: boolean
        can_order: boolean
        have: boolean
    }[]
}

export const useDish = <SData>(id: MaybeRef<number>, selector?: (response: IDish) => SData) => {
    const { data: restaurants, isSuccess } = useRestaurants(
        {
            offset: 0,
            limit: 99999999,
            search: ''
        },
        (v) => v
    )

    return useQuery({
        queryKey: ['dishes', { id }] as any,
        queryFn: async ({ queryKey }) => {
            const response = await axiosPrivate.get<GetDishResponse>('admin/dish', {
                params: {
                    id: (queryKey[1] as any).id as number
                }
            })

            const rests = restaurants.value!

            const vars: IVariation[] = []
            for (const v of response.data.vars) {
                const rest = rests.list.find((r) => r.id === v.rest_id)

                if (!rest) {
                    throw new Error(
                        `Ресторан с ID = ${v.rest_id} не найден, хотя существует вариация блюда в которой он указан: `
                    )
                }

                vars.push({
                    ...v,
                    rest_name: rest.name,
                    rest_address: rest.adres
                })
            }
            const data: IDish = {
                ...response.data,
                vars,
                images: response.data.images || []
            }

            return data
        },
        select: selector,
        keepPreviousData: true,
        enabled: isSuccess
    })
}

export const useCreateDish = () => {
    const toast = useToast()
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: async (vars: any) => {
            const response = await axiosPrivate.post('admin/dish', vars)
            return response
        },
        onSuccess(_, vars) {
            toast.add({
                severity: 'success',
                life: 3000,
                summary: 'Успешно',
                detail: `Добавлено блюдо ${vars.name}`
            })
            queryClient.invalidateQueries(['dishes'])
        },
        onError(error: any) {
            toast.add({
                severity: 'error',
                life: 3000,
                summary: 'Не удалось создать блюдо',
                detail: error
            })
        }
    })
}

export const useUpdateDish = () => {
    const toast = useToast()
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: async (vars: any) => {
            const response = await axiosPrivate.put('admin/dish', vars)
            return response
        },
        onSuccess(_, vars) {
            toast.add({
                severity: 'success',
                life: 3000,
                summary: 'Успешно',
                detail: `Обновлено блюдо ${vars.name}`
            })
            queryClient.invalidateQueries(['dishes'])
        },
        onError(error: any) {
            toast.add({
                severity: 'error',
                life: 3000,
                summary: 'Не удалось обновить блюдо',
                detail: error
            })
        }
    })
}

export interface SaveDishesOrderingMutation {
    positions: {
        id: number
        position: number
    }[]
    category_id: number
}

export const useSaveDishesOrdering = () => {
    const queryClient = useQueryClient()
    const toast = useToast()

    return useMutation({
        mutationFn: async (vals: SaveDishesOrderingMutation) => {
            const response = await axiosPrivate.post('admin/dishes/positions', vals)
            return response.data
        },
        onSuccess() {
            toast.add({
                severity: 'success',
                life: 3000,
                summary: 'Успешно',
                detail: `Порядок блюд сохранён.`
            })
            queryClient.invalidateQueries(['dishes'])
        },
        onError(error: any) {
            toast.add({
                severity: 'error',
                life: 3000,
                summary: 'Не удалось сохранить порядок',
                detail: error
            })
        }
    })
}
