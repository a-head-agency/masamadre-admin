<template>
    <div>
        <Calendar
            class="w-full text-center"
            v-model="model"
            :class="{
                'p-invalid': errorMessage
            }"
            time-only
            :disabled="props.disabled"
        ></Calendar>
    </div>
</template>

<script setup lang="ts">
import { useField } from 'vee-validate'
import { ref, watch } from 'vue'

const props = defineProps<{
    name: string
    disabled?: boolean
}>()

const model = ref<Date>()

watch([model], () => {
    if (model.value) {
        setValue(model.value.getHours() * 100 + model.value.getMinutes())
    }
})

const { errorMessage, value, setValue } = useField<number>(() => props.name)

watch(
    [value],
    () => {
        if (value.value !== undefined) {
            const hours = value.value / 100
            const minutes = value.value % 100
            model.value = new Date(2022, 1, 1, hours, minutes)
        }
    },
    {
        immediate: true
    }
)
</script>
