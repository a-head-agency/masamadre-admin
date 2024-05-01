<template>
    <form class="p-2" @submit.prevent="onSubmit">
        <h2 class="mb-4 text-lg font-bold">Общая информация</h2>
        <div class="mb-8 grid grid-flow-row grid-cols-1 gap-4 lg:grid-cols-2">
            <MyInputText name="name" label="Название" />
            <MyInputText name="org_id" label="ID организации" />
            <MyInputText name="terminal_id" label="ID терминала" />
            <MyInputText name="curier_card" label="ID оплаты картой курьеру" />
            <MyInputText name="online" label="ID оплаты онлайн" />
            <MyInputText name="cash" label="ID оплаты наличными" />
            <MyInputText name="type_rest" label="Тип заказа ресторана" />
            <MyInputText name="type_curier" label="Тип доставки ресторана" />
        </div>

        <h2 class="mb-4 text-lg font-bold">ЮКасса</h2>
        <div class="mb-8 flex flex-col gap-4">
            <MyInputText name="yookassa_id" label="ID" />
            <MyInputText name="yookassa_key" label="Ключ" />
        </div>

        <h2 class="mb-4 text-lg font-bold">Локация</h2>
        <div class="mb-8 grid grid-flow-row grid-cols-1 gap-4 lg:grid-cols-2">
            <MyInputText class="col-span-full" name="adres" label="Адрес" />
            <MyInputNumber
                name="lat"
                label="Широта"
                :minFractionDigits="2"
                :maxFractionDigits="6"
            />
            <MyInputNumber
                name="lng"
                label="Долгота"
                :minFractionDigits="2"
                :maxFractionDigits="6"
            />
        </div>

        <h2 class="mb-4 text-lg font-bold">GeoJson</h2>
        <MyUploadFile
            class="mb-8"
            name="geo"
            uploadRoute="admin/upload"
            filenamePropInRequest="file"
            filenamePropInResponse="link"
        />

        <DropdownSelect
            class="mb-8"
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
                    <Tag
                        v-if="slotProps.value.code === false"
                        icon="pi pi-ban"
                        :value="slotProps.value.label"
                        severity="danger"
                    />
                    <Tag
                        v-else-if="slotProps.value.code === true"
                        icon="pi pi-check-circle"
                        :value="slotProps.value.label"
                        severity="success"
                    />
                </template>
            </template>
            <template #option="slotProps">
                <Tag
                    v-if="slotProps.option.code === false"
                    icon="pi pi-ban"
                    :value="slotProps.option.label"
                    severity="danger"
                />
                <Tag
                    v-else-if="slotProps.option.code === true"
                    icon="pi pi-check-circle"
                    :value="slotProps.option.label"
                    severity="success"
                />
            </template>
        </DropdownSelect>

        <h2 class="mb-4 text-lg font-bold">Часы работы</h2>

        <div class="flex flex-col gap-2">
            <div
                class="flex items-center justify-between gap-2 leading-none transition-opacity"
                :class="{
                    'opacity-50': !setMon
                }"
            >
                <MyInputCheckbox name="setMon" />
                <span>Понедельник</span>
                <div
                    class="grow border-b-2 border-dashed border-black/50"
                    style="height: 1em"
                ></div>
                <div class="flex items-center gap-2">
                    С
                    <MyTimeSelector
                        name="mon_from"
                        class="input-text-center w-20"
                        :disabled="!setMon"
                    />
                    до
                    <MyTimeSelector
                        name="mon_to"
                        class="input-text-center w-20"
                        :disabled="!setMon"
                    />
                </div>
            </div>

            <div
                class="flex items-center justify-between gap-2 leading-none"
                :class="{
                    'opacity-50': !setThu
                }"
            >
                <MyInputCheckbox name="setThu" />
                <span>Вторник</span>
                <div
                    class="grow border-b-2 border-dashed border-black/50"
                    style="height: 1em"
                ></div>
                <div class="flex items-center gap-2">
                    С
                    <MyTimeSelector
                        name="thu_from"
                        class="input-text-center w-20"
                        :disabled="!setThu"
                    />
                    до
                    <MyTimeSelector
                        name="thu_to"
                        class="input-text-center w-20"
                        :disabled="!setThu"
                    />
                </div>
            </div>

            <div
                class="flex items-center justify-between gap-2 leading-none"
                :class="{
                    'opacity-50': !setWed
                }"
            >
                <MyInputCheckbox name="setWed" />
                <span>Среда</span>
                <div
                    class="grow border-b-2 border-dashed border-black/50"
                    style="height: 1em"
                ></div>
                <div class="flex items-center gap-2">
                    С
                    <MyTimeSelector
                        name="wed_from"
                        class="input-text-center w-20"
                        :disabled="!setWed"
                    />
                    до
                    <MyTimeSelector
                        name="wed_to"
                        class="input-text-center w-20"
                        :disabled="!setWed"
                    />
                </div>
            </div>

            <div
                class="flex items-center justify-between gap-2 leading-none"
                :class="{
                    'opacity-50': !setThurs
                }"
            >
                <MyInputCheckbox name="setThurs" />
                <span>Четверг</span>
                <div
                    class="grow border-b-2 border-dashed border-black/50"
                    style="height: 1em"
                ></div>
                <div class="flex items-center gap-2">
                    С
                    <MyTimeSelector
                        name="thurs_from"
                        class="input-text-center w-20"
                        :disabled="!setThurs"
                    />
                    до
                    <MyTimeSelector
                        name="thurs_to"
                        class="input-text-center w-20"
                        :disabled="!setThurs"
                    />
                </div>
            </div>

            <div
                class="flex items-center justify-between gap-2 leading-none"
                :class="{
                    'opacity-50': !setFri
                }"
            >
                <MyInputCheckbox name="setFri" />
                <span>Пятница</span>
                <div
                    class="grow border-b-2 border-dashed border-black/50"
                    style="height: 1em"
                ></div>
                <div class="flex items-center gap-2">
                    С
                    <MyTimeSelector
                        name="fri_from"
                        class="input-text-center w-20"
                        :disabled="!setFri"
                    />
                    до
                    <MyTimeSelector
                        name="fri_to"
                        class="input-text-center w-20"
                        :disabled="!setFri"
                    />
                </div>
            </div>

            <div
                class="flex items-center justify-between gap-2 leading-none"
                :class="{
                    'opacity-50': !setSat
                }"
            >
                <MyInputCheckbox name="setSat" />
                <span>Суббота</span>
                <div
                    class="grow border-b-2 border-dashed border-black/50"
                    style="height: 1em"
                ></div>
                <div class="flex items-center gap-2">
                    С
                    <MyTimeSelector
                        name="sat_from"
                        class="input-text-center w-20"
                        :disabled="!setSat"
                    />
                    до
                    <MyTimeSelector
                        name="sat_to"
                        class="input-text-center w-20"
                        :disabled="!setSat"
                    />
                </div>
            </div>

            <div
                class="flex items-center justify-between gap-2 leading-none"
                :class="{
                    'opacity-50': !setSun
                }"
            >
                <MyInputCheckbox name="setSun" />
                <span>Воскресенье</span>
                <div
                    class="grow border-b-2 border-dashed border-black/50"
                    style="height: 1em"
                ></div>
                <div class="flex items-center gap-2">
                    С
                    <MyTimeSelector
                        name="sun_from"
                        class="input-text-center w-20"
                        :disabled="!setSun"
                    />
                    до
                    <MyTimeSelector
                        name="sun_to"
                        class="input-text-center w-20"
                        :disabled="!setSun"
                    />
                </div>
            </div>
        </div>

        <Button
            class="mt-8 flex w-full items-center p-4"
            type="submit"
            label="Создать"
            :loading="isLoading"
            :disabled="isLoading"
        />
    </form>
</template>

<script setup lang="ts">
import { useFieldValue, useForm } from 'vee-validate'
import * as yup from 'yup'
import MyInputText from '@/components/MyInputText.vue'
import MyInputNumber from '@/components/MyInputNumber.vue'
import MyUploadFile from '@/components/MyUploadFile.vue'
import DropdownSelect from '@/components/DropdownSelect.vue'
import { useCreateRestaurant } from './composables'
import MyTimeSelector from '@/components/MyTimeSelector.vue'
import MyInputCheckbox from '@/components/MyInputCheckbox.vue'

// prettier-ignore
const schema = yup.object({
    name: yup.string().required().label('Название ресторана'),
    adres: yup.string().required().label('Адрес ресторана'),
    lat: yup.number().required().label('Широта'),
    lng: yup.number().required().label('Долгота'),
    geo: yup.string().label('GeoJson'),
    org_id: yup.string().required().label('ID организации'),
    terminal_id: yup.string().label('ID терминала'),
    curier_card: yup.string().label('ID оплаты картой курьеру'),
    online: yup.string().label('ID оплаты онлайн'),
    cash: yup.string().label('ID оплаты наличными'),
    type_rest: yup.string().label('Тип заказа ресторана'),
    type_curier: yup.string().label('Тип доставки ресторана'),

    yookassa_id: yup.string().label('ЮКасса ID'),
    yookassa_key: yup.string().label('ЮКасса Key'),

    setMon: yup.boolean(),
    setThu: yup.boolean(),
    setWed: yup.boolean(),
    setThurs: yup.boolean(),
    setFri: yup.boolean(),
    setSat: yup.boolean(),
    setSun: yup.boolean(),

    mon_from: yup.date().when('setMon', { is: true, then: (schema) => schema.required() }),
    mon_to: yup.date().when('setMon', { is: true, then: (schema) => schema.required() }),

    thu_from: yup.date().when('setThu', { is: true, then: (schema) => schema.required() }),
    thu_to: yup.date().when('setThu', { is: true, then: (schema) => schema.required() }),

    wed_from: yup.date().when('setWed', { is: true, then: (schema) => schema.required() }),
    wed_to: yup.date().when('setWed', { is: true, then: (schema) => schema.required() }),

    thurs_from: yup.date().when('setThurs', { is: true, then: (schema) => schema.required() }),
    thurs_to: yup.date().when('setThurs', { is: true, then: (schema) => schema.required() }),

    fri_from: yup.date().when('setFri', { is: true, then: (schema) => schema.required() }),
    fri_to: yup.date().when('setFri', { is: true, then: (schema) => schema.required() }),

    sat_from: yup.date().when('setSat', { is: true, then: (schema) => schema.required() }),
    sat_to: yup.date().when('setSat', { is: true, then: (schema) => schema.required() }),

    sun_from: yup.date().when('setSun', { is: true, then: (schema) => schema.required() }),
    sun_to: yup.date().when('setSun', { is: true, then: (schema) => schema.required() })
})

const { handleSubmit } = useForm<any>({
    validationSchema: schema,
    initialValues: {
        setMon: false,
        setThu: false,
        setWed: false,
        setThurs: false,
        setFri: false,
        setSat: false,
        setSun: false
    }
})

const setMon = useFieldValue<boolean>('setMon')
const setThu = useFieldValue<boolean>('setThu')
const setWed = useFieldValue<boolean>('setWed')
const setThurs = useFieldValue<boolean>('setThurs')
const setFri = useFieldValue<boolean>('setFri')
const setSat = useFieldValue<boolean>('setSat')
const setSun = useFieldValue<boolean>('setSun')

const { mutate, isLoading } = useCreateRestaurant()

const onSubmit = handleSubmit((v) => {
    // prettier-ignore
    {
        if (!v.setMon) { v.mon_from = -1; v.mon_to = -1 }
        if (!v.setThu) { v.thu_from = -1; v.thu_to = -1 }
        if (!v.setWed) { v.wed_from = -1; v.wed_to = -1 }
        if (!v.setThurs) { v.thurs_from = -1; v.thurs_to = -1 }
        if (!v.setFri) { v.fri_from = -1; v.fri_to = -1 }
        if (!v.setSat) { v.sat_from = -1; v.sat_to = -1 }
        if (!v.setSun) { v.sun_from = -1; v.sun_to = -1 }
    }

    delete v.setMon
    delete v.setThu
    delete v.setWed
    delete v.setThurs
    delete v.setFri
    delete v.setSat
    delete v.setSun

    mutate(v)
})
</script>

<style>
.input-text-center input {
    @apply text-center;
}
</style>
