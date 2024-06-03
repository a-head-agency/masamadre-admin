<template>
    <form class="p-2" @submit.prevent="onSubmit">
        <h2 class="section-header">Общая информация</h2>
        <div class="mb-8 grid grid-flow-row grid-cols-1 gap-4 lg:grid-cols-2">
            <MyInputNumber name="id" label="ID" disabled />
            <MyInputText name="org_id" label="ID организации" />
            <MyInputText class="col-span-full" name="name" label="Название" />
            <MyInputText name="terminal_id" label="ID терминала" />
            <MyInputText name="curier_card" label="ID оплаты картой курьеру" />
            <MyInputText name="online" label="ID оплаты онлайн" />
            <MyInputText name="cash" label="ID оплаты наличными" />
            <MyInputText name="type_rest" label="Тип заказа ресторана" />
            <MyInputText name="type_curier" label="Тип доставки ресторана" />
        </div>

        <h2 class="section-header">ЮКасса</h2>
        <div class="mb-8 flex flex-col gap-4">
            <MyInputText name="yookassa_id" label="ID" />
            <MyInputText name="yookassa_key" label="Ключ" />
        </div>

        <h2 class="section-header">Локация</h2>
        <div class="mb-8 grid grid-flow-row grid-cols-1 gap-4 lg:grid-cols-2">
            <MyInputText class="col-span-full" name="adres" label="Адрес" />
            <MyInputNumber name="lat" label="Широта" />
            <MyInputNumber name="lng" label="Долгота" />
        </div>

        <h2 class="section-header">GeoJson</h2>
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

        <h2 class="section-header">Часы работы</h2>

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
            label="Изменить"
            :loading="updateRestaurantMutation.isPending"
            :disabled="updateRestaurantMutation.isPending"
        />
    </form>
</template>

<script setup lang="ts">
import { useMutation, useQuery, useQueryClient } from '@tanstack/vue-query'
import { reactive, inject, computed } from 'vue'
import { axiosPrivate } from '@/network'
import { useToast } from 'primevue/usetoast'
import { useFieldValue, useForm } from 'vee-validate'
import * as yup from 'yup'
import MyUploadFile from '@/components/MyUploadFile.vue'
import MyInputText from '@/components/MyInputText.vue'
import MyInputNumber from '@/components/MyInputNumber.vue'
import DropdownSelect from '@/components/DropdownSelect.vue'
import MyInputCheckbox from '@/components/MyInputCheckbox.vue'
import MyTimeSelector from '@/components/MyTimeSelector.vue'
import { RestsQueries, type RestsSchemes } from '.'
import type { z } from 'zod'

type Entity = z.infer<typeof RestsSchemes.ListedRestScheme>

const dialogRef = inject('dialogRef') as any
const entity = dialogRef.value.data.entity as Entity

const toast = useToast()
const queryClient = useQueryClient()

const updateRestaurantMutation = reactive(
    useMutation({
        mutationFn: async (payload: any) => axiosPrivate.put('admin/rest', payload),
        onSuccess(data, variables) {
            toast.add({
                severity: 'success',
                life: 3000,
                summary: 'Успешно',
                detail: `Ресторан ${variables.name} изменен`
            })
            queryClient.invalidateQueries({
                queryKey: RestsQueries._def
            })
        },
        onError(error: any) {
            toast.add({
                severity: 'error',
                life: 3000,
                summary: 'Не удалось изменить ресторан',
                detail: error
            })
        }
    })
)

const { data } = useQuery(RestsQueries.detail({ id: entity.id }))

const { handleSubmit } = useForm<any>({
    // prettier-ignore
    validationSchema: yup.object({
        id: yup.string().required().label('ID ресторана'),
        name: yup.string().required().label('Название ресторана'),
        adres: yup.string().required().label('Адрес ресторана'),
        lat: yup.number().required().label('Широта'),
        lng: yup.number().required().label('Долгота'),
        geo: yup.string().required().label('GeoJson'),
        active: yup.boolean().required().label('Активен'),
        org_id: yup.string().label('ID организации'),
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
    }),
    initialValues: computed(() => {
        if (data.value) {
            return {
                id: data.value.id,
                name: data.value.name,
                adres: data.value.adres,
                lat: data.value.lat,
                lng: data.value.lng,
                geo: data.value.geo,
                active: data.value.active,
                org_id: data.value.org_id,
                terminal_id: data.value.terminal_id,
                cash: data.value.cash,
                online: data.value.online,
                curier_card: data.value.curier_card,
                type_rest: data.value.type_rest,
                type_curier: data.value.type_curier,

                yookassa_id: data.value.yookassa_id,
                yookassa_key: data.value.yookassa_key,

                setMon: data.value.mon_from && data.value.mon_from !== -1,
                setThu: data.value.thu_from && data.value.thu_from !== -1,
                setWed: data.value.wed_from && data.value.wed_from !== -1,
                setThurs: data.value.thurs_from && data.value.thurs_from !== -1,
                setFri: data.value.fri_from && data.value.fri_from !== -1,
                setSat: data.value.sat_from && data.value.sat_from !== -1,
                setSun: data.value.sun_from && data.value.sun_from !== -1,

                mon_from: data.value.mon_from === -1 ? undefined : data.value.mon_from,
                mon_to: data.value.mon_to === -1 ? undefined : data.value.mon_to,
                thu_from: data.value.thu_from === -1 ? undefined : data.value.thu_from,
                thu_to: data.value.thu_to === -1 ? undefined : data.value.thu_to,
                wed_from: data.value.wed_from === -1 ? undefined : data.value.wed_from,
                wed_to: data.value.wed_to === -1 ? undefined : data.value.wed_to,
                thurs_from: data.value.thurs_from === -1 ? undefined : data.value.thurs_from,
                thurs_to: data.value.thurs_to === -1 ? undefined : data.value.thurs_to,
                fri_from: data.value.fri_from === -1 ? undefined : data.value.fri_from,
                fri_to: data.value.fri_to === -1 ? undefined : data.value.fri_to,
                sat_from: data.value.sat_from === -1 ? undefined : data.value.sat_from,
                sat_to: data.value.sat_to === -1 ? undefined : data.value.sat_to,
                sun_from: data.value.sun_from === -1 ? undefined : data.value.sun_from,
                sun_to: data.value.sun_to === -1 ? undefined : data.value.sun_to
            }
        }
        return {}
    })
})

const setMon = useFieldValue<boolean>('setMon')
const setThu = useFieldValue<boolean>('setThu')
const setWed = useFieldValue<boolean>('setWed')
const setThurs = useFieldValue<boolean>('setThurs')
const setFri = useFieldValue<boolean>('setFri')
const setSat = useFieldValue<boolean>('setSat')
const setSun = useFieldValue<boolean>('setSun')

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

    updateRestaurantMutation.mutate(v)
})
</script>
