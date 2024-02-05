<template>
    <div class="w-full">
        <label :for="inputID" class="text-900 mb-2 block font-medium">{{ props.label }}</label>
        <Editor :id="inputID" v-model="value" editor-style="height: 10rem" />

        <small class="p-error">{{ errorMessage || '&nbsp;' }}</small>
    </div>
</template>

<script setup lang="ts">
import { useField } from 'vee-validate'
import { computed } from 'vue'
import Editor from 'primevue/editor'
import { v4 as uuidv4 } from 'uuid'

const props = defineProps<{
    label: string
    name: string
    type?: string
}>()

const { errorMessage, value } = useField<any>(() => props.name)

const inputID = computed(() => `${uuidv4()}-input-text-${props.name}`)
</script>
