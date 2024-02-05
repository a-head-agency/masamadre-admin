<template>
    <Tag v-if="code === -2" icon="pi pi-fw pi-money-bill" value="Наличные" />
    <Tag v-else-if="code === -1" icon="pi pi-fw pi-credit-card" value="Картой при получении" />
    <Tag v-else-if="code >= 0" icon="pi pi-fw pi-credit-card" value="Картой на сайте" />
    <Tag
        v-else
        :value="code || 'Нет данных'"
        icon="pi pi-fw pi-question-circle"
        severity="danger"
    />
</template>

<script setup lang="ts">
import { toRefs } from 'vue'

const props = defineProps<{
    code: number
}>()

const { code } = toRefs(props)
</script>
