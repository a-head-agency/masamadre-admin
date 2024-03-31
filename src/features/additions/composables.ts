import { axiosPrivate } from '@/network'
import { useMutation, useQuery, useQueryClient } from '@tanstack/vue-query'
import { useToast } from 'primevue/usetoast'
import type { IAddition } from './interfaces'
import type { MaybeRef } from 'vue'
import type { ITag } from '@/features/tags'
import { useAdditionsCategory } from '@/features/categories'
import { useRestaurants } from '@/features/restaurants'

interface GetAdditionsResponse {
    list: IAddition[]
    total: number
}

interface QueryConfig {
    offset: MaybeRef<number>
    limit: MaybeRef<number>
    search: MaybeRef<string>
}

export const useAdditions = <SData>(
    queryConfig: QueryConfig,
    selector?: (response: GetAdditionsResponse) => SData
) => {
    const { offset, limit, search } = queryConfig
    return useQuery({
        queryKey: ['additions', { offset, limit, search }] as any,
        queryFn: async ({ queryKey }) => {
            const response = await axiosPrivate.get<GetAdditionsResponse>('admin/adds', {
                params: {
                    offset: (queryKey[1] as any).offset as number,
                    limit: (queryKey[1] as any).limit as number,
                    search: (queryKey[1] as any).search as string
                }
            })
            return response.data
        },
        select: selector,
        keepPreviousData: true
    })
}

interface GetAdditionResponse {
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

export const useAddition = <SData>(
    id: MaybeRef<number>,
    selector?: (response: IAddition) => SData
) => {
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
            const response = await axiosPrivate.get<GetAdditionResponse>('admin/dish', {
                params: {
                    id: (queryKey[1] as any).id as number
                }
            })

            const rests = restaurants.value!
            const data: IAddition = {
                ...response.data,
                vars: response.data.vars.map((v) => {
                    const rest = rests.list.find((r) => r.id === v.rest_id)

                    if (!rest) {
                        console.error(
                            `Ресторан с ID = ${v.rest_id} не найден, хотя существует вариация добавки в которой он указан: `,
                            v
                        )
                        throw new Error(
                            `Ресторан с ID = ${v.rest_id} не найден, хотя существует вариация добавки в которой он указан: `
                        )
                    }

                    return {
                        ...v,
                        rest_name: rest.name,
                        rest_address: rest.adres
                    }
                })
            }

            return data
        },
        select: selector,
        keepPreviousData: true,
        enabled: isSuccess
    })
}

export const useCreateAddition = () => {
    const toast = useToast()
    const queryClient = useQueryClient()
    const { data: additionsCategory } = useAdditionsCategory()

    return useMutation({
        mutationFn: async (vars: any) => {
            const response = await axiosPrivate.post('admin/dish', {
                iiko_id: 'null',
                from_hour: 1,
                to_hour: 1,
                description: 'null',
                vars: [],
                pich_cen: 1,
                belki: 1,
                ziri: 1,
                uglevodi: 1,
                color: 1,
                size: 1,
                category: additionsCategory.value?.id,
                ...vars
            })
            return response
        },
        onSuccess(_, vars) {
            toast.add({
                severity: 'success',
                life: 3000,
                summary: 'Успешно',
                detail: `Добавлена добавка ${vars.name}`
            })
            queryClient.invalidateQueries(['additions'])
        },
        onError(error: any) {
            toast.add({
                severity: 'error',
                life: 3000,
                summary: 'Не удалось создать добавку',
                detail: error
            })
        }
    })
}

export const useUpdateAddition = () => {
    const toast = useToast()
    const queryClient = useQueryClient()
    const { data: additionsCategory } = useAdditionsCategory()

    return useMutation({
        mutationFn: async (vars: any) => {
            const response = await axiosPrivate.put('admin/dish', {
                iiko_id: 'null',
                from_hour: 1,
                to_hour: 1,
                description: 'null',
                vars: [],
                pich_cen: 1,
                belki: 1,
                ziri: 1,
                uglevodi: 1,
                color: 1,
                size: 1,
                category: additionsCategory.value?.id,
                ...vars
            })
            return response
        },
        onSuccess(_, vars) {
            toast.add({
                severity: 'success',
                life: 3000,
                summary: 'Успешно',
                detail: `Обновлена добавка ${vars.name}`
            })
            queryClient.invalidateQueries(['additions'])
        },
        onError(error: any) {
            toast.add({
                severity: 'error',
                life: 3000,
                summary: 'Не удалось обновить добавку',
                detail: error
            })
        }
    })
}
