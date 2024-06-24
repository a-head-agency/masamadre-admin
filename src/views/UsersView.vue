<script setup lang="ts">
import { onMounted, ref } from 'vue'

import type { DataTablePageEvent, DataTableRowDoubleClickEvent } from 'primevue/datatable'
import { useDialog } from 'primevue/usedialog'

import dateFormat from '@/common/dateformat'
import useUrlPaggination from '@/common/hooks/use-url-paggination'

import {
    ChangeStatus,
    GiftBonusesToUser,
    SendNotification,
    UserDetails,
    UserRoleBadge,
    UserStatusBadge,
    useUsers,
    type IUser
} from '@/features/users'

const rowsPerPage = ref(20)
const { debouncedSearch, limit, offset, page, search } = useUrlPaggination({ rowsPerPage })

const selected = ref()

const { data, isFetching, isError, refetch } = useUsers(
    {
        limit,
        offset,
        search: debouncedSearch
    },
    (v) => v
)

const onPage = (e: DataTablePageEvent) => {
    page.value = e.page + 1
}

const onRowDoubleClick = (e: DataTableRowDoubleClickEvent) => {
    beginShowUserDetailsInteraction(e.data)
}

const dialog = useDialog()
const beginBlockUnblockUserInteraction = (user: IUser) => {
    dialog.open(ChangeStatus, {
        props: {
            class: 'w-full max-w-xl mx-4',
            modal: true,
            header: 'Изменить статус пользователя',
            dismissableMask: true
        } as any,
        onClose: () => {
            selected.value = undefined
        },
        data: {
            user
        }
    })
}

const beginGiftBonusesToUserInteraction = (user: IUser) => {
    dialog.open(GiftBonusesToUser, {
        props: {
            class: 'w-full max-w-xl mx-4',
            modal: true,
            header: 'Подарить бонусы пользователю',
            dismissableMask: true
        } as any,
        onClose: () => {
            selected.value = undefined
        },
        data: {
            user
        }
    })
}

const beginSendNotificationInteraction = (user: IUser) => {
    dialog.open(SendNotification, {
        props: {
            class: 'w-full max-w-xl mx-4',
            modal: true,
            header: 'Отправить уведомление',
            dismissableMask: true
        } as any,
        onClose: () => {
            selected.value = undefined
        },
        data: {
            user
        }
    })
}

const beginShowUserDetailsInteraction = (user: IUser) => {
    dialog.open(UserDetails, {
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
            user
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
        label: 'Изменить статус',
        icon: 'pi pi-fw pi-user-edit',
        command: () => beginBlockUnblockUserInteraction(selected.value!)
    },
    {
        label: 'Подарить бонусы',
        icon: 'pi pi-fw pi-gift',
        command: () => beginGiftBonusesToUserInteraction(selected.value!)
    },
    {
        label: 'Отправить уведомление',
        icon: 'pi pi-fw pi-bell',
        command: () => beginSendNotificationInteraction(selected.value!)
    },
    {
        label: 'Подробнее',
        icon: 'pi pi-fw pi-search',
        command: () => beginShowUserDetailsInteraction(selected.value!)
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
        <h1 class="my-12 text-center text-3xl font-semibold leading-none text-black">
            Пользователи
        </h1>

        <ContextMenu ref="cm" :model="menuModel" @hide="selected = undefined" />

        <Toolbar>
            <template #center>
                <div class="flex w-full flex-wrap gap-2 lg:gap-4">
                    <Button
                        class="shrink-0 max-lg:grow"
                        icon="pi pi-refresh"
                        :disabled="isFetching"
                        @click="refresh()"
                    />
                    <IconField icon-position="left" class="grow max-lg:order-1 max-lg:w-full">
                        <InputIcon class="pi pi-search"></InputIcon>
                        <InputText v-model="search" placeholder="Поиск" class="w-full" />
                    </IconField>
                    <Button
                        class="shrink-0 max-lg:grow"
                        icon="pi pi-user-edit"
                        :disabled="!selected"
                        @click="beginBlockUnblockUserInteraction(selected!)"
                    />
                    <Button
                        class="shrink-0 max-lg:grow"
                        :disabled="!selected"
                        icon="pi pi-gift"
                        severity="primary"
                        @click="beginGiftBonusesToUserInteraction(selected!)"
                    />
                    <Button
                        class="shrink-0 max-lg:grow"
                        :disabled="!selected"
                        icon="pi pi-bell"
                        severity="primary"
                        @click="beginSendNotificationInteraction(selected!)"
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
                class="h-full overflow-hidden rounded-lg border border-white/10"
                scrollable
                :scroll-height="scrollHeight"
                selection-mode="single"
                context-menu
                :page-link-size="5"
                :paginator-template="{
                    '640px': 'PrevPageLink CurrentPageReport NextPageLink',
                    '960px':
                        'FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink',
                    '1300px': 'FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink'
                }"
                current-page-report-template="{currentPage} из {totalPages}"
                :meta-key-selection="false"
                :value="data?.users"
                lazy
                paginator
                :first="offset"
                :rows="rowsPerPage"
                data-key="id"
                table-style="min-width: 50rem"
                :total-records="data?.total"
                @row-contextmenu="onRowContextMenu"
                @row-dblclick="onRowDoubleClick"
                @page="onPage($event)"
            >
                <Column selection-mode="single" header-style="width: 3rem" />
                <Column field="id" header="ID" />
                <Column field="name" header="Имя" />
                <Column field="surname" header="Фамилия" />
                <Column field="phone" header="Телефон" />
                <Column field="role" header="Роль">
                    <template #body="slotProps">
                        <UserRoleBadge :code="slotProps.data.role" />
                    </template>
                </Column>
                <Column field="status" header="Статус">
                    <template #body="slotProps">
                        <UserStatusBadge :code="slotProps.data.status" />
                    </template>
                </Column>
                <Column field="bonuses" header="Бонусы" />
                <Column field="birthday" header="День рождения">
                    <template #body="slotProps">
                        {{ dateFormat(slotProps.data.birthday, 'dd.mm.yyyy') }}
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
