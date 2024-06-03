<template>
    <form @submit="onSubmit">
        <MyInputNumber name="user_id" label="ID пользователя" disabled />
        <DropdownSelect
            name="status"
            label="Статус"
            placeholder="Выберите"
            :options="possibleStatuses"
        >
            <template #value="slotProps">
                <template v-if="slotProps.value">
                    <UserStatusBadge :code="slotProps.value.code" />
                </template>
            </template>
            <template #option="slotProps">
                <template v-if="slotProps.option">
                    <UserStatusBadge :code="slotProps.option.code" />
                </template>
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

<script setup lang="ts">
import { inject, ref } from 'vue'
import type { IUser } from './interfaces'
import { useChangeUserStatus } from './composables'
import { useForm } from 'vee-validate'
import yup from '@/yup'

import MyInputNumber from '@/components/MyInputNumber.vue'
import DropdownSelect from '@/components/DropdownSelect.vue'
import { UserStatusBadge } from '.'

const dialogRef = inject('dialogRef') as any
const user = dialogRef.value.data.user as IUser

const { handleSubmit } = useForm({
    validationSchema: yup.object({
        user_id: yup.number().required().label('ID пользователя'),
        status: yup.number().required().label('Статус')
    }),
    initialValues: {
        user_id: user.id,
        status: user.status
    }
})

const possibleStatuses = ref([
    { label: 'Заблокирован', code: 0 },
    { label: 'Активен', code: 1 },
    { label: 'На модерации', code: 2 }
])

const { mutateAsync, isPending } = useChangeUserStatus()

const onSubmit = handleSubmit((vals) => {
    mutateAsync(vals).then(dialogRef.value.close)
})
</script>
