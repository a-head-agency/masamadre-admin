<script setup lang="ts">
import { ref, onMounted } from 'vue'
import type { DataTablePageEvent } from 'primevue/datatable'

import { RespondToReview, type IReview, useReviews } from '@/features/reviews'
import { useDialog } from 'primevue/usedialog'
import truncate from 'truncate'

const rowsPerPage = ref(20)

const selected = ref<IReview>()
const offset = ref(0)
const limit = rowsPerPage

const { data, isError, isFetching, refetch } = useReviews(
    {
        limit,
        offset,
        search: ''
    },
    (v) => v
)

const onPage = (e: DataTablePageEvent) => {
    offset.value = e.first
    limit.value = e.rows
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
    },
    {
        label: 'Ответить',
        icon: 'pi pi-fw pi-check',
        command: () => beginRespondToReviewInteraction(selected.value!)
    }
])

const beginRespondToReviewInteraction = (review: IReview) => {
    dialog.open(RespondToReview, {
        props: {
            class: 'w-full max-w-xl',
            modal: true,
            header: 'Ответить на отзыв'
        } as any,
        onClose: () => {
            selected.value = undefined
        },
        data: {
            review
        }
    })
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
    <main class="flex h-screen flex-col items-stretch px-4" ref="root">
        <h1 class="my-12 text-center text-3xl font-semibold leading-none">Отзывы</h1>

        <ContextMenu ref="cm" :model="menuModel" @hide="selected = undefined" />

        <Toolbar class="border-white/10">
            <template #center>
                <div class="flex w-full">
                    <div class="flex flex-1 justify-start gap-2">
                        <Button icon="pi pi-refresh" :disabled="isFetching" @click="refresh()" />
                    </div>

                    <div class="flex flex-1 justify-center">
                        <span class="p-input-icon-left">
                            <i class="pi pi-search" />
                            <InputText placeholder="Поиск" />
                        </span>
                    </div>

                    <div class="flex flex-1 justify-end gap-2">
                        <Button
                            icon="pi pi-check"
                            :disabled="!selected"
                            @click="beginRespondToReviewInteraction(selected!)"
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
                <Column field="id" header="ID"></Column>
                <Column field="user_id" header="ID пользователя"></Column>
                <Column field="name" header="Имя пользователя"></Column>
                <Column field="email" header="Эл. почта"></Column>
                <Column field="text" header="Текст">
                    <template #body="slotProps">
                        {{ truncate(slotProps.data.text, 20) }}
                    </template>
                </Column>
                <Column field="status" header="Статус">
                    <template #body="slotProps">
                        <Tag
                            v-if="slotProps.data.status === 1"
                            icon="pi pi-check-circle"
                            value="Отвечен"
                            severity="success"
                        />
                        <Tag
                            v-else-if="slotProps.data.status === 0"
                            icon="pi pi-times"
                            value="Не отвечен"
                            severity="danger"
                        />
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
