<template>
    <div>
        <EditStoryVideos :story="story" v-if="story.type === 2" />
        <EditStoryImages :story="story" v-else />
    </div>
</template>

<script setup lang="ts">
import { inject } from 'vue'
import EditStoryImages from './EditStoryImages.vue'
import EditStoryVideos from './EditStoryVideos.vue'
import type { IStoryImage, IStoryVideo } from './interfaces'

const dialogRef = inject('dialogRef') as any
const story = dialogRef.value.data.story as IStoryImage | IStoryVideo
</script>
