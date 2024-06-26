<script setup lang="ts">
import { onMounted, ref } from 'vue'

import truncate from 'truncate'

import type { DataTablePageEvent, DataTableRowDoubleClickEvent } from 'primevue/datatable'
import { useDialog } from 'primevue/usedialog'

import useUrlPaggination from '@/common/hooks/use-url-paggination'

import { RespondToReview, useReviews, type IReview } from '@/features/reviews'

const rowsPerPage = ref(20)
const { limit, offset, page } = useUrlPaggination({ rowsPerPage })

const selected = ref<IReview>()

const { data, isError, isFetching, refetch } = useReviews(
    {
        limit,
        offset,
        search: ''
    },
    (v) => v
)

const onPage = (e: DataTablePageEvent) => {
    page.value = e.page + 1
}

const refresh = () => {
    refetch()
}

const dialog = useDialog()

const cm = ref()
const onRowContextMenu = (event: any) => {
    cm.value.show(event.originalEvent)
}
const menuModel = ref([
    {
        label: 'Обновить',
        icon: 'pi pi-fw pi-refresh',
        command: () => refresh()
    }
])

const beginRespondToReviewInteraction = (review: IReview) => {
    dialog.open(RespondToReview, {
        props: {
            class: 'w-full max-w-xl mx-4',
            modal: true,
            header: 'Ответить на обращение',
            dismissableMask: true
        } as any,
        onClose: () => {
            selected.value = undefined
        },
        data: {
            review
        }
    })
}

const onRowDoubleClick = (event: DataTableRowDoubleClickEvent) => {
    beginRespondToReviewInteraction(event.data)
}

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
        <h1 class="my-12 text-center text-3xl font-semibold leading-none text-black">Обращения</h1>

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
                    <IconField icon-position="left" class="grow max-lg:order-1 max-lg:w-full">
                        <InputIcon class="pi pi-search"></InputIcon>
                        <InputText disabled placeholder="Поиск" class="w-full" />
                    </IconField>
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
                :first="offset"
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
                <Column field="id" header="ID"></Column>
                <Column field="phone" header="Телефон"></Column>
                <Column field="name" header="Имя пользователя"></Column>
                <Column field="email" header="Эл. почта"></Column>
                <Column field="text" header="Текст">
                    <template #body="slotProps">
                        {{ truncate(slotProps.data.text, 20) }}
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
