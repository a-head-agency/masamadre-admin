<script setup lang="ts">
import { onMounted, ref } from 'vue'

import type { DataTablePageEvent, DataTableRowDoubleClickEvent } from 'primevue/datatable'
import { useDialog } from 'primevue/usedialog'

import dateFormat from '@/common/dateformat'

import {
    CreateArticle,
    DeleteArticle,
    UpdateArticle,
    useArticles,
    type IBlog
} from '@/features/blogs'

const initialRowsPerPage = 20

const offset = ref(0)
const limit = ref(initialRowsPerPage)
const selected = ref<IBlog>()
const search = ref('')

const { data, isFetching, isError, refetch } = useArticles({ offset, limit }, (v) => v)

const onPage = (e: DataTablePageEvent) => {
    offset.value = e.first
    limit.value = e.rows
}

const dialog = useDialog()

const beginCreateArticleInteraction = () => {
    dialog.open(CreateArticle, {
        props: {
            class: 'max-w-6xl w-full mx-4',
            modal: true,
            header: 'Новая статья',
            dismissableMask: true
        } as any
    })
}

const beginDeleteArticleInteraction = (article: IBlog) => {
    dialog.open(DeleteArticle, {
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
            article
        }
    })
}

const beginUpdateArticleInteraction = (article: IBlog) => {
    dialog.open(UpdateArticle, {
        props: {
            class: 'max-w-6xl w-full mx-4',
            modal: true,
            header: 'Изменить статью',
            dismissableMask: true
        } as any,
        onClose: () => {
            selected.value = undefined
        },
        data: {
            article
        }
    })
}

const onRowDoubleClick = (event: DataTableRowDoubleClickEvent) => {
    beginUpdateArticleInteraction(event.data)
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
        command: () => beginCreateArticleInteraction()
    },
    {
        label: 'Изменить',
        icon: 'pi pi-fw pi-pencil',
        command: () => beginUpdateArticleInteraction(selected.value!)
    },
    {
        label: 'Удалить',
        icon: 'pi pi-fw pi-times',
        command: () => beginDeleteArticleInteraction(selected.value!)
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
        <h1 class="my-12 text-center text-3xl font-semibold leading-none text-black">Статьи</h1>

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
                        @click="beginCreateArticleInteraction()"
                    />
                    <IconField icon-position="left" class="grow max-lg:order-1 max-lg:w-full">
                        <InputIcon class="pi pi-search"></InputIcon>
                        <InputText v-model="search" placeholder="Поиск" class="w-full" />
                    </IconField>
                    <Button
                        class="shrink-0 max-md:grow"
                        icon="pi pi-pencil"
                        :disabled="!selected"
                        @click="beginUpdateArticleInteraction(selected!)"
                    />
                    <Button
                        class="shrink-0 max-md:grow"
                        :disabled="!selected"
                        icon="pi pi-times"
                        severity="danger"
                        @click="beginDeleteArticleInteraction(selected!)"
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
                :rows="initialRowsPerPage"
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
                            class="aspect-[3/4] w-[5rem] min-w-[5rem] rounded-md object-cover drop-shadow-md"
                        />
                    </template>
                </Column>

                <Column field="name" header="Название" />
                <Column fiend="active" header="Активность">
                    <template #body="slotProps">
                        <Tag
                            v-if="slotProps.data.active === false"
                            icon="pi pi-ban"
                            value="Не активна"
                            severity="danger"
                        />
                        <Tag
                            v-else-if="slotProps.data.active === true"
                            icon="pi pi-check-circle"
                            value="Активна"
                            severity="success"
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
