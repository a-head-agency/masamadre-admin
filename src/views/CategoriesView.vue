<script setup lang="ts">
import { computed, ref, watch } from 'vue'

import {
    CreateCategory,
    DeleteCategory,
    UpdateCategory,
    type ICategory,
    CategoryStatusBadge,
    type SaveCategoriesOrderingMutation,
    useSaveCategoriesOrdering,
    useCategories
} from '@/features/categories'
import { useDialog } from 'primevue/usedialog'
import { useDebounce } from '@vueuse/core'
import dateFormat from '@/dateformat'

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
const reorderMode = ref(false)
const canReorderMode = computed(() => !search.value)

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

const { mutate: saveCategoriesOrder } = useSaveCategoriesOrdering()
const toggleReorderMode = () => {
    if (!reorderMode.value) {
        if (canReorderMode.value) {
            reorderMode.value = true
        }
    } else {
        const vals: SaveCategoriesOrderingMutation = {
            positions: ordered.value.map((c, i) => ({
                id: c.id,
                position: i
            })),
            category_id: -1
        }
        saveCategoriesOrder(vals)
        reorderMode.value = false
    }
}

const cancelReorder = () => {
    if (data.value) {
        ordered.value = data.value.list.slice() || []
    }
    reorderMode.value = false
}

const drag = ref(false)

const dialog = useDialog()

const beginCreateCategoryInteraction = () => {
    dialog.open(CreateCategory, {
        props: {
            class: 'max-w-xl w-full mx-4',
            modal: true,
            header: 'Новая категория',
            dismissableMask: true
        } as any
    })
}

const beginDeleteCategoryInteraction = (category: ICategory) => {
    dialog.open(DeleteCategory, {
        props: {
            class: 'max-w-xl w-full mx-4',
            modal: true,
            header: 'Подтвердите удаление',
            dismissableMask: true
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
            class: 'max-w-xl w-full mx-4',
            modal: true,
            header: 'Изменить категорию',
            dismissableMask: true
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

const cm = ref()
const onRowContextMenu = (event: any, item: ICategory) => {
    selected.value = item
    if (!reorderMode.value) {
        cm.value.show(event)
    }
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
        <h1 class="my-12 text-center text-3xl font-semibold leading-none text-white">Категории</h1>

        <ContextMenu ref="cm" :model="menuModel" @hide="selected = undefined" />

        <div
            class="fixed bottom-6 left-0 right-0 mx-4 flex h-12 justify-center gap-2 lg:justify-end xl:left-64"
        >
            <button
                :disabled="!canReorderMode"
                class="rounded-full px-8 text-white shadow-xl shadow-black/25 transition-all disabled:bg-gray-400"
                :class="{
                    'bg-green-500 !shadow-green-400/25': canReorderMode && reorderMode,
                    'bg-indigo-500 !shadow-indigo-400/25': canReorderMode && !reorderMode
                }"
                @click="toggleReorderMode"
            >
                <span v-if="!reorderMode">Режим "Изменения порядка"</span>
                <span v-else>Сохранить порядок</span>
            </button>
            <button
                v-if="reorderMode"
                class="rounded-full bg-red-500 px-8 text-white shadow-xl shadow-red-400/25 transition-all"
                @click="cancelReorder"
            >
                <i class="pi pi-times" />
            </button>
        </div>

        <Toolbar>
            <template #center>
                <div class="flex w-full flex-wrap gap-2 lg:flex-row lg:items-center">
                    <Button
                        class="shrink-0 max-lg:flex-1"
                        icon="pi pi-refresh"
                        :disabled="isFetching"
                        @click="refresh()"
                    />
                    <Button
                        :disabled="reorderMode"
                        class="shrink-0 max-lg:flex-1"
                        icon="pi pi-plus"
                        @click="beginCreateCategoryInteraction()"
                    />
                    <IconField iconPosition="left" class="grow max-lg:order-1 max-lg:w-full">
                        <InputIcon class="pi pi-search"></InputIcon>
                        <InputText
                            v-model="search"
                            :disabled="reorderMode"
                            placeholder="Поиск"
                            class="w-full"
                        />
                    </IconField>

                    <Button
                        class="shrink-0 max-lg:flex-1"
                        icon="pi pi-pencil"
                        :disabled="!selected || reorderMode"
                        @click="beginUpdateCategoryInteraction(selected!)"
                    />
                    <Button
                        class="shrink-0 max-lg:flex-1"
                        :disabled="!selected || reorderMode"
                        icon="pi pi-times"
                        severity="danger"
                        @click="beginDeleteCategoryInteraction(selected!)"
                    />
                </div>
            </template>
        </Toolbar>

        <div class="min-h-0 flex-1 pb-20 pt-6">
            <Message v-if="isError" severity="error" :closable="false">
                Не удалось загрузить данные
            </Message>

            <div v-else-if="!data?.total" class="flex flex-col items-center gap-4 py-12">
                <img class="h-36" src="/empty.svg" alt="" />
                <span>Нет данных</span>
            </div>

            <div v-else>
                <draggable
                    :delayOnTouchOnly="true"
                    :delay="100"
                    :disabled="!reorderMode"
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
                            class="mb-2 w-full rounded-lg bg-white/5 p-4 text-start outline-none transition-all focus:bg-white/10 focus:text-white"
                            :class="{
                                '!bg-white !text-black shadow-lg shadow-white/10':
                                    selected?.id === element.id
                            }"
                            @click="onItemClick(element)"
                            @contextmenu="onRowContextMenu($event, element)"
                            aria-haspopup="true"
                        >
                            <div class="mb-2 lg:mb-0">
                                <span class="opacity-50">Название:</span>
                                {{ element.name }}
                            </div>
                            <div
                                class="flex flex-col items-start justify-between lg:flex-row lg:items-center lg:gap-8"
                            >
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
