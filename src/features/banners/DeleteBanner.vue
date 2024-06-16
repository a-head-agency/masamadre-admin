<script setup lang="ts">
import { inject } from 'vue'

import { useDeleteBanner } from './composables'
import type { IBanner } from './interfaces'

const dialogRef = inject('dialogRef') as any
const banner = dialogRef.value.data.banner as IBanner

const { mutateAsync, isPending } = useDeleteBanner()

const deleteCategory = () => {
    mutateAsync({
        id: banner.id
    }).then(() => {
        dialogRef.value.close()
    })
}
</script>

<template>
    <div>
        <p class="mb-8 text-lg leading-loose">
            Вы уверены, что хотите удалить баннер
            <span
                class="inline-block min-w-max whitespace-nowrap rounded-lg bg-purple-200 px-4 font-bold"
            >
                id: {{ banner.id }}
            </span>
        </p>
        <div class="flex justify-end gap-4">
            <Button
                class="flex-1"
                size="small"
                label="Нет"
                :disabled="isPending"
                severity="secondary"
                @click="dialogRef.close()"
            />
            <Button
                class="flex-1"
                size="small"
                label="Да"
                :loading="isPending"
                :disabled="isPending"
                severity="danger"
                @click="deleteCategory()"
            />
        </div>
    </div>
</template>
