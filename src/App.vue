<script setup lang="ts">
import { RouterView } from 'vue-router'
import Toast from 'primevue/toast'
import ConfirmDialog from 'primevue/confirmdialog'
import DynamicDialog from 'primevue/dynamicdialog'

import { useIsFetching } from '@tanstack/vue-query'

const isFetching = useIsFetching()
</script>

<template>
    <div class="relative">
        <div class="absolute left-0 right-0 top-0 z-50 h-1">
            <Transition name="fade">
                <ProgressBar v-if="isFetching" mode="indeterminate" class="h-full" />
            </Transition>
        </div>
        <Toast />
        <ConfirmDialog />
        <DynamicDialog />
        <RouterView />
    </div>
</template>
