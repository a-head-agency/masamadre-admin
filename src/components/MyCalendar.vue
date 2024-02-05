<template>
    <div class="w-full">
        <Calendar
            class="w-full text-center"
            :id="inputID"
            v-model="model"
            inline
            :class="{
                'p-invalid': errorMessage
            }"
            :time-only="props.timeOnly"
        ></Calendar>

        <small class="p-error">{{ errorMessage || '&nbsp;' }}</small>
    </div>
</template>

<script setup lang="ts">
import { useField } from 'vee-validate'
import { computed, ref, watch } from 'vue'

const props = defineProps<{
    name: string
    timeOnly?: boolean
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

const inputID = computed(() => `calendar-${props.name}`)
</script>
