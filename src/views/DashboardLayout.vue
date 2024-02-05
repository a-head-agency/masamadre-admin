<template>
    <div>
        <div
            class="fixed h-screen w-64 shrink-0 overflow-y-auto scrollbar-thin scrollbar-track-gray-50 scrollbar-thumb-gray-200"
        >
            <div class="flex flex-col items-stretch px-6 py-4">
                <img :src="logoSrc" class="my-6 h-8 w-full object-contain object-center" alt="" />
                <ul class="flex grow flex-col gap-1">
                    <li class="mb-1 mt-2 text-sm font-bold">Главная</li>
                    <li class="min-w-max">
                        <RouterLink
                            v-slot="{ isExactActive }"
                            class="w-full rounded-lg"
                            :to="{ name: 'dashboard' }"
                        >
                            <span
                                class="flex items-center gap-2 rounded-lg px-4 py-2 text-sm leading-none transition-all hover:bg-white/10"
                                :class="isExactActive ? '!bg-white text-black' : ''"
                            >
                                <i class="pi pi-fw pi-home" />
                                Дашборд
                            </span>
                        </RouterLink>
                    </li>
                    <li class="min-w-max">
                        <RouterLink
                            v-slot="{ isActive }"
                            class="w-full rounded-lg"
                            :to="{ name: 'settings' }"
                        >
                            <span
                                class="flex items-center gap-2 rounded-lg px-4 py-2 text-sm leading-none transition-all hover:bg-white/10"
                                :class="isActive ? '!bg-white text-black' : ''"
                            >
                                <i class="pi pi-fw pi-cog" />
                                Настройки
                            </span>
                        </RouterLink>
                    </li>

                    <li class="mb-1 mt-2 text-sm font-bold">Пользователи</li>
                    <li class="min-w-max">
                        <RouterLink
                            v-slot="{ isActive }"
                            class="w-full rounded-lg"
                            :to="{ name: 'users' }"
                        >
                            <span
                                class="flex items-center gap-2 rounded-lg px-4 py-2 text-sm leading-none transition-all hover:bg-white/10"
                                :class="isActive ? '!bg-white text-black' : ''"
                            >
                                <i class="pi pi-fw pi-user" />
                                Пользователи
                            </span>
                        </RouterLink>
                    </li>
                    <li class="min-w-max">
                        <RouterLink
                            v-slot="{ isActive }"
                            class="w-full rounded-lg"
                            :to="{ name: 'reviews' }"
                        >
                            <span
                                class="flex items-center gap-2 rounded-lg px-4 py-2 text-sm leading-none transition-all hover:bg-white/10"
                                :class="isActive ? '!bg-white text-black' : ''"
                            >
                                <i class="pi pi-fw pi-comments" />
                                Отзывы
                            </span>
                        </RouterLink>
                    </li>
                    <li class="min-w-max">
                        <RouterLink
                            v-slot="{ isActive }"
                            class="w-full rounded-lg"
                            :to="{ name: 'orders' }"
                        >
                            <span
                                class="flex items-center gap-2 rounded-lg px-4 py-2 text-sm leading-none transition-all hover:bg-white/10"
                                :class="isActive ? '!bg-white text-black' : ''"
                            >
                                <i class="pi pi-fw pi-shopping-cart" />
                                Заказы
                            </span>
                        </RouterLink>
                    </li>

                    <li class="mb-1 mt-2 text-sm font-bold">Еда</li>
                    <li class="min-w-max">
                        <RouterLink
                            v-slot="{ isActive }"
                            class="w-full rounded-lg"
                            :to="{ name: 'categories' }"
                        >
                            <span
                                class="flex items-center gap-2 rounded-lg px-4 py-2 text-sm leading-none transition-all hover:bg-white/10"
                                :class="isActive ? '!bg-white text-black' : ''"
                            >
                                <i class="pi pi-fw pi-sitemap" />
                                Категории
                            </span>
                        </RouterLink>
                    </li>
                    <li class="min-w-max">
                        <RouterLink
                            v-slot="{ isActive }"
                            class="w-full rounded-lg"
                            :to="{ name: 'dishes' }"
                        >
                            <span
                                class="flex items-center gap-2 rounded-lg px-4 py-2 text-sm leading-none transition-all hover:bg-white/10"
                                :class="isActive ? '!bg-white text-black' : ''"
                            >
                                <i class="pi pi-fw pi-book" />
                                Блюда
                            </span>
                        </RouterLink>
                    </li>
                    <li class="min-w-max">
                        <RouterLink
                            v-slot="{ isActive }"
                            class="w-full rounded-lg"
                            :to="{ name: 'tags' }"
                        >
                            <span
                                class="flex items-center gap-2 rounded-lg px-4 py-2 text-sm leading-none transition-all hover:bg-white/10"
                                :class="isActive ? '!bg-white text-black' : ''"
                            >
                                <i class="pi pi-fw pi-hashtag" />
                                Теги
                            </span>
                        </RouterLink>
                    </li>

                    <li class="mb-1 mt-2 text-sm font-bold">Точки</li>
                    <li class="min-w-max">
                        <RouterLink
                            v-slot="{ isActive }"
                            class="w-full rounded-lg"
                            :to="{ name: 'restaurants' }"
                        >
                            <span
                                class="flex items-center gap-2 rounded-lg px-4 py-2 text-sm leading-none transition-all hover:bg-white/10"
                                :class="isActive ? '!bg-white text-black' : ''"
                            >
                                <i class="pi pi-fw pi-building" />
                                Рестораны
                            </span>
                        </RouterLink>
                    </li>

                    <li class="mb-1 mt-2 text-sm font-bold">Маркетинг</li>
                    <li class="min-w-max">
                        <RouterLink
                            v-slot="{ isActive }"
                            class="w-full rounded-lg"
                            :to="{ name: 'stories' }"
                        >
                            <span
                                class="flex items-center gap-2 rounded-lg px-4 py-2 text-sm leading-none transition-all hover:bg-white/10"
                                :class="isActive ? '!bg-white text-black' : ''"
                            >
                                <i class="pi pi-fw pi-instagram" />
                                Истории
                            </span>
                        </RouterLink>
                    </li>
                    <li class="min-w-max">
                        <RouterLink
                            v-slot="{ isActive }"
                            class="w-full rounded-lg"
                            :to="{ name: 'banners' }"
                        >
                            <span
                                class="flex items-center gap-2 rounded-lg px-4 py-2 text-sm leading-none transition-all hover:bg-white/10"
                                :class="isActive ? '!bg-white text-black' : ''"
                            >
                                <i class="pi pi-fw pi-images" />
                                Баннеры
                            </span>
                        </RouterLink>
                    </li>
                    <li class="min-w-max">
                        <RouterLink
                            v-slot="{ isActive }"
                            class="w-full rounded-lg"
                            :to="{ name: 'articles' }"
                        >
                            <span
                                class="flex items-center gap-2 rounded-lg px-4 py-2 text-sm leading-none transition-all hover:bg-white/10"
                                :class="isActive ? '!bg-white text-black' : ''"
                            >
                                <i class="pi pi-fw pi-bars" />
                                Статьи
                            </span>
                        </RouterLink>
                    </li>
                    <li class="min-w-max">
                        <RouterLink
                            v-slot="{ isActive }"
                            class="w-full rounded-lg"
                            :to="{ name: 'promotions' }"
                        >
                            <span
                                class="flex items-center gap-2 rounded-lg px-4 py-2 text-sm leading-none transition-all hover:bg-white/10"
                                :class="isActive ? '!bg-white text-black' : ''"
                            >
                                <i class="pi pi-fw pi-percentage" />
                                Акции
                            </span>
                        </RouterLink>
                    </li>
                    <li class="mt-8 flex grow flex-col justify-end">
                        <button
                            @click="userStore.signOut"
                            class="block rounded-lg p-3 text-start transition-all hover:bg-white/10"
                        >
                            <i class="pi pi-fw pi-sign-out" />
                            Выйти
                        </button>
                    </li>
                </ul>
            </div>
        </div>
        <div class="w-full pl-64">
            <RouterView />
        </div>
    </div>
</template>

<script setup lang="ts">
import { RouterView } from 'vue-router'
import logoSrc from '@/assets/logo.svg'
import { useUserStore } from '@/stores/user'

const userStore = useUserStore()
</script>
