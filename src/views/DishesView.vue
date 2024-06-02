<script setup lang="ts">
import { computed, ref, watch } from 'vue'

import dateFormat from '@/dateformat'
import { useDebounce } from '@vueuse/core'
import draggable from 'vuedraggable'

import {
    CreateDish,
    DeleteDish,
    UpdateDish,
    useDishes,
    type IDish,
    DishHavingBadge,
    DishStatusBadge,
    useSaveDishesOrdering,
    type SaveDishesOrderingMutation
} from '@/features/dishes'
import { useDialog } from 'primevue/usedialog'
import { useCategories } from '@/features/categories'
import type { PageState } from 'primevue/paginator'

const rowsPerPage = ref(20)

const offset = ref(0)
const limit = rowsPerPage
const search = ref('')
const filterCategory = ref(0)
const selected = ref<IDish>()
const debouncedSearch = useDebounce(search, 500)
const reorderMode = ref(false)
const canReorderMode = computed(() => !search.value && filterCategory.value !== 0)

const { data: categoriesOptions, isLoading: isCategoriesOptionsLoading } = useCategories(
    {
        offset: 0,
        limit: 999999999,
        search: ''
    },
    (v) => {
        const options = [
            {
                code: 0,
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
        search: debouncedSearch,
        categoryID: filterCategory
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

const { mutate: saveDishesOrder } = useSaveDishesOrdering()
const toggleReorderMode = () => {
    if (!reorderMode.value) {
        if (canReorderMode.value) {
            reorderMode.value = true
        }
    } else {
        const vals: SaveDishesOrderingMutation = {
            positions: ordered.value.map((c, i) => ({
                id: c.id,
                position: i
            })),
            category_id: filterCategory.value
        }
        saveDishesOrder(vals)
        reorderMode.value = false
    }
}

const cancelReorder = () => {
    if (data.value) {
        ordered.value = data.value.list.slice() || []
    }
    reorderMode.value = false
}

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
            header: 'Новое блюдо',
            dismissableMask: true
        } as any
    })
}
const beginUpdateDishInteraction = (dish: IDish) => {
    dialog.open(UpdateDish, {
        props: {
            class: 'w-full max-w-5xl',
            modal: true,
            header: 'Изменить блюдо',
            dismissableMask: true
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
            header: 'Удалить блюдо',
            dismissableMask: true
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
    <main class="flex min-h-screen flex-col items-stretch px-4 pb-8" ref="root">
        <h1 class="my-12 text-center text-3xl font-semibold leading-none text-black">Блюда</h1>

        <ContextMenu ref="cm" :model="menuModel" @hide="selected = undefined" />

        <div
            class="fixed bottom-6 pointer-events-none left-0 right-0 z-10 mx-4 flex h-12 justify-center gap-2 lg:justify-end xl:left-64"
        >
            <button
                :disabled="!canReorderMode"
                class="rounded-full pointer-events-auto px-8 text-pv-text-color text-white shadow-xl shadow-black/25 transition-all disabled:bg-gray-400"
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
                class="rounded-full pointer-events-auto text-white bg-red-500 px-8 text-pv-text-color shadow-xl shadow-red-400/25 transition-all"
                @click="cancelReorder"
            >
                <i class="pi pi-times" />
            </button>
        </div>

        <Toolbar>
            <template #center>
                <div class="flex w-full flex-wrap gap-2">
                    <Button
                        class="grow md:grow-0"
                        icon="pi pi-refresh"
                        :disabled="isFetching"
                        @click="refresh()"
                    />
                    <Button
                        class="grow md:grow-0"
                        icon="pi pi-plus"
                        :disabled="reorderMode"
                        @click="beginCreateDishInteraction()"
                    />
                    <Dropdown
                        class="w-full lg:max-w-xs grow max-md:order-1 md:w-auto"
                        placeholder="Категория"
                        option-label="label"
                        option-value="code"
                        :disabled="reorderMode"
                        v-model="filterCategory"
                        :loading="isCategoriesOptionsLoading"
                        :options="categoriesOptions || []"
                    />
                    <IconField iconPosition="left" class="grow max-lg:order-1 max-lg:w-full">
                        <InputIcon class="pi pi-search"></InputIcon>
                        <InputText v-model="search" placeholder="Поиск" class="w-full" />
                    </IconField>

                    <Button
                        class="grow md:grow-0"
                        icon="pi pi-pencil"
                        :disabled="!selected || reorderMode"
                        @click="beginUpdateDishInteraction(selected!)"
                    />
                    <Button
                        class="grow md:grow-0"
                        :disabled="!selected || reorderMode"
                        icon="pi pi-times"
                        severity="danger"
                        @click="beginDeleteDishInteraction(selected!)"
                    />
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
                <draggable
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
                            class="mb-2 flex w-full flex-col items-stretch gap-4 rounded-lg p-4 text-start text-pv-text-color outline-none transition-all bg-black/5 focus:bg-black/10 lg:flex-row"
                            :class="{
                                ' !bg-pv-primary-color !text-pv-primary-color-text shadow-lg shadow-black/10':
                                    selected?.id === element.id
                            }"
                            @click="onItemClick(element)"
                            @dblclick="beginUpdateDishInteraction(element)"
                            @contextmenu="onRowContextMenu($event, element)"
                            aria-haspopup="true"
                        >
                            <img
                                class="aspect-square w-32 shrink-0 self-center object-cover object-center drop-shadow-xl max-lg:w-52"
                                :src="element.img"
                                :alt="element.name"
                            />
                            <div class="flex grow flex-col justify-center gap-1">
                                <div
                                    class="flex flex-1 gap-x-1 max-lg:w-full max-lg:items-center max-lg:justify-between max-lg:gap-1.5"
                                >
                                    <span class="opacity-50">Название:</span>
                                    <span class="text-end">
                                        {{ element.name }}
                                    </span>
                                </div>
                                <div
                                    class="flex flex-col items-start justify-between gap-y-1 lg:flex-row lg:items-center lg:gap-8"
                                >
                                    <div
                                        class="flex flex-1 gap-x-1 max-lg:w-full max-lg:items-center max-lg:justify-between max-lg:gap-1.5"
                                    >
                                        <span class="opacity-50">ID:</span>
                                        <span class="text-end">
                                            {{ element.id }}
                                        </span>
                                    </div>
                                    <div
                                        class="flex flex-1 gap-x-1 max-lg:w-full max-lg:items-center max-lg:justify-between max-lg:gap-1.5"
                                    >
                                        <span class="opacity-50">Создана:</span>
                                        <span class="text-end">
                                            {{ dateFormat(element.created_at) }}
                                        </span>
                                    </div>
                                    <div
                                        class="flex flex-1 gap-x-1 max-lg:w-full max-lg:items-center max-lg:justify-between max-lg:gap-1.5"
                                    >
                                        <span class="opacity-50">Обновлена:</span>
                                        <span class="text-end">
                                            {{ dateFormat(element.updated_at) }}
                                        </span>
                                    </div>
                                </div>
                                <div
                                    class="flex flex-col items-start justify-between gap-y-1 lg:flex-row lg:items-center lg:gap-8"
                                >
                                    <div
                                        class="flex flex-1 gap-x-1 max-lg:w-full max-lg:items-center max-lg:justify-between max-lg:gap-1.5"
                                    >
                                        <span class="opacity-50">Цена:</span>
                                        <span class="text-end">{{ element.price }} ₽</span>
                                    </div>

                                    <div
                                        class="flex flex-1 items-center gap-1.5 max-lg:w-full max-lg:justify-between"
                                    >
                                        <span class="opacity-50">Статус:</span>
                                        <span class="text-end">
                                            <DishStatusBadge :code="element.active" />
                                        </span>
                                    </div>

                                    <div
                                        class="flex flex-1 items-center gap-1.5 max-lg:w-full max-lg:justify-between"
                                    >
                                        <span class="opacity-50">Наличие:</span>
                                        <span class="text-end">
                                            <DishHavingBadge :code="element.have" />
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <div
                                class="invisible flex shrink items-center justify-center"
                                :class="{
                                    '!visible': reorderMode
                                }"
                            >
                                <i class="pi pi-bars" />
                            </div>
                        </button>
                    </template>
                </draggable>

                <Paginator
                    v-if="!reorderMode && !canReorderMode"
                    v-model:rows="rowsPerPage"
                    :totalRecords="data.total"
                    @page="onPage"
                    :page-link-size="5"
                    :template="{
                        '640px': 'PrevPageLink CurrentPageReport NextPageLink',
                        '960px':
                            'FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink',
                        '1300px': 'FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink'
                    }"
                    current-page-report-template="{currentPage} из {totalPages}"
                />
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
