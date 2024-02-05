<script setup lang="ts">
import { ref, onMounted } from 'vue'
import type { DataTablePageEvent } from 'primevue/datatable'

import {
    CreateBanner,
    useBanners,
    DeleteBanner,
    type IBanner,
    EditBanner
} from '@/features/banners'
import { useDialog } from 'primevue/usedialog'
import { useDebounce } from '@vueuse/core'
import dateFormat from 'dateformat'

const rowsPerPage = ref(20)

const offset = ref(0)
const limit = rowsPerPage
const search = ref('')
const debouncedSearch = useDebounce(search, 500)
const selected = ref<any>()

const { data, isFetching, isError, refetch } = useBanners(
    {
        limit,
        offset,
        search: debouncedSearch
    },
    (v) => v
)

const onPage = (e: DataTablePageEvent) => {
    offset.value = e.first
    limit.value = e.rows
}

const dialog = useDialog()

const beginCreateBannerInteraction = () => {
    dialog.open(CreateBanner, {
        props: {
            class: 'max-w-4xl w-full',
            modal: true,
            header: 'Новый баннер'
        } as any,
        onClose: () => (selected.value = undefined)
    })
}

const beginEditBannerInteraction = (banner: IBanner) => {
    dialog.open(EditBanner, {
        props: {
            class: 'max-w-4xl w-full',
            modal: true,
            header: 'Изменить баннер'
        } as any,
        onClose: () => (selected.value = undefined),
        data: {
            banner
        }
    })
}

const beginDeleteBannerInteraction = (banner: IBanner) => {
    dialog.open(DeleteBanner, {
        props: {
            class: 'max-w-xl w-full',
            modal: true,
            header: 'Удалить баннер'
        } as any,
        onClose: () => {
            selected.value = undefined
        },
        data: {
            banner
        }
    })
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
        command: () => beginCreateBannerInteraction()
    },
    {
        label: 'Изменить',
        icon: 'pi pi-fw pi-pencil',
        command: () => beginEditBannerInteraction(selected.value!)
    },
    {
        label: 'Удалить',
        icon: 'pi pi-fw pi-times',
        command: () => beginDeleteBannerInteraction(selected.value!)
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
        <h1 class="my-12 text-center text-3xl font-semibold leading-none">Баннеры</h1>

        <ContextMenu ref="cm" :model="menuModel" @hide="selected = undefined" />

        <Toolbar class="border-white/10">
            <template #center>
                <div class="flex w-full">
                    <div class="flex flex-1 justify-start gap-2">
                        <Button icon="pi pi-refresh" :disabled="isFetching" @click="refresh()" />
                        <Button icon="pi pi-plus" @click="beginCreateBannerInteraction()" />
                    </div>

                    <div class="flex flex-1 justify-center">
                        <span class="p-input-icon-left">
                            <i class="pi pi-search" />
                            <InputText placeholder="Поиск" />
                        </span>
                    </div>

                    <div class="flex flex-1 justify-end gap-2">
                        <Button
                            :disabled="!selected"
                            icon="pi pi-pencil"
                            @click="beginEditBannerInteraction(selected!)"
                        />
                        <Button
                            :disabled="!selected"
                            icon="pi pi-times"
                            severity="danger"
                            @click="beginDeleteBannerInteraction(selected!)"
                        />
                    </div>
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
                <Column field="img" header="Картинка">
                    <template #body="slotProps">
                        <img
                            :src="slotProps.data.img"
                            oner
                            alt=""
                            class="aspect-[30/9] w-[20rem] min-w-[20rem] rounded-md object-cover drop-shadow-md"
                        />
                    </template>
                </Column>
                <Column field="link" header="Ссылка">
                    <template #body="slotProps">
                        <a :href="slotProps.data.link" class="underline">
                            {{ slotProps.data.link }}
                        </a>
                    </template>
                </Column>
                <Column field="active" header="Статус">
                    <template #body="slotProps">
                        <Tag
                            v-if="slotProps.data.active === false"
                            icon="pi pi-lock"
                            value="Не активен"
                            severity="danger"
                        />
                        <Tag
                            v-else-if="slotProps.data.active === true"
                            icon="pi pi-check-circle"
                            value="Активен"
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
