<script setup lang="ts">
import { ref, watch } from 'vue'

import dateFormat from 'dateformat'
import { useDebounce } from '@vueuse/core'
import draggable from 'vuedraggable'

import {
    CreateDish,
    DeleteDish,
    UpdateDish,
    useDishes,
    type IDish,
    DishHavingBadge,
    DishStatusBadge
} from '@/features/dishes'
import { useDialog } from 'primevue/usedialog'
import { useCategories } from '@/features/categories'
import type { PageState } from 'primevue/paginator'

const rowsPerPage = ref(20)

const offset = ref(0)
const limit = rowsPerPage
const search = ref('')
const filterCategory = ref(-1)
const selected = ref<IDish>()
const debouncedSearch = useDebounce(search, 500)

const { data: categoriesOptions, isLoading: isCategoriesOptionsLoading } = useCategories(
    {
        offset: 0,
        limit: 999999999,
        search: ''
    },
    (v) => {
        const options = [
            {
                code: -1,
                label: 'Все'
            }
        ]

        options.push(
            ...v.list.map((c) => ({
                code: c.id,
                label: c.name
            }))
        )
        return options
    }
)

const { data, refetch, isFetching, isError } = useDishes(
    {
        limit,
        offset,
        search: debouncedSearch
    },
    (r) => r
)

const drag = ref(false)
const ordered = ref<IDish[]>([])
watch(
    [data],
    () => {
        if (data.value) {
            ordered.value = data.value.list.slice()
        }
    },
    {
        immediate: true
    }
)

const onPage = (e: PageState) => {
    offset.value = e.first
    limit.value = e.rows
}

const dialog = useDialog()
const beginCreateDishInteraction = () => {
    dialog.open(CreateDish, {
        props: {
            class: 'w-full max-w-5xl',
            modal: true,
            header: 'Новое блюдо'
        } as any
    })
}
const beginUpdateDishInteraction = (dish: IDish) => {
    dialog.open(UpdateDish, {
        props: {
            class: 'w-full max-w-5xl',
            modal: true,
            header: 'Изменить блюдо'
        } as any,
        onClose: () => {
            selected.value = undefined
        },
        data: {
            dish
        }
    })
}

const beginDeleteDishInteraction = (dish: IDish) => {
    dialog.open(DeleteDish, {
        props: {
            class: 'w-full max-w-xl',
            modal: true,
            header: 'Удалить блюдо'
        } as any,
        onClose: () => {
            selected.value = undefined
        },
        data: {
            dish
        }
    })
}

const refresh = () => {
    refetch()
}

const cm = ref()
const onRowContextMenu = (event: any, element: IDish) => {
    selected.value = element
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
        command: () => beginCreateDishInteraction()
    },
    {
        label: 'Изменить',
        icon: 'pi pi-fw pi-pencil',
        command: () => beginUpdateDishInteraction(selected.value!)
    },
    {
        label: 'Удалить',
        icon: 'pi pi-fw pi-times',
        command: () => beginDeleteDishInteraction(selected.value!)
    }
])

const onItemClick = (item: IDish) => {
    if (selected.value?.id === item.id) {
        selected.value = undefined
    } else {
        selected.value = item
    }
}

const root = ref<HTMLElement>()
</script>

<template>
    <main class="flex h-screen flex-col items-stretch px-4" ref="root">
        <h1 class="my-12 text-center text-3xl font-semibold leading-none">Блюда</h1>

        <ContextMenu ref="cm" :model="menuModel" @hide="selected = undefined" />

        <Toolbar class="border-white/10">
            <template #center>
                <div class="flex w-full">
                    <div class="flex flex-1 justify-start gap-2">
                        <Button icon="pi pi-refresh" :disabled="isFetching" @click="refresh()" />
                        <Button icon="pi pi-plus" @click="beginCreateDishInteraction()" />
                        <Dropdown
                            placeholder="Категория"
                            option-label="label"
                            option-value="code"
                            v-model="filterCategory"
                            :loading="isCategoriesOptionsLoading"
                            :options="categoriesOptions || []"
                        />
                    </div>

                    <div class="flex flex-1 justify-center gap-4">
                        <span class="p-input-icon-left">
                            <i class="pi pi-search" />
                            <InputText placeholder="Поиск" v-model="search" />
                        </span>
                    </div>

                    <div class="flex flex-1 justify-end gap-2">
                        <Button
                            icon="pi pi-arrows-v"
                            :disabled="!!search.length || filterCategory === -1"
                            label="Сохранить порядок"
                        />
                        <Button
                            icon="pi pi-pencil"
                            :disabled="!selected"
                            @click="beginUpdateDishInteraction(selected!)"
                        />
                        <Button
                            :disabled="!selected"
                            icon="pi pi-times"
                            severity="danger"
                            @click="beginDeleteDishInteraction(selected!)"
                        />
                    </div>
                </div>
            </template>
        </Toolbar>

        <div class="min-h-0 flex-1 py-6">
            <Message v-if="isError" severity="error" :closable="false">
                Не удалось загрузить таблицу
            </Message>

            <div v-else-if="!data?.total" class="flex flex-col items-center gap-4 py-12">
                <img class="h-36" src="/empty.svg" alt="" />
                <span>Нет данных</span>
            </div>

            <div v-else class="pb-8">
                <Paginator
                    class="mb-6"
                    v-if="filterCategory === -1"
                    v-model:rows="rowsPerPage"
                    :totalRecords="data.total"
                    @page="onPage"
                    :rowsPerPageOptions="[10, 20, 30]"
                />
                <draggable
                    :disabled="filterCategory === -1 || !!search.length"
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
                            class="mb-2 flex w-full items-stretch gap-4 rounded-lg border-2 border-solid border-white/10 p-4 text-start outline-none transition-all focus:border-solid focus:border-white"
                            :class="{
                                '!border-solid !border-white/60 !bg-white/20':
                                    selected?.id === element.id
                            }"
                            @click="onItemClick(element)"
                            @contextmenu="onRowContextMenu($event, element)"
                            aria-haspopup="true"
                        >
                            <img
                                class="aspect-[4/3] w-32 shrink-0"
                                :src="element.img"
                                :alt="element.name"
                            />
                            <div class="flex grow flex-col justify-center gap-1">
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
                                </div>
                                <div class="flex items-center justify-between gap-8">
                                    <div class="flex-1">
                                        <span class="opacity-50">Цена:</span>
                                        {{ element.price }}
                                    </div>

                                    <div class="flex flex-1 items-center gap-1.5">
                                        <span class="opacity-50">Статус:</span>
                                        <DishStatusBadge :code="element.active" />
                                    </div>

                                    <div class="flex flex-1 items-center gap-1.5">
                                        <span class="opacity-50">Наличие:</span>
                                        <DishHavingBadge :code="element.have" />
                                    </div>
                                </div>
                            </div>
                            <div
                                class="invisible flex shrink items-center justify-center"
                                :class="{
                                    '!visible': filterCategory !== -1 && !search.length
                                }"
                            >
                                <i class="pi pi-bars" />
                            </div>
                        </button>
                    </template>
                </draggable>
            </div>

            <!-- <DataTable
                v-else
                size="small"
                scrollable
                :scroll-height="scrollHeight"
                v-model:selection="selected"
                selection-mode="single"
                contextMenu
                v-model:contextMenuSelection="selected"
                @rowContextmenu="onRowContextMenu"
                :meta-key-selection="false"
                class="h-full overflow-hidden rounded-lg border border-white/10"
                :value="data?.list"
                lazy
                paginator
                :first="0"
                :rows="rowsPerPage"
                dataKey="id"
                tableStyle="min-width: 50rem"
                @page="onPage($event)"
                :totalRecords="data?.total"
            >
                <Column selectionMode="single" headerStyle="width: 3rem" />
                <Column field="id" header="ID" />
                <Column field="name" header="Название" />
                <Column field="img" header="Картинка">
                    <template #body="slotProps">
                        <img
                            :src="slotProps.data.img"
                            :alt="slotProps.data.img"
                            class="aspect-[4/3] w-[6rem] min-w-[6rem] rounded-lg object-cover drop-shadow-md"
                        />
                    </template>
                </Column>
                <Column field="price" header="Цена">
                    <template #body="slotProps">{{ slotProps.data.price }} ₽</template>
                </Column>
                <Column field="active" header="Статус">
                    <template #body="slotProps">
                        <Tag
                            :value="slotProps.data.active ? 'Активно' : 'Заблокировано'"
                            :severity="slotProps.data.active ? 'success' : 'danger'"
                        />
                    </template>
                </Column>
                <Column field="active" header="Наличие">
                    <template #body="slotProps">
                        <Tag
                            :value="slotProps.data.have ? 'Есть' : 'Нету'"
                            :severity="slotProps.data.have ? 'success' : 'danger'"
                        />
                    </template>
                </Column>

                <Column field="created_at" header="Создано">
                    <template #body="slotProps">
                        {{ dateFormat(slotProps.data.created_at) }}
                    </template>
                </Column>
                <Column field="updated_at" header="Обновлено">
                    <template #body="slotProps">
                        {{ dateFormat(slotProps.data.updated_at) }}
                    </template>
                </Column>

                <template #loading>
                    <ProgressSpinner class="h-8" />
                </template>

                <template #empty>
                    <div class="flex flex-col items-center gap-4 py-12">
                        <img class="h-36" src="/empty.svg" alt="" />
                        <span>Нет данных</span>
                    </div>
                </template>
            </DataTable> -->
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
