export interface IStoryImage {
    id: number
    preview: string
    active: boolean
    type: 1
    story_items: {
        id: number
        text: string
        img: string
    }[]
    created_at: string
    updated_at: string
    deleted_at: string | null
}

export interface IStoryVideo {
    id: number
    preview: string
    active: boolean
    type: 2
    story_items: unknown[]
    created_at: string
    updated_at: string
    deleted_at: string | null
}
