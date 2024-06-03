export interface GetListConfig {
    offset: number
    limit: number
}

export interface GetListConfigWithSearch extends GetListConfig {
    search: string
}

export interface GetIden {
    id: number
}

export type QueryFnDataDynamic<
    T extends (...args: any) => {
        queryFn: (...args: any) => any
    }
> = Awaited<ReturnType<ReturnType<T>['queryFn']>>
