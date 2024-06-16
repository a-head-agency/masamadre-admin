<script setup lang="ts">
import { ref, watchEffect } from 'vue'

import TheCreateStoryImages from './TheCreateStoryImages.vue'
import TheCreateStoryVideos from './TheCreateStoryVideos.vue'

const storiesTypeOptions = ref([
    {
        name: 'Картинки',
        code: 'images'
    },
    {
        name: 'Видео',
        code: 'video'
    }
])
const storiesType = ref<(typeof storiesTypeOptions.value)[0]>(storiesTypeOptions.value[0])

watchEffect(() => {
    console.log(storiesType.value)
})
</script>

<template>
    <div>
        <div class="flex justify-center py-2">
            <SelectButton v-model="storiesType" option-label="name" :options="storiesTypeOptions" />
        </div>

        <TheCreateStoryImages v-if="storiesType.code === 'images'" />
        <TheCreateStoryVideos v-else-if="storiesType.code === 'video'" />
    </div>
</template>
