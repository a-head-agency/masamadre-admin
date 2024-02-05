<template>
    <Tag
        v-if="code === 'success'"
        icon="pi pi-fw pi-check-circle"
        value="Сдан"
        severity="success"
    />
    <Tag
        v-else-if="code === 'delivered'"
        icon="pi pi-fw pi-check-circle"
        value="Доставлен"
        severity="success"
    />
    <Tag
        v-else-if="code === 'adopted'"
        icon="pi pi-fw pi-exclamation-circle"
        value="Принят"
        severity="info"
    />
    <Tag v-else-if="code === 'rejected'" icon="pi pi-fw pi-ban" value="Отменён" severity="danger" />
    <Tag
        v-else-if="code === 'wait pay'"
        icon="pi pi-fw pi-clock"
        value="Ожидает оплату"
        severity="warning"
    />
    <Tag v-else-if="code === 'cooking'" icon="pi pi-fw pi-heart-fill" value="Готовится" />
    <Tag v-else-if="code === 'build'" icon="pi pi-fw pi-box" value="Сборка" />
    <Tag v-else-if="code === 'in_way'" icon="pi pi-fw pi-truck" value="В пути" severity="info" />
    <Tag
        v-else
        :value="code.charAt(0).toUpperCase() + code.slice(1) || 'Нет данных'"
        icon="pi pi-fw pi-question-circle"
        severity="danger"
    />
</template>

<script setup lang="ts">
import { toRefs } from 'vue'

const props = defineProps<{
    code: string
}>()

const { code } = toRefs(props)
</script>
