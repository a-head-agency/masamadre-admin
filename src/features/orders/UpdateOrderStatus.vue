<script setup lang="ts">
import { inject } from 'vue'

import { useForm } from 'vee-validate'
import * as yup from 'yup'

import DropdownSelect from '@/components/DropdownSelect.vue'
import MyInputNumber from '@/components/MyInputNumber.vue'

import { useUpdateOrderStatus } from './composables'
import type { IOrder } from './interfaces'

const dialogRef = inject('dialogRef') as any
const order = dialogRef.value.data.order as IOrder

const { handleSubmit } = useForm({
    validationSchema: yup.object({
        id: yup.number().required().label('ID заказа'),
        status: yup.string().required().label('Статус')
    }),
    initialValues: {
        id: order.id,
        status: order.status
    }
})

const { mutate, isPending } = useUpdateOrderStatus()

const onSubmit = handleSubmit((v) => {
    mutate(v)
})
</script>

<template>
    <form class="p-2" @submit="onSubmit">
        <MyInputNumber name="id" label="ID заказа" disabled />
        <DropdownSelect
            name="status"
            label="Статус"
            placeholder="Выберите"
            :options="[
                {
                    label: 'Ожидает подтверждения админа',
                    code: 'waitAdmin'
                },
                {
                    label: 'Отменён клиентом',
                    code: 'rejectedByUser'
                },
                {
                    label: 'Отменён админом',
                    code: 'rejectedByAdmin'
                },
                {
                    label: 'Отменён',
                    code: 'rejected'
                },
                {
                    label: 'Ожидает оплаты',
                    code: 'wait pay'
                },
                {
                    label: 'Готовится',
                    code: 'cooking'
                },
                {
                    label: 'В процессе',
                    code: 'process'
                },
                {
                    label: 'В пути',
                    code: 'deliver'
                },
                {
                    label: 'Выполнен',
                    code: 'accepted'
                }
            ]"
        >
            <template #value="slotProps">
                <template v-if="slotProps.value">
                    <Tag
                        v-if="slotProps.value.code === 'accepted'"
                        icon="pi pi-fw pi-check-circle"
                        :value="slotProps.value.label"
                        severity="success"
                    />
                    <Tag
                        v-else-if="slotProps.value.code === 'delivered'"
                        icon="pi pi-fw pi-check-circle"
                        :value="slotProps.value.label"
                        severity="success"
                    />
                    <Tag
                        v-else-if="slotProps.value.code === 'waitAdmin'"
                        icon="pi pi-fw pi-exclamation-circle"
                        :value="slotProps.value.label"
                        severity="warning"
                    />
                    <Tag
                        v-else-if="slotProps.value.code === 'rejectedByUser'"
                        icon="pi pi-fw pi-ban"
                        :value="slotProps.value.label"
                        severity="danger"
                    />
                    <Tag
                        v-else-if="slotProps.value.code === 'rejectedByAdmin'"
                        icon="pi pi-fw pi-ban"
                        :value="slotProps.value.label"
                        severity="danger"
                    />
                    <Tag
                        v-else-if="slotProps.value.code === 'rejected'"
                        icon="pi pi-fw pi-ban"
                        :value="slotProps.value.label"
                        severity="danger"
                    />
                    <Tag
                        v-else-if="slotProps.value.code === 'wait pay'"
                        icon="pi pi-fw pi-clock"
                        :value="slotProps.value.label"
                        severity="warning"
                    />
                    <Tag
                        v-else-if="slotProps.value.code === 'cooking'"
                        icon="pi pi-fw pi-heart-fill"
                        :value="slotProps.value.label"
                    />
                    <Tag
                        v-else-if="slotProps.value.code === 'process'"
                        icon="pi pi-fw pi-clock"
                        :value="slotProps.value.label"
                    />
                    <Tag
                        v-else-if="slotProps.value.code === 'deliver'"
                        icon="pi pi-fw pi-truck"
                        :value="slotProps.value.label"
                        severity="info"
                    />
                </template>
            </template>
            <template #option="slotProps">
                <Tag
                    v-if="slotProps.option.code === 'accepted'"
                    icon="pi pi-fw pi-check-circle"
                    :value="slotProps.option.label"
                    severity="success"
                />
                <Tag
                    v-else-if="slotProps.option.code === 'delivered'"
                    icon="pi pi-fw pi-check-circle"
                    :value="slotProps.option.label"
                    severity="success"
                />
                <Tag
                    v-else-if="slotProps.option.code === 'waitAdmin'"
                    icon="pi pi-fw pi-exclamation-circle"
                    :value="slotProps.option.label"
                    severity="warning"
                />
                <Tag
                    v-else-if="slotProps.option.code === 'rejectedByUser'"
                    icon="pi pi-fw pi-ban"
                    :value="slotProps.option.label"
                    severity="danger"
                />
                <Tag
                    v-else-if="slotProps.option.code === 'rejectedByAdmin'"
                    icon="pi pi-fw pi-ban"
                    :value="slotProps.option.label"
                    severity="danger"
                />
                <Tag
                    v-else-if="slotProps.option.code === 'rejected'"
                    icon="pi pi-fw pi-ban"
                    :value="slotProps.option.label"
                    severity="danger"
                />
                <Tag
                    v-else-if="slotProps.option.code === 'wait pay'"
                    icon="pi pi-fw pi-clock"
                    :value="slotProps.option.label"
                    severity="warning"
                />
                <Tag
                    v-else-if="slotProps.option.code === 'cooking'"
                    icon="pi pi-fw pi-heart-fill"
                    :value="slotProps.option.label"
                />
                <Tag
                    v-else-if="slotProps.option.code === 'process'"
                    icon="pi pi-fw pi-clock"
                    :value="slotProps.option.label"
                />
                <Tag
                    v-else-if="slotProps.option.code === 'deliver'"
                    icon="pi pi-fw pi-truck"
                    :value="slotProps.option.label"
                    severity="info"
                />
            </template>
        </DropdownSelect>
        <Button
            class="mt-8 flex w-full items-center p-4"
            type="submit"
            label="Сохранить"
            :loading="isPending"
            :disabled="isPending"
        />
    </form>
</template>
