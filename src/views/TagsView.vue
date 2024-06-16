<script setup lang="ts">
import { computed, onMounted, ref, unref } from 'vue'

import { useQuery } from '@tanstack/vue-query'
import { useDebounce } from '@vueuse/core'
import { z } from 'zod'

import type { DataTablePageEvent, DataTableRowDoubleClickEvent } from 'primevue/datatable'
import { useConfirm } from 'primevue/useconfirm'
import { useDialog } from 'primevue/usedialog'

import dateFormat from '@/common/dateformat'

import { CreateTag, TagsQueries, TagsSchemes, useDeleteTag } from '@/features/tags'
import UpdateTag from '@/features/tags/UpdateTag.vue'

type ListedEntity = z.infer<typeof TagsSchemes.ListedTagScheme>

const rowsPerPage = ref(20)

const offset = ref(0)
const limit = rowsPerPage
const selected = ref<ListedEntity>()

const search = ref('')
const debouncedSearch = useDebounce(search, 500)

const { data, refetch, isFetching, isError } = useQuery(
    computed(() =>
        TagsQueries.list({
            offset: unref(offset),
            limit: unref(limit),
            search: unref(debouncedSearch)
        })
    )
)

const onPage = (e: DataTablePageEvent) => {
    offset.value = e.first
    limit.value = e.rows
}

const dialog = useDialog()
const beginCreateTagInteraction = () => {
    dialog.open(CreateTag, {
        props: {
            class: 'w-full max-w-xl mx-4',
            modal: true,
            header: 'Новый тег',
            dismissableMask: true
        } as any
    })
}

const { mutate: deleteTag } = useDeleteTag()
const confirm = useConfirm()
const beginDeleteTagInteraction = (entity: ListedEntity) => {
    confirm.require({
        group: 'danger',
        header: 'Вы уверены?',
        message: `Подвердите удаление тега: ${entity.name}`,
        acceptLabel: 'Удалить',
        rejectLabel: 'Отмена',
        accept: () => {
            deleteTag(entity)
            selected.value = undefined
        }
    })
}

const beginUpdateTagInteraction = (entity: ListedEntity) => {
    dialog.open(UpdateTag, {
        props: {
            class: 'w-full max-w-xl mx-4',
            modal: true,
            header: 'Изменить тег',
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

const onRowDoubleClick = (event: DataTableRowDoubleClickEvent) => {
    beginUpdateTagInteraction(event.data)
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
        command: () => beginCreateTagInteraction()
    },
    {
        label: 'Изменить',
        icon: 'pi pi-fw pi-pencil',
        command: () => beginUpdateTagInteraction(selected.value!)
    },
    {
        label: 'Удалить',
        icon: 'pi pi-fw pi-times',
        command: () => beginDeleteTagInteraction(selected.value!)
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
    <main ref="root" class="flex h-screen flex-col items-stretch px-4">
        <h1 class="my-12 text-center text-3xl font-semibold leading-none text-black">Теги</h1>

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
                        @click="beginCreateTagInteraction()"
                    />
                    <IconField icon-position="left" class="grow max-lg:order-1 max-lg:w-full">
                        <InputIcon class="pi pi-search"></InputIcon>
                        <InputText v-model="search" placeholder="Поиск" class="w-full" />
                    </IconField>
                    <Button
                        class="shrink-0 max-md:grow"
                        icon="pi pi-pencil"
                        :disabled="!selected"
                        @click="beginUpdateTagInteraction(selected!)"
                    />
                    <Button
                        class="shrink-0 max-md:grow"
                        :disabled="!selected"
                        icon="pi pi-times"
                        severity="danger"
                        @click="beginDeleteTagInteraction(selected!)"
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
                v-model:selection="selected"
                v-model:contextMenuSelection="selected"
                column-resize-mode="expand"
                size="small"
                scrollable
                :scroll-height="scrollHeight"
                selection-mode="single"
                context-menu
                :meta-key-selection="false"
                class="h-full overflow-hidden rounded-lg border border-white/10"
                :value="data?.list"
                lazy
                paginator
                :first="0"
                :rows="rowsPerPage"
                data-key="id"
                table-style="min-width: 50rem"
                :total-records="data?.total"
                :page-link-size="5"
                :paginator-template="{
                    '640px': 'PrevPageLink CurrentPageReport NextPageLink',
                    '960px':
                        'FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink',
                    '1300px': 'FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink'
                }"
                current-page-report-template="{currentPage} из {totalPages}"
                @row-contextmenu="onRowContextMenu"
                @row-dblclick="onRowDoubleClick"
                @page="onPage($event)"
            >
                <Column selection-mode="single" header-style="width: 3rem" />
                <Column field="id" header="ID" />
                <Column field="img" header="Картинка">
                    <template #body="slotProps">
                        <img
                            :src="slotProps.data.img"
                            alt=""
                            class="aspect-square h-16 rounded-md drop-shadow-md"
                        />
                    </template>
                </Column>
                <Column field="name" header="Название" />
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
