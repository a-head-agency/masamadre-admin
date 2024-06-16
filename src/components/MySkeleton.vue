<script setup lang="ts">
import Skeleton, { type SkeletonProps } from 'primevue/skeleton'

const props = defineProps<{
    showBody?: boolean
    skeleton: SkeletonProps
}>()
</script>

<template>
    <Transition name="fade" mode="out-in">
        <template v-if="showBody">
            <slot></slot>
        </template>
        <template v-else>
            <Skeleton v-bind="props.skeleton" />
        </template>
    </Transition>
</template>
