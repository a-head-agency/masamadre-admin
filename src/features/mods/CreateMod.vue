<template>
    <form class="p-2" @submit="onSubmit">
        <div class="flex flex-col items-center justify-between gap-4 md:flex-row">
            <div class="w-full grow">
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

                <MyInputNumber name="price" label="Цена"/>

                <MyInputText name="rkeeper_id" label="RKeeper ID" />
                <MyInputText name="rkeeper_group_id" label="RKeeper Group ID" />
            </div>
        </div>


        <Button
            class="mt-8 flex w-full items-center p-4"
            type="submit"
            label="Создать"
            :loading="isPending"
            :disabled="isPending"
        />
    </form>
</template>

<script setup lang="ts">
import { useForm } from 'vee-validate'
import * as yup from 'yup'
import MyInputText from '@/components/MyInputText.vue'
import DropdownSelect from '@/components/DropdownSelect.vue'
import { useCreateMod } from './composables'
import ModStatusBadge from './ModStatusBadge.vue'
import MyInputNumber from '@/components/MyInputNumber.vue'

const { handleSubmit } = useForm({
    validationSchema: yup.object({
        name: yup.string().required().label('Название'),
        active: yup.boolean().required().label('Статус'),
        price: yup.number().required().label('Цена'),
        rkeeper_id: yup.string().required().label('RKeeper ID'),
        rkeeper_group_id: yup.string().required().label('RKeeper Group ID'),
    }),
    initialValues: {
        active: false
    }
})

const { mutate, isPending } = useCreateMod()

const onSubmit = handleSubmit((v) => {
    mutate(v)
})
</script>
