<script setup lang="ts">
import { computed, ref, watch } from 'vue'

import { useField } from 'vee-validate'

const props = defineProps<{
    options: { code: any; label: any }[]
    placeholder?: string
    name: string
    label: string
}>()

const inputID = computed(() => `select-${props.name}`)
const selected = ref<(typeof props.options)[0]>()

const { setValue, errorMessage, handleBlur, handleChange, value } = useField(() => props.name)

watch([selected], () => {
    setValue(selected.value?.code)
})
watch(
    [value, () => props.options],
    () => {
        selected.value = props.options.find((opt) => opt.code === value.value)
    },
    { immediate: true }
)
</script>

<template>
    <div>
        <label :for="inputID" class="text-900 mb-2 block font-medium">{{ props.label }}</label>
        <Dropdown
            v-model="selected"
            class="w-full"
            :class="{ 'p-invalid': errorMessage }"
            :input-id="inputID"
            :options="props.options"
            option-label="label"
            :placeholder="props.placeholder"
            show-clear
            @blur="handleBlur"
            @change="handleChange"
        >
            <template #option="slotProps">
                <slot name="option" v-bind="slotProps"></slot>
            </template>

            <template #value="slotProps">
                <slot name="value" v-bind="slotProps"></slot>
            </template>
        </Dropdown>
        <small class="p-error">{{ errorMessage || '&nbsp;' }}</small>
    </div>
</template>
