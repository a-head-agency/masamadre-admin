<script setup lang="ts">
import { ref, onMounted, computed, unref } from 'vue'
import type { DataTablePageEvent, DataTableRowDoubleClickEvent } from 'primevue/datatable'
import {
    CreateRestaurant,
    UpdateRestaurant,
    useDeleteRestaurant,
    RestsQueries,
    RestsSchemes
} from '@/features/restaurants'
import { useDialog } from 'primevue/usedialog'
import { useDebounce } from '@vueuse/core'
import dateFormat from '@/dateformat'
import { useQuery } from '@tanstack/vue-query'
import type { z } from 'zod'
import { useConfirm } from 'primevue/useconfirm'

type ListedEntity = z.infer<typeof RestsSchemes.ListedRestScheme>

const rowsPerPage = ref(20)

const offset = ref(0)
const limit = rowsPerPage
const search = ref('')
const debouncedSearch = useDebounce(search, 500)
const selected = ref<ListedEntity>()

const { data, refetch, isFetching, isError } = useQuery(
    computed(() =>
        RestsQueries.list({
            limit: unref(limit),
            offset: unref(offset),
            search: unref(debouncedSearch)
        })
    )
)

const onPage = (e: DataTablePageEvent) => {
    offset.value = e.first
    limit.value = e.rows
}

const dialog = useDialog()
const beginCreateRestaurantInteraction = () => {
    dialog.open(CreateRestaurant, {
        props: {
            class: 'w-full max-w-4xl mx-4',
            modal: true,
            header: 'Новый ресторан',
            dismissableMask: true
        } as any
    })
}
const beginUpdateRestaurantInteraction = (entity: ListedEntity) => {
    dialog.open(UpdateRestaurant, {
        props: {
            class: 'w-full max-w-4xl',
            modal: true,
            header: 'Изменить ресторан',
            dismissableMask: true
        } as any,
        onClose: () => {
            selected.value = undefined
        },
        data: {
            entity
        }
    })
}

const { mutate: deleteRestaurant } = useDeleteRestaurant()
const confirm = useConfirm()
const beginDeleteRestaurantInteraction = (entity: ListedEntity) => {
    confirm.require({
        group: 'danger',
        header: 'Вы уверены?',
        message: `Подвердите удаление ресторана: ${entity.name}`,
        acceptLabel: 'Удалить',
        rejectLabel: 'Отмена',
        accept: () => {
            deleteRestaurant(entity)
            selected.value = undefined
        }
    })
}

const onRowDoubleClick = (event: DataTableRowDoubleClickEvent) => {
    beginUpdateRestaurantInteraction(event.data)
}

const refresh = () => {
    refetch()
}

const cm = ref()
const onRowContextMenu = (event: any) => {
    cm.value.show(event.originalEvent)
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
        command: () => beginCreateRestaurantInteraction()
    },
    {
        label: 'Изменить',
        icon: 'pi pi-fw pi-pencil',
        command: () => beginUpdateRestaurantInteraction(selected.value!)
    },
    {
        label: 'Удалить',
        icon: 'pi pi-fw pi-times',
        command: () => beginDeleteRestaurantInteraction(selected.value!)
    }
])

const root = ref<HTMLElement>()
const scrollHeight = ref()
onMounted(() => {
    if (root.value) {
        const pagginatorHeight = root.value.querySelector('.p-paginator-bottom')?.clientHeight
        scrollHeight.value = `calc(100% - ${pagginatorHeight}px)`
    }
})
</script>

<template>
    <main class="flex h-screen flex-col items-stretch px-4" ref="root">
        <h1 class="my-12 text-center text-3xl font-semibold leading-none text-black">Рестораны</h1>

        <ContextMenu ref="cm" :model="menuModel" @hide="selected = undefined" />

        <Toolbar>
            <template #center>
                <div class="flex w-full flex-wrap gap-2">
                    <Button
                        class="shrink-0 max-md:grow"
                        icon="pi pi-refresh"
                        :disabled="isFetching"
                        @click="refresh()"
                    />
                    <Button
                        class="shrink-0 max-md:grow"
                        icon="pi pi-plus"
                        @click="beginCreateRestaurantInteraction()"
                    />
                    <IconField iconPosition="left" class="grow max-lg:order-1 max-lg:w-full">
                        <InputIcon class="pi pi-search"></InputIcon>
                        <InputText v-model="search" placeholder="Поиск" class="w-full" />
                    </IconField>
                    <Button
                        class="shrink-0 max-md:grow"
                        icon="pi pi-pencil"
                        :disabled="!selected"
                        @click="beginUpdateRestaurantInteraction(selected!)"
                    />
                    <Button
                        class="shrink-0 max-md:grow"
                        :disabled="!selected"
                        icon="pi pi-times"
                        severity="danger"
                        @click="beginDeleteRestaurantInteraction(selected!)"
                    />
                </div>
            </template>
        </Toolbar>

        <div class="min-h-0 flex-1 py-6">
            <Message v-if="isError" severity="error" :closable="false">
                Не удалось загрузить таблицу
            </Message>
            <DataTable
                v-else
                size="small"
                scrollable
                :scroll-height="scrollHeight"
                v-model:selection="selected"
                selection-mode="single"
                contextMenu
                v-model:contextMenuSelection="selected"
                @rowContextmenu="onRowContextMenu"
                @row-dblclick="onRowDoubleClick"
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
                :page-link-size="5"
                :paginator-template="{
                    '640px': 'PrevPageLink CurrentPageReport NextPageLink',
                    '960px':
                        'FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink',
                    '1300px': 'FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink'
                }"
                current-page-report-template="{currentPage} из {totalPages}"
            >
                <Column selectionMode="single" headerStyle="width: 3rem" />
                <Column field="id" header="ID" />
                <Column field="name" header="Название" />
                <Column field="adres" header="Адрес" />
                <Column field="active" header="Статус">
                    <template #body="slotProps">
                        <Tag
                            v-if="slotProps.data.active === true"
                            icon="pi pi-check-circle"
                            value="Активен"
                            severity="success"
                        />
                        <Tag
                            v-else-if="slotProps.data.active === false"
                            icon="pi pi-check-circle"
                            value="Не активен"
                            severity="danger"
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
                <Column field="deleted_at" header="Удалено">
                    <template #body="slotProps">
                        {{ dateFormat(slotProps.data.deleted_at) }}
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
            </DataTable>
        </div>
    </main>
</template>
