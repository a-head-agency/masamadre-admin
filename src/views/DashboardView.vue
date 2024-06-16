<script setup lang="ts">
import { computed, ref } from 'vue'

import { useInvalidateStats, useStats } from '@/features/stats'

// const dates = ref<Date[]>([])
const defaultFrom = new Date(Date.now() - 2629746000)
const defaultTo = new Date(Date.now())
const dates = ref<Date[]>([defaultFrom, defaultTo])

const from = computed(() => (dates.value[0] ? dates.value[0] : defaultFrom))
const to = computed(() => (dates.value[1] ? dates.value[1] : defaultTo))

const { data: stats } = useStats(
    {
        from,
        to
    },
    (v) => v
)

const invalidateStats = useInvalidateStats()

const refreshStats = () => {
    invalidateStats()
}

const labels = computed(() => stats.value?.stats.map((v) => v.date) || [])
const income = computed(() => stats.value?.stats.map((v) => v.price) || [])
const ordersCount = computed(() => stats.value?.stats.map((v) => v.count) || [])
const newUsersCount = computed(() => stats.value?.stats.map((v) => v.new_users) || [])
</script>

<template>
    <main class="flex flex-col items-stretch px-4 pb-12">
        <h1 class="mb-4 mt-12 text-center text-3xl font-semibold leading-none">Дашборд</h1>

        <div class="mb-4 flex items-center justify-between gap-4">
            <div class="flex justify-center">
                <Calendar
                    v-model="dates"
                    show-button-bar
                    class="w-full"
                    selection-mode="range"
                    :manual-input="false"
                />
            </div>
            <div class="flex justify-end">
                <Button severity="primary" icon="pi pi-refresh" @click="refreshStats" />
            </div>
        </div>
        <div class="mb-16 flex flex-wrap items-stretch gap-4 text-pv-text-color">
            <div class="flex-1 rounded-lg border bg-white/10 p-8">
                <div class="mb-4 flex items-start justify-between gap-4">
                    <div class="shrink-0">
                        <div class="mb-2 font-medium">Заказы</div>
                        <div class="text-lg font-bold">{{ stats?.orders }}</div>
                    </div>
                    <div
                        class="flex aspect-square h-10 shrink-0 items-center justify-center rounded-lg bg-orange-100 text-black"
                    >
                        <i class="pi pi-fw pi-shopping-cart" />
                    </div>
                </div>
            </div>

            <div class="flex-1 rounded-lg border bg-white/10 p-8">
                <div class="mb-4 flex items-start justify-between gap-4">
                    <div class="shrink-0">
                        <div class="mb-2 font-medium">Доход</div>
                        <div class="text-lg font-bold">{{ stats?.price }}</div>
                    </div>
                    <div
                        class="flex aspect-square h-10 shrink-0 items-center justify-center rounded-lg bg-green-100 text-black"
                    >
                        <i class="pi pi-fw pi-money-bill" />
                    </div>
                </div>
                <div class="text-sm">
                    <span class="font-medium text-green-500">{{ stats?.last_price }}</span>
                    последний заказ
                </div>
            </div>

            <div class="flex-1 rounded-lg border bg-white/10 p-8">
                <div class="mb-4 flex items-start justify-between gap-4">
                    <div class="shrink-0">
                        <div class="mb-2 font-medium">Клиенты</div>
                        <div class="text-lg font-bold">{{ stats?.clients_count }}</div>
                    </div>
                    <div
                        class="flex aspect-square h-10 shrink-0 items-center justify-center rounded-lg bg-red-100 text-black"
                    >
                        <i class="pi pi-fw pi-user" />
                    </div>
                </div>
                <div class="text-sm">
                    <span class="font-medium text-green-500">{{ stats?.new_clients }}</span>
                    новых клиентов
                </div>
            </div>

            <div class="flex-1 rounded-lg border bg-white/10 p-8">
                <div class="mb-4 flex items-start justify-between gap-4">
                    <div class="shrink-0">
                        <div class="mb-2 font-medium">Обращения</div>
                        <div class="text-lg font-bold">{{ stats?.new_reviews }} новых</div>
                    </div>
                    <div
                        class="flex aspect-square h-10 shrink-0 items-center justify-center rounded-lg bg-purple-100 text-black"
                    >
                        <i class="pi pi-fw pi-comments" />
                    </div>
                </div>
            </div>
        </div>

        <div class="flex flex-col gap-8 xl:flex-row">
            <div class="flex-1">
                <h2 class="mb-2 text-center text-lg font-bold">Клиенты</h2>
                <Chart
                    class="mb-8 w-full"
                    type="line"
                    :options="{
                        aspectRatio: 1.5
                    }"
                    :data="{
                        labels: labels,
                        datasets: [
                            {
                                label: 'Количество заказов',
                                borderColor: 'rgba(255, 179, 71, 1)',
                                yAxisID: 'y',
                                tension: 0,
                                data: ordersCount,
                                fill: true,
                                backgroundColor: function (context: any) {
                                    const chart = context.chart
                                    const { ctx, chartArea } = chart

                                    // This case happens on initial chart load
                                    if (!chartArea) return
                                    let gradient = ctx.createLinearGradient(
                                        0,
                                        chartArea.bottom,
                                        0,
                                        chartArea.top
                                    )
                                    gradient.addColorStop(1, 'rgba(255, 179, 71, 0.5)')
                                    gradient.addColorStop(0, 'rgba(255, 179, 71, 0)')
                                    return gradient
                                }
                            },
                            {
                                label: 'Новых пользователей',
                                borderColor: 'rgba(127, 0, 255, 1)',
                                yAxisID: 'y',
                                tension: 0,
                                data: newUsersCount,
                                fill: true,
                                backgroundColor: function (context: any) {
                                    const chart = context.chart
                                    const { ctx, chartArea } = chart

                                    // This case happens on initial chart load
                                    if (!chartArea) return
                                    let gradient = ctx.createLinearGradient(
                                        0,
                                        chartArea.bottom,
                                        0,
                                        chartArea.top
                                    )
                                    gradient.addColorStop(1, 'rgba(127, 0, 255, 0.5)')
                                    gradient.addColorStop(0, 'rgba(127, 0, 255, 0)')
                                    return gradient
                                }
                            }
                        ]
                    }"
                />
            </div>

            <div class="flex-1">
                <h2 class="mb-2 text-center text-lg font-bold">Доходы</h2>
                <Chart
                    class="w-full"
                    type="line"
                    :options="{
                        aspectRatio: 1.5
                    }"
                    :data="{
                        labels: labels,
                        datasets: [
                            {
                                label: 'Доход',
                                borderColor: 'rgba(255, 75, 43, 1)',
                                yAxisID: 'y',
                                tension: 0,
                                data: income,
                                fill: true,
                                backgroundColor: function (context: any) {
                                    const chart = context.chart
                                    const { ctx, chartArea } = chart

                                    // This case happens on initial chart load
                                    if (!chartArea) return
                                    let gradient = ctx.createLinearGradient(
                                        0,
                                        chartArea.bottom,
                                        0,
                                        chartArea.top
                                    )
                                    gradient.addColorStop(1, 'rgba(255, 75, 43, 0.5)')
                                    gradient.addColorStop(0, 'rgba(255, 75, 43, 0)')
                                    return gradient
                                }
                            }
                        ]
                    }"
                />
            </div>
        </div>
    </main>
</template>
