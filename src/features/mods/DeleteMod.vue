<template>
    <div>
        <p class="mb-8 text-lg leading-loose">
            Вы уверены, что хотите удалить модификатор
            <span
                class="inline-block min-w-max whitespace-nowrap rounded-lg bg-indigo-100 px-4 font-bold"
            >
                {{ mod.name }} (id: {{ mod.id }})
            </span>
        </p>
        <div class="flex justify-end gap-4">
            <Button label="Нет" class="flex-1" severity="secondary" @click="dialogRef.close()" />
            <Button label="Да" class="flex-1" severity="danger" @click="deleteTag()" />
        </div>
    </div>
</template>

<script setup lang="ts">
import { inject } from 'vue'
import type { IMod } from './interfaces'
import { useDeleteMod } from './composables'

const dialogRef = inject('dialogRef') as any
const mod = dialogRef.value.data.mod as IMod

const { mutate } = useDeleteMod()

const deleteTag = () => {
    mutate(mod)
    dialogRef.value.close()
}
</script>
