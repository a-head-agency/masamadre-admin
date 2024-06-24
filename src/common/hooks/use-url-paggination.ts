import { computed, toRef, watchEffect, type MaybeRef } from 'vue'

import { useDebounce, useUrlSearchParams } from '@vueuse/core'

export default function useUrlPaggination(config: { rowsPerPage: MaybeRef<number> }) {
    const rowsPerPage = toRef(config.rowsPerPage)

    const params = useUrlSearchParams('history', {
        initialValue: {
            page: 1,
            search: ''
        },
        removeNullishValues: true,
        write: true
    })

    const offset = computed(() => Math.max(Number(params.page ?? 1) - 1, 0) * rowsPerPage.value)
    const limit = rowsPerPage
    const page = computed({
        get: () => params.page ?? 1,
        set: (v) => {
            params.page = v
        }
    })
    const search = computed({
        get: () => params.search || '',
        set: (v) => {
            params.search = v
        }
    })
    const debouncedSearch = useDebounce(search, 500)
    watchEffect(() => {
        if (debouncedSearch.value) {
            params.page = 1
        }
    })

    return {
        offset,
        limit,
        search,
        debouncedSearch,
        page
    }
}
