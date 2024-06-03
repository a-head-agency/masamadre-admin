import { type MaybeRef } from 'vue'
import { useMutation, useQuery, useQueryClient } from '@tanstack/vue-query'
import type { IUser } from './interfaces'

import { axiosPrivate } from '@/network'
import { useToast } from 'primevue/usetoast'

interface GetUsersResponse {
    users: IUser[]
    total: number
}

interface QueryConfig {
    offset: MaybeRef<number>
    limit: MaybeRef<number>
    search: MaybeRef<string>
}

export const useUsers = <SData>(
    queryConfig: QueryConfig,
    selector?: (response: GetUsersResponse) => SData
) => {
    const { offset, limit, search } = queryConfig
    return useQuery({
        queryKey: ['users', { offset, limit, search }] as any,
        queryFn: async ({ queryKey }) => {
            const response = await axiosPrivate.get<GetUsersResponse>('admin/users', {
                params: {
                    offset: (queryKey[1] as any).offset as number,
                    limit: (queryKey[1] as any).limit as number,
                    search: (queryKey[1] as any).search as string
                }
            })
            return response.data
        },
        select: selector,
        placeholderData: (v) => v
    })
}

export const useChangeUserStatus = () => {
    const toast = useToast()
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (vars: any) => axiosPrivate.post('admin/user/status', vars),
        onSuccess(_, vars) {
            toast.add({
                severity: 'success',
                life: 3000,
                summary: 'Успешно',
                detail: `Статус пользователя ID: ${vars.user_id} изменён`
            })
            queryClient.invalidateQueries({queryKey: ['users']})
        },
        onError(error: any) {
            toast.add({
                severity: 'error',
                life: 3000,
                summary: 'Не удалось изменить статус пользователя',
                detail: error
            })
        }
    })
}

export const useGiftBonusesToUser = () => {
    const toast = useToast()
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (vars: any) => axiosPrivate.post('admin/user/bonus', vars),
        onSuccess(_, vars) {
            toast.add({
                severity: 'success',
                life: 3000,
                summary: 'Успешно',
                detail: `Добавлено бонусов пользователю с ID: ${vars.user_id})`
            })
            queryClient.invalidateQueries({queryKey: ['users']})
        },
        onError(error: any) {
            toast.add({
                severity: 'error',
                life: 3000,
                summary: 'Не удалось добавить бонусов',
                detail: error
            })
        }
    })
}

export const useSendNotification = () => {
    const toast = useToast()

    return useMutation({
        mutationFn: (vars: any) =>
            axiosPrivate.post('admin/user/push', {
                user_id: -1,
                ...vars
            }),
        onSuccess(_, vars) {
            let detail = ''
            if (vars.user_id) detail = `Отправлено уведомление пользователю с ID: ${vars.user_id})`
            else detail = 'Уведомление отправлено всем пользователям'

            toast.add({
                severity: 'success',
                life: 3000,
                summary: 'Успешно',
                detail
            })
        },
        onError(error: any) {
            toast.add({
                severity: 'error',
                life: 3000,
                summary: 'Не удалось отправить уведомление',
                detail: error
            })
        }
    })
}
