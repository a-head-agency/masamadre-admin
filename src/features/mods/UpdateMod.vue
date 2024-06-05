<template>
    <form class="p-2" @submit="onSubmit">
        <div class="w-full grow">
            <MyInputNumber name="id" label="ID модификатора" disabled/>

            <MyInputText class="w-full" name="name" label="Название" />
            <DropdownSelect
                name="active"
                label="Активен"
                placeholder="Выберите"
                :options="[
                    {
                        label: 'Не активен',
                        code: false
                    },
                    {
                        label: 'Активен',
                        code: true
                    }
                ]"
            >
                <template #value="slotProps">
                    <template v-if="slotProps.value">
                        <ModStatusBadge :code="slotProps.value.code" />
                    </template>
                </template>
                <template #option="slotProps">
                    <ModStatusBadge :code="slotProps.option.code" />
                </template>
            </DropdownSelect>

            <MyInputNumber name="price" label="Цена" />

            <MyInputText name="rkeeper_id" label="RKeeper ID" />
        </div>
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
import { useForm } from 'vee-validate'
import * as yup from 'yup'
import MyInputText from '@/components/MyInputText.vue'
import { useUpdateMod } from './composables'
import { inject } from 'vue'
import type { IMod } from './interfaces'
import ModStatusBadge from './ModStatusBadge.vue'
import MyInputNumber from '@/components/MyInputNumber.vue'
import DropdownSelect from '@/components/DropdownSelect.vue'

const dialogRef = inject('dialogRef') as any
const mod = dialogRef.value.data.mod as IMod

const { handleSubmit } = useForm({
    validationSchema: yup.object({
        id: yup.number().required().label('ID модификатора'),
        name: yup.string().required().label('Название'),
        active: yup.boolean().required().label('Статус'),
        price: yup.number().required().label('Цена'),
        rkeeper_id: yup.string().required().label('RKeeper ID'),
    }),
    initialValues: mod
})

const { mutate, isPending } = useUpdateMod()

const onSubmit = handleSubmit((v) => {
    mutate(v)
})
</script>
