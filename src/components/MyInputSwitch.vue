<script setup lang="ts">
import { useField } from 'vee-validate'

const props = defineProps<{
    label: string
    name: string
}>()

const { errorMessage, value, setValue } = useField<boolean>(() => props.name)
</script>

<template>
    <div
        class="block cursor-pointer rounded-lg border border-gray-300 p-3 font-medium"
        @click="setValue(!value)"
    >
        <div class="flex items-center justify-between gap-4">
            <span>
                {{ props.label }}
            </span>
            <div class="contents" @click.stop="">
                <InputSwitch
                    v-model="value"
                    class="shrink-0"
                    :name="props.name"
                    :label="props.label"
                    :class="{
                        'p-invalid': errorMessage
                    }"
                />
            </div>
        </div>

        <small v-if="errorMessage" class="p-error">{{ errorMessage || '&nbsp;' }}</small>
    </div>
</template>
