<script setup lang="ts">
import { useField } from 'vee-validate'

const props = defineProps<{
    name: string
}>()

const { value } = useField<boolean>(() => props.name)
</script>

<template>
    <Checkbox v-model="value" :binary="true" />
</template>
