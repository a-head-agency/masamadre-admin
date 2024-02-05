<template>
    <main class="mb-12 px-4">
        <h1 class="py-12 text-center text-3xl font-semibold leading-none">Настройки</h1>
        <div class="flex flex-col items-stretch gap-24">
            <CommonSettingsForm />
            <Promo />
            <BroadcastNotification />
            <DocumentsForm />
        </div>
    </main>
</template>

<script setup lang="ts">
import {
    CommonSettingsForm,
    DocumentsForm,
    BroadcastNotification,
    Promo
} from '@/features/settings'
</script>
