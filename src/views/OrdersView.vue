<script setup lang="ts">
import { ref, onMounted, toRaw } from 'vue'
import type { DataTablePageEvent, DataTableRowDoubleClickEvent } from 'primevue/datatable'

import {
    useOrders,
    type IOrder,
    UpdateOrderStatus,
    OrderDetails,
    OrderStatusBadge,
    PaymentStatusBadge
} from '@/features/orders'
import { useDialog } from 'primevue/usedialog'
import dateformat from '@/dateformat'

const rowsPerPage = ref(20)

const offset = ref(0)
const limit = rowsPerPage
const selected = ref<IOrder>()

const { data, isFetching, isError, refetch } = useOrders(
    {
        offset,
        limit,
        search: ''
    },
    (v) => v
)

const onPage = (e: DataTablePageEvent) => {
    offset.value = e.first
    limit.value = e.rows
}

const onRowDoubleClick = (e: DataTableRowDoubleClickEvent) => {
    beginShowOrderDetailsInteraction(e.data)
}

const refresh = () => {
    refetch()
}

const dialog = useDialog()

const cm = ref()
const onRowContextMenu = (event: any) => {
    cm.value.show(event.originalEvent)
}

const beginUpdateOrderStatusInteraction = (order: IOrder) => {
    dialog.open(UpdateOrderStatus, {
        props: {
            class: 'w-full max-w-xl mx-4',
            modal: true,
            header: 'Обновить статус',
            dismissableMask: true
        } as any,
        onClose: () => {
            selected.value = undefined
        },
        data: {
            order: toRaw(order)
        }
    })
}

const beginShowOrderDetailsInteraction = (order: IOrder) => {
    console.log(order)
    dialog.open(OrderDetails, {
        props: {
            class: 'w-full max-w-xl mx-4',
            modal: true,
            header: 'Подробности',
            dismissableMask: true
        } as any,
        onClose: () => {
            selected.value = undefined
        },
        data: {
            order
        }
    })
}

const menuModel = ref([
    {
        label: 'Обновить',
        icon: 'pi pi-fw pi-refresh',
        command: () => refresh()
    },
    {
        label: 'Подробнее',
        icon: 'pi pi-fw pi-search',
        command: () => beginShowOrderDetailsInteraction(selected.value!)
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
        <h1 class="my-12 text-center text-3xl font-semibold leading-none text-white">Заказы</h1>

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
                        class="hidden shrink-0 max-md:grow"
                        icon="pi pi-pencil"
                        :disabled="!selected"
                        @click="beginUpdateOrderStatusInteraction(selected!)"
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
                <Column field="phone" header="Телефон" />
                <Column field="promo" header="Промокод" />
                <Column field="status" header="Статус">
                    <template #body="slotProps">
                        <OrderStatusBadge :code="slotProps.data.status" />
                    </template>
                </Column>
                <Column field="price" header="Сумма">
                    <template #body="slotProps">{{ slotProps.data.price }} ₽</template>
                </Column>
                <Column field="count_items" header="Кол-во позиций" />
                <Column field="pay_type" header="Способ оплаты">
                    <template #body="slotProps">
                        <PaymentStatusBadge :code="slotProps.data.pay_type" />
                    </template>
                </Column>
                <Column field="iiko_id" header="IIKO ID" />
                <Column field="created_at" header="Создан">
                    <template #body="slotProps">
                        {{ dateformat(slotProps.data.created_at) }}
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
