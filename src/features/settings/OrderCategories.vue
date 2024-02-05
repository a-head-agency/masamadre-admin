<template>
    <div>
        <h1 class="mb-6 text-xl font-bold">Порядок категорий</h1>

        <draggable
            v-model="ordered"
            @start="drag = true"
            @end="drag = false"
            item-key="id"
            :animation="200"
            ghostClass="ghost"
            :component-data="{ name: !drag ? 'flip-list' : undefined }"
        >
            <template #item="{ element, index }">
                <div
                    class="mb-2 flex justify-between rounded-lg border-2 border-dashed border-black/25 p-4 transition-opacity"
                >
                    {{ index + 1 }}. {{ element.name }}
                    <CategoryStatusBadge :code="element.active" />
                </div>
            </template>
        </draggable>
    </div>
</template>

<script setup lang="ts">
import draggable from 'vuedraggable'
import { useCategories, type ICategory, CategoryStatusBadge } from '@/features/categories'
import { ref, watch } from 'vue'

const { data: categories } = useCategories(
    {
        offset: 0,
        limit: 99999999,
        search: ''
    },
    (v) => v.list
)

const drag = ref(false)
const ordered = ref<ICategory[]>([])
watch(
    [categories],
    () => {
        if (categories.value) {
            ordered.value = categories.value.slice()
        }
    },
    {
        immediate: true
    }
)
</script>

<style scoped>
.flip-list-move {
    transition: transform 0.5s;
}

.no-move {
    transition: transform 0s;
}

.ghost {
    @apply opacity-40;
}
</style>
