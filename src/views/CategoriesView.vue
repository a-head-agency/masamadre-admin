<script setup lang="ts">
import { ref, watch } from 'vue'

import {
    CreateCategory,
    DeleteCategory,
    UpdateCategory,
    type ICategory,
    CategoryStatusBadge
} from '@/features/categories'
import { useDialog } from 'primevue/usedialog'
import { useCategories } from '@/features/categories/composables'
import { useDebounce } from '@vueuse/core'
import dateFormat from 'dateformat'

import draggable from 'vuedraggable'
import { useMutation } from '@tanstack/vue-query'
import { axiosPrivate } from '@/network'
import { useToast } from 'primevue/usetoast'

const toast = useToast()

const offset = ref(0)
const limit = ref(999999999)
const selected = ref<ICategory>()
const search = ref('')
const debouncedSearch = useDebounce(search, 500)

const { data, isFetching, isError, refetch } = useCategories(
    { offset, limit, search: debouncedSearch },
    (v) => v
)
const ordered = ref<ICategory[]>([])
watch(
    [data],
    () => {
        ordered.value = data.value?.list.slice() || []
    },
    {
        immediate: true
    }
)

const { mutateAsync: saveOrderMutate, isLoading: isSavingOrder } = useMutation({
    mutationFn: (vals: { positions: { id: number; position: number }[] }) =>
        axiosPrivate.post('admin/category/positions', vals),
    onError: () => {
        toast.add({
            summary: 'Ошибка',
            detail: 'Не удалось обновить порядок',
            severity: 'error',
            life: 3000
        })
    }
})

const drag = ref(false)

const dialog = useDialog()

const beginCreateCategoryInteraction = () => {
    dialog.open(CreateCategory, {
        props: {
            class: 'max-w-xl w-full',
            modal: true,
            header: 'Новая категория'
        } as any
    })
}

const beginDeleteCategoryInteraction = (category: ICategory) => {
    dialog.open(DeleteCategory, {
        props: {
            class: 'max-w-xl w-full',
            modal: true,
            header: 'Подтвердите удаление'
        } as any,
        onClose: () => {
            selected.value = undefined
        },
        data: {
            category
        }
    })
}

const beginUpdateCategoryInteraction = (category: ICategory) => {
    dialog.open(UpdateCategory, {
        props: {
            class: 'max-w-xl w-full',
            modal: true,
            header: 'Изменить категорию'
        } as any,
        onClose: () => {
            selected.value = undefined
        },
        data: {
            category
        }
    })
}

const refresh = () => {
    refetch()
}

const saveOrder = () => {
    const vals = {
        positions: ordered.value.map((c, i) => ({
            id: c.id,
            position: i
        }))
    }
    saveOrderMutate(vals).then(refresh)
}

const cm = ref()
const onRowContextMenu = (event: any, item: ICategory) => {
    selected.value = item
    cm.value.show(event)
}
const menuModel = ref([
    {
        label: 'Обновить',
        icon: 'pi pi-fw pi-refresh',
        command: () => refresh()
    },
    {
        label: 'Создать',
        icon: 'pi pi-fw pi-plus',
        command: () => beginCreateCategoryInteraction()
    },
    {
        label: 'Изменить',
        icon: 'pi pi-fw pi-pencil',
        command: () => beginUpdateCategoryInteraction(selected.value!)
    },
    {
        label: 'Удалить',
        icon: 'pi pi-fw pi-times',
        command: () => beginDeleteCategoryInteraction(selected.value!)
    }
])

const onItemClick = (item: ICategory) => {
    if (selected.value?.id === item.id) {
        selected.value = undefined
    } else {
        selected.value = item
    }
}

const root = ref<HTMLElement>()
</script>

<template>
    <main class="flex flex-col items-stretch px-4" ref="root">
        <h1 class="my-12 text-center text-3xl font-semibold leading-none">Категории</h1>

        <ContextMenu ref="cm" :model="menuModel" @hide="selected = undefined" />

        <Toolbar class="border-white/10">
            <template #center>
                <div class="flex w-full">
                    <div class="flex flex-1 justify-start gap-2">
                        <Button icon="pi pi-refresh" :disabled="isFetching" @click="refresh()" />
                        <Button icon="pi pi-plus" @click="beginCreateCategoryInteraction()" />
                    </div>

                    <div class="flex flex-1 justify-center">
                        <span class="p-input-icon-left">
                            <i class="pi pi-search" />
                            <InputText placeholder="Поиск" v-model="search" />
                        </span>
                    </div>

                    <div class="flex flex-1 justify-end gap-2">
                        <Button
                            icon="pi pi-arrows-v"
                            :disabled="!!search.length || isSavingOrder"
                            label="Сохранить порядок"
                            @click="saveOrder"
                        />
                        <Button
                            icon="pi pi-pencil"
                            :disabled="!selected"
                            @click="beginUpdateCategoryInteraction(selected!)"
                        />
                        <Button
                            :disabled="!selected"
                            icon="pi pi-times"
                            severity="danger"
                            @click="beginDeleteCategoryInteraction(selected!)"
                        />
                    </div>
                </div>
            </template>
        </Toolbar>

        <div class="min-h-0 flex-1 py-6">
            <Message v-if="isError" severity="error" :closable="false">
                Не удалось загрузить данные
            </Message>

            <div v-else-if="!data?.total" class="flex flex-col items-center gap-4 py-12">
                <img class="h-36" src="/empty.svg" alt="" />
                <span>Нет данных</span>
            </div>

            <div v-else>
                <draggable
                    :disabled="search.length"
                    v-model="ordered"
                    @start="drag = true"
                    @end="drag = false"
                    item-key="id"
                    :animation="200"
                    ghostClass="ghost"
                    :component-data="{ name: !drag ? 'flip-list' : undefined }"
                >
                    <template #item="{ element }">
                        <button
                            class="mb-2 w-full rounded-lg border-2 border-solid border-white/10 p-4 text-start outline-none transition-all focus:border-solid focus:border-white"
                            :class="{
                                '!border-solid !border-white/60 !bg-white/20':
                                    selected?.id === element.id
                            }"
                            @click="onItemClick(element)"
                            @contextmenu="onRowContextMenu($event, element)"
                            aria-haspopup="true"
                        >
                            <div>
                                <span class="opacity-50">Название:</span>
                                {{ element.name }}
                            </div>
                            <div class="flex items-center justify-between gap-8">
                                <div class="flex-1">
                                    <span class="opacity-50">ID:</span>
                                    {{ element.id }}
                                </div>
                                <div class="flex-1">
                                    <span class="opacity-50">Создана:</span>
                                    {{ dateFormat(element.created_at) }}
                                </div>
                                <div class="flex-1">
                                    <span class="opacity-50">Обновлена:</span>
                                    {{ dateFormat(element.updated_at) }}
                                </div>
                                <div class="flex-1 text-end">
                                    <CategoryStatusBadge :code="element.active" />
                                </div>
                            </div>
                        </button>
                    </template>
                </draggable>
            </div>
        </div>
    </main>
</template>

<style scoped>
.flip-list-move {
    transition: transform 0.5s;
}

.no-move {
    transition: transform 0s;
}

.ghost {
    @apply opacity-40;
}
</style>
