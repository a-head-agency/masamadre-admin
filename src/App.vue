<script setup lang="ts">
import { useIsFetching } from '@tanstack/vue-query'
import { RouterView } from 'vue-router'

import ConfirmDialog from 'primevue/confirmdialog'
import DynamicDialog from 'primevue/dynamicdialog'
import Toast from 'primevue/toast'

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
        <ConfirmDialog group="danger">
            <template #container="{ message, acceptCallback, rejectCallback }">
                <div class="flex max-w-sm flex-col items-center rounded-lg p-5">
                    <div
                        class="-mt-16 flex h-24 w-24 items-center justify-center rounded-full bg-pv-primary-color"
                    >
                        <i class="pi pi-exclamation-circle text-5xl text-white"></i>
                    </div>
                    <span class="mb-2 mt-4 block text-center text-2xl font-bold">
                        {{ message.header }}
                    </span>
                    <p class="mb-0 text-center">{{ message.message }}</p>
                    <div class="mt-5 flex w-full items-center gap-2">
                        <Button
                            class="flex-1"
                            :label="message.acceptLabel"
                            @click="acceptCallback"
                        ></Button>
                        <Button
                            class="flex-1"
                            :label="message.rejectLabel"
                            outlined
                            @click="rejectCallback"
                        ></Button>
                    </div>
                </div>
            </template>
        </ConfirmDialog>
        <DynamicDialog />
        <RouterView />
    </div>
</template>
