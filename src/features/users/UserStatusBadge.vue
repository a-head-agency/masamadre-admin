<script setup lang="ts">
import { toRefs } from 'vue'

const props = defineProps<{
    code: number
}>()

const { code } = toRefs(props)
</script>

<template>
    <Tag v-if="code === 0" icon="pi pi-lock" value="Заблокирован" severity="danger" />
    <Tag v-else-if="code === 1" icon="pi pi-check-circle" value="Активен" severity="success" />
    <Tag v-else-if="code === 2" icon="pi pi-clock" value="На модерации" severity="warning" />
    <Tag
        v-else
        :value="(code != null && code) || 'Нет данных'"
        icon="pi pi-fw pi-question-circle"
        severity="danger"
    />
</template>
