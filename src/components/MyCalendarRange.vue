<script setup lang="ts">
import { v4 as uuidv4 } from 'uuid'
import { useField } from 'vee-validate'

const props = defineProps<{
    name: string
    label: string
}>()

const inputID = uuidv4()

const { errorMessage, value } = useField<Date[]>(() => props.name)
</script>

<template>
    <div class="w-full">
        <label :for="inputID" class="text-900 mb-2 block font-medium">{{ props.label }}</label>
        <Calendar v-model="value" class="w-full" selection-mode="range" :manual-input="false" />
        <small class="p-error">{{ errorMessage || '&nbsp;' }}</small>
    </div>
</template>
