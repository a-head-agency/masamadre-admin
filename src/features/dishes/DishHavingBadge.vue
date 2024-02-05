<template>
    <Tag v-if="code === false" icon="pi pi-ban" value="Нет в наличии" severity="danger" />
    <Tag v-else-if="code === true" icon="pi pi-check-circle" value="В наличии" severity="success" />
    <Tag
        v-else
        :value="(code != null && code) || 'Нет данных'"
        icon="pi pi-fw pi-question-circle"
        severity="danger"
    />
</template>

<script setup lang="ts">
import { toRefs } from 'vue'

const props = defineProps<{
    code: boolean
}>()

const { code } = toRefs(props)
</script>
