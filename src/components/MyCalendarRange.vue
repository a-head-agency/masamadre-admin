<template>
    <div class="w-full">
        <label :for="inputID" class="text-900 mb-2 block font-medium">{{ props.label }}</label>
        <Calendar class="w-full" v-model="value" selectionMode="range" :manualInput="false" />
        <small class="p-error">{{ errorMessage || '&nbsp;' }}</small>
    </div>
</template>

<script setup lang="ts">
import { useField } from 'vee-validate'
import { v4 as uuidv4 } from 'uuid'

const props = defineProps<{
    name: string
    label: string
}>()

const inputID = uuidv4()

const { errorMessage, value } = useField<Date[]>(() => props.name)
</script>
