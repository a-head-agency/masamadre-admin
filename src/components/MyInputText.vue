<script setup lang="ts">
import { computed } from 'vue'

import { useField } from 'vee-validate'

const props = defineProps<{
    label: string
    name: string
    type?: string
    initialValue?: string
}>()

const { errorMessage, handleBlur, handleChange, value } = useField<any>(
    () => props.name,
    {},
    {
        initialValue: props.initialValue
    }
)

const inputID = computed(() => `input-text-${props.name}`)
</script>

<template>
    <div class="w-full">
        <label :for="inputID" class="text-900 mb-2 block font-medium">{{ props.label }}</label>
        <InputText
            :id="inputID"
            v-model="value"
            :name="props.name"
            :label="props.label"
            :type="props.type || 'text'"
            class="w-full"
            :class="{
                'p-invalid': errorMessage
            }"
            @blur="handleBlur"
            @change="handleChange"
        />

        <small class="p-error">{{ errorMessage || '&nbsp;' }}</small>
    </div>
</template>
