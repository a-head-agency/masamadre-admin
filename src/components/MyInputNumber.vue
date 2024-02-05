<template>
    <div class="w-full">
        <label :for="inputID" class="text-900 mb-2 block font-medium">{{ props.label }}</label>
        <InputNumber
            :id="inputID"
            v-model="value"
            :name="props.name"
            :label="props.label"
            class="w-full"
            :class="{
                'p-invalid': errorMessage
            }"
            :mode="props.mode"
            :currency="props.currency"
            :disabled="props.disabled"
            :min-fraction-digits="props.minFractionDigits"
            :max-fraction-digits="props.maxFractionDigits"
        />

        <small class="p-error">{{ errorMessage || '&nbsp;' }}</small>
    </div>
</template>

<script setup lang="ts">
import { useField } from 'vee-validate'
import { computed } from 'vue'

const props = defineProps<{
    label: string
    name: string
    mode?: 'currency' | 'decimal'
    currency?: string
    initialValue?: number
    disabled?: boolean
    minFractionDigits?: number
    maxFractionDigits?: number
}>()

const { errorMessage, value } = useField<any>(
    () => props.name,
    {},
    {
        initialValue: props.initialValue
    }
)

const inputID = computed(() => `input-number-${props.name}`)
</script>
