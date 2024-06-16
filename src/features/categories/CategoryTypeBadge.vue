<script setup lang="ts">
import { toRefs } from 'vue'

const props = defineProps<{
    code: number
}>()

const { code } = toRefs(props)
</script>

<template>
    <Tag v-if="code === 0" value="Обычная сетка" severity="info" />
    <Tag v-else-if="code === 1" value="Горизонтальный слайдер" severity="info" />
    <Tag v-else-if="code === 2" value="Таблица" severity="info" />
    <Tag
        v-else
        :value="(code != null && code) || 'Нет данных'"
        icon="pi pi-fw pi-question-circle"
        severity="danger"
    />
</template>
