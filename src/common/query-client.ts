import { QueryClient } from '@tanstack/vue-query'
import { ZodError } from 'zod'

export const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: 60 * 1000,
            retry(failureCount, error) {
                if (error instanceof ZodError) {
                    console.log('ОШИБКА ВАЛИДАЦИИ', error.errors)
                    return false
                }
                if (failureCount <= 2) {
                    return true
                }
                return false
            }
        }
    }
})
