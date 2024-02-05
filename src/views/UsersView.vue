<script setup lang="ts">
import { ref, onMounted } from 'vue'
import type { DataTablePageEvent, DataTableRowDoubleClickEvent } from 'primevue/datatable'
import { useDebounce } from '@vueuse/core'

import dateFormat from 'dateformat'
import {
    ChangeStatus,
    GiftBonusesToUser,
    SendNotification,
    useUsers,
    type IUser,
    UserDetails,
    UserRoleBadge,
    UserStatusBadge
} from '@/features/users'
import { useDialog } from 'primevue/usedialog'

const rowsPerPage = ref(20)

const offset = ref(0)
const limit = rowsPerPage
const search = ref('')
const debouncedSearch = useDebounce(search, 500)

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
    offset.value = e.first
    limit.value = e.rows
}

const onRowDoubleClick = (e: DataTableRowDoubleClickEvent) => {
    beginShowUserDetailsInteraction(e.data)
}

const dialog = useDialog()
const beginBlockUnblockUserInteraction = (user: IUser) => {
    dialog.open(ChangeStatus, {
        props: {
            class: 'w-full max-w-xl',
            modal: true,
            header: 'Изменить статус пользователя'
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
            class: 'w-full max-w-xl',
            modal: true,
            header: 'Подарить бонусы пользователю'
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
            class: 'w-full max-w-xl',
            modal: true,
            header: 'Отправить уведомление'
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
            class: 'w-full max-w-xl',
            modal: true,
            header: 'Подробности'
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
    <main class="flex h-screen flex-col items-stretch px-4" ref="root">
        <h1 class="my-12 text-center text-3xl font-semibold leading-none">
            Пользователи
        </h1>

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
                            <InputText placeholder="Поиск" v-model="search" />
                        </span>
                    </div>

                    <div class="flex flex-1 justify-end gap-2">
                        <Button
                            icon="pi pi-user-edit"
                            :disabled="!selected"
                            @click="beginBlockUnblockUserInteraction(selected!)"
                        />
                        <Button
                            :disabled="!selected"
                            icon="pi pi-gift"
                            severity="primary"
                            @click="beginGiftBonusesToUserInteraction(selected!)"
                        />
                        <Button
                            :disabled="!selected"
                            icon="pi pi-bell"
                            severity="primary"
                            @click="beginSendNotificationInteraction(selected!)"
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
                class="h-full overflow-hidden rounded-lg border border-white/10"
                scrollable
                :scroll-height="scrollHeight"
                v-model:selection="selected"
                selection-mode="single"
                contextMenu
                v-model:contextMenuSelection="selected"
                @rowContextmenu="onRowContextMenu"
                @row-dblclick="onRowDoubleClick"
                :meta-key-selection="false"
                :value="data?.users"
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
