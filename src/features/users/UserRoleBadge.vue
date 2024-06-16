<script setup lang="ts">
import { toRefs } from 'vue'

const props = defineProps<{
    code: string
}>()

const { code } = toRefs(props)
</script>

<template>
    <Tag v-if="code === 'user'" icon="pi pi-user" value="Обычный" severity="info"></Tag>
    <Tag v-else-if="code === 'admin'" icon="pi pi-bolt" value="Админ" severity="warning"></Tag>
    <Tag
        v-else
        :value="(code && code.charAt(0).toUpperCase() + code.slice(1)) || 'Нет данных'"
        icon="pi pi-fw pi-question-circle"
        severity="danger"
    />
</template>
