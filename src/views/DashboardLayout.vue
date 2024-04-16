<template>
    <div>
        <Sidebar
            v-model:visible="menuSidebarVisible"
            :pt="{
                header: {
                    class: '!justify-between'
                }
            }"
            class="w-full max-w-xs"
        >
            <template #header>
                <a href="https://masamadre.ru">
                    <img
                        :src="logoSrc"
                        class="h-8 w-full object-contain object-center pl-5"
                        alt=""
                    />
                </a>
            </template>
            <div class="flex flex-col items-stretch px-6 py-4 text-black">
                <ul class="flex grow flex-col gap-1">
                    <template v-for="g of menu" :key="g.name">
                        <li class="mb-1 mt-2 text-sm font-bold text-white">{{ g.name }}</li>
                        <li v-for="link of g.links" :key="link.name" class="min-w-max">
                            <RouterLink
                                v-slot="{ isExactActive }"
                                class="w-full rounded-lg"
                                :to="link.to"
                            >
                                <span
                                    class="flex items-center gap-2 rounded-lg px-4 py-2 text-sm leading-none text-white transition-all hover:bg-white/10"
                                    :class="isExactActive ? '!bg-white !text-black' : ''"
                                >
                                    <i :class="link.iconClass" />
                                    {{ link.name }}
                                </span>
                            </RouterLink>
                        </li>
                    </template>
                    <li class="mt-8 flex grow flex-col justify-end">
                        <button
                            @click="userStore.signOut"
                            class="block rounded-lg p-3 text-start text-white transition-all hover:bg-white/10"
                        >
                            <i class="pi pi-fw pi-sign-out" />
                            Выйти
                        </button>
                    </li>
                </ul>
            </div>
        </Sidebar>
        <button
            class="fixed left-0 top-4 z-50 flex items-center gap-2 rounded-r-full bg-white p-4 leading-none text-black shadow-lg shadow-white/10 xl:hidden"
            @click="menuSidebarVisible = true"
        >
            Меню
            <i class="pi pi-arrow-right text-base" />
        </button>

        <div
            class="fixed hidden h-screen w-64 shrink-0 overflow-y-auto scrollbar-thin scrollbar-track-white/5 scrollbar-thumb-white/10 xl:block"
        >
            <div class="flex flex-col items-stretch px-6 py-4 text-black">
                <a href="https://masamadre.ru">
                    <img
                        :src="logoSrc"
                        class="my-6 h-8 w-full object-contain object-center"
                        alt=""
                    />
                </a>

                <ul class="flex grow flex-col gap-1">
                    <template v-for="g of menu" :key="g.name">
                        <li class="mb-1 mt-2 text-sm font-bold text-white">{{ g.name }}</li>
                        <li v-for="link of g.links" :key="link.name" class="min-w-max">
                            <RouterLink
                                v-slot="{ isExactActive }"
                                class="w-full rounded-lg"
                                :to="link.to"
                            >
                                <span
                                    class="flex items-center gap-2 rounded-lg px-4 py-2 text-sm leading-none text-white transition-all hover:bg-white/10"
                                    :class="isExactActive ? '!bg-white !text-black' : ''"
                                >
                                    <i :class="link.iconClass" />
                                    {{ link.name }}
                                </span>
                            </RouterLink>
                        </li>
                    </template>
                    <li class="mt-8 flex grow flex-col justify-end">
                        <button
                            @click="userStore.signOut"
                            class="block rounded-lg p-3 text-start text-white transition-all hover:bg-white/10"
                        >
                            <i class="pi pi-fw pi-sign-out" />
                            Выйти
                        </button>
                    </li>
                </ul>
            </div>
        </div>
        <div class="w-full xl:pl-64">
            <RouterView />
        </div>
    </div>
</template>

<script setup lang="ts">
import { RouterView, type RouteLocationRaw } from 'vue-router'
import logoSrc from '@/assets/logo.svg'
import { useUserStore } from '@/stores/user'
import { ref } from 'vue'

const userStore = useUserStore()

const menuSidebarVisible = ref(false)

const menu: {
    name: string
    links: {
        name: string
        to: RouteLocationRaw
        iconClass: string
    }[]
}[] = [
    {
        name: 'Главная',
        links: [
            {
                name: 'Дашборд',
                to: { name: 'dashboard' },
                iconClass: 'pi pi-fw pi-home'
            },
            {
                name: 'Настройки',
                to: { name: 'settings' },
                iconClass: 'pi pi-fw pi-cog'
            }
        ]
    },
    {
        name: 'Пользователи',
        links: [
            {
                name: 'Пользователи',
                to: { name: 'users' },
                iconClass: 'pi pi-fw pi-user'
            },
            {
                name: 'Отзывы',
                to: { name: 'reviews' },
                iconClass: 'pi pi-fw pi-comments'
            },
            {
                name: 'Заказы',
                to: { name: 'orders' },
                iconClass: 'pi pi-fw pi-shopping-cart'
            }
        ]
    },
    {
        name: 'Еда',
        links: [
            {
                name: 'Категории',
                to: { name: 'categories' },
                iconClass: 'pi pi-fw pi-sitemap'
            },
            {
                name: 'Блюда',
                to: { name: 'dishes' },
                iconClass: 'pi pi-fw pi-book'
            },
            {
                name: 'Теги',
                to: { name: 'tags' },
                iconClass: 'pi pi-fw pi-hashtag'
            }
        ]
    },
    {
        name: 'Точки',
        links: [
            {
                name: 'Рестораны',
                to: { name: 'restaurants' },
                iconClass: 'pi pi-fw pi-building'
            }
        ]
    }
]
</script>
