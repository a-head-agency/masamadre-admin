<script setup lang="ts">
import { ref, onMounted, computed, unref } from 'vue'
import type { DataTablePageEvent, DataTableRowDoubleClickEvent } from 'primevue/datatable'

import { useDialog } from 'primevue/usedialog'
import { useConfirm } from 'primevue/useconfirm'
import { useDebounce } from '@vueuse/core'
import dateFormat from '@/dateformat'
import { CreateMod, UpdateMod, ModStatusBadge, useDeleteMod, ModsQueries } from '@/features/mods'
import { useQuery } from '@tanstack/vue-query'
import { z } from 'zod'
import type { ModsSchemes } from '@/features/mods'

type ListedEntity = z.infer<typeof ModsSchemes.ListedModScheme>

const rowsPerPage = ref(20)

const offset = ref(0)
const limit = rowsPerPage
const selected = ref<ListedEntity>()

const search = ref('')
const debouncedSearch = useDebounce(search, 500)

const { data, refetch, isFetching, isError } = useQuery(
    computed(() =>
        ModsQueries.list({
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
const beginCreateModInteraction = () => {
    dialog.open(CreateMod, {
        props: {
            class: 'w-full max-w-xl mx-4',
            modal: true,
            header: 'Новый модификатор',
            dismissableMask: true
        } as any
    })
}

const { mutate: deleteMod } = useDeleteMod()
const confirm = useConfirm()
const beginDeleteModInteraction = (mod: ListedEntity) => {
    confirm.require({
        group: 'danger',
        header: 'Вы уверены?',
        message: `Подвердите удаление модификатора: ${mod.name}`,
        acceptLabel: 'Удалить',
        rejectLabel: 'Отмена',
        accept: () => {
            deleteMod(mod)
            selected.value = undefined
        }
    })
}

const beginUpdateModInteraction = (mod: ListedEntity) => {
    dialog.open(UpdateMod, {
        props: {
            class: 'w-full max-w-xl mx-4',
            modal: true,
            header: 'Изменить модификатор',
            dismissableMask: true
        } as any,
        onClose: () => {
            selected.value = undefined
        },
        data: {
            mod
        }
    })
}

const onRowDoubleClick = (event: DataTableRowDoubleClickEvent) => {
    beginUpdateModInteraction(event.data)
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
        command: () => beginCreateModInteraction()
    },
    {
        label: 'Изменить',
        icon: 'pi pi-fw pi-pencil',
        command: () => beginUpdateModInteraction(selected.value!)
    },
    {
        label: 'Удалить',
        icon: 'pi pi-fw pi-times',
        command: () => beginDeleteModInteraction(selected.value!)
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
        <h1 class="my-12 text-center text-3xl font-semibold leading-none text-black">
            Модификаторы
        </h1>

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
                        @click="beginCreateModInteraction()"
                    />
                    <IconField iconPosition="left" class="grow max-lg:order-1 max-lg:w-full">
                        <InputIcon class="pi pi-search"></InputIcon>
                        <InputText v-model="search" placeholder="Поиск" class="w-full" />
                    </IconField>
                    <Button
                        class="shrink-0 max-md:grow"
                        icon="pi pi-pencil"
                        :disabled="!selected"
                        @click="beginUpdateModInteraction(selected!)"
                    />
                    <Button
                        class="shrink-0 max-md:grow"
                        :disabled="!selected"
                        icon="pi pi-times"
                        severity="danger"
                        @click="beginDeleteModInteraction(selected!)"
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
                column-resize-mode="expand"
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
                <Column field="price" header="Цена" />
                <Column field="active" header="Статус">
                    <template #body="slotProps">
                        <ModStatusBadge :code="slotProps.data.active" />
                    </template>
                </Column>
                <Column field="rkeeper_id" header="RKeeper ID" />
                <Column field="rkeeper_group_id" header="RKeeper Group ID" />
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
            </DataTable>
        </div>
    </main>
</template>
