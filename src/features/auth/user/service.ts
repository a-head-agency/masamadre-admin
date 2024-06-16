import { AxiosError } from 'axios'
import { md5 } from 'js-md5'
import { z, ZodError } from 'zod'

import { axiosPublic } from '@/common/network'

export class UnknownError extends Error {}

export namespace SignInErrors {
    export class InvalidCredentials extends Error {}
    export class InvalidData extends Error {}
}

export async function signIn(input: { login: string; password: string }) {
    input.password = md5(input.password)

    const scheme = z.object({
        token: z.string(),
        refreshToken: z.string()
    })
    try {
        const response = await axiosPublic.post('admin/auth', input)
        const data = scheme.parse(response.data)
        return data
    } catch (error) {
        if (error instanceof AxiosError) {
            if (error.response?.status === 401) {
                throw SignInErrors.InvalidCredentials
            } else {
                const body = error.response?.data
                throw new UnknownError(body)
            }
        }
        if (error instanceof ZodError) {
            throw SignInErrors.InvalidData
        }
    }
}
