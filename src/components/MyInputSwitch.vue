<template>
    <div @click="setValue(!value)" class="block cursor-pointer rounded-lg border border-gray-300 p-3 font-medium">
        <div class="flex items-center justify-between gap-4">
            <span>
                {{ props.label }}
            </span>
            <div @click.stop="" class="contents">
                <InputSwitch
                    class="shrink-0"
                    v-model="value"
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

<script setup lang="ts">
import { useField } from 'vee-validate'

const props = defineProps<{
    label: string
    name: string
}>()

const { errorMessage, value, setValue } = useField<boolean>(() => props.name)
</script>
