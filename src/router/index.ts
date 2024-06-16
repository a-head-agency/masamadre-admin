import { createRouter, createWebHistory } from 'vue-router'

import { useUserStore } from '@/stores/user'

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/dashboard',
            component: () => import('@/views/DashboardLayout.vue'),
            children: [
                {
                    path: '',
                    name: 'dashboard',
                    component: () => import('@/views/DashboardView.vue')
                },
                {
                    path: 'settings',
                    name: 'settings',
                    component: () => import('@/views/SettingsView.vue')
                },
                {
                    path: 'users',
                    name: 'users',
                    component: () => import('@/views/UsersView.vue')
                },
                {
                    path: 'reviews',
                    name: 'reviews',
                    component: () => import('@/views/ReviewsView.vue')
                },
                {
                    path: 'dishes',
                    name: 'dishes',
                    component: () => import('@/views/DishesView.vue')
                },
                {
                    path: 'categories',
                    name: 'categories',
                    component: () => import('@/views/CategoriesView.vue')
                },
                {
                    path: 'tags',
                    name: 'tags',
                    component: () => import('@/views/TagsView.vue')
                },
                {
                    path: 'stories',
                    name: 'stories',
                    component: () => import('@/views/StoriesView.vue')
                },
                {
                    path: 'banners',
                    name: 'banners',
                    component: () => import('@/views/BannersView.vue')
                },
                {
                    path: 'articles',
                    name: 'articles',
                    component: () => import('@/views/BlogsView.vue')
                },
                {
                    path: 'promotions',
                    name: 'promotions',
                    component: () => import('@/views/PromotionsView.vue')
                },
                {
                    path: 'restaurants',
                    name: 'restaurants',
                    component: () => import('@/views/RestaurantsView.vue')
                },
                {
                    path: 'orders',
                    name: 'orders',
                    component: () => import('@/views/OrdersView.vue')
                },
                {
                    path: 'mods',
                    name: 'mods',
                    component: () => import('@/views/ModsView.vue')
                }
            ]
        },
        {
            path: '/login',
            name: 'login',
            component: () => import('@/views/LoginView.vue')
        },
        {
            path: '/',
            name: 'root',
            redirect: '/dashboard'
        }
    ]
})

router.beforeEach(async (to) => {
    const userStore = useUserStore()
    if (
        // make sure the user is authenticated
        !userStore.isAuthenticated &&
        // ❗️ Avoid an infinite redirect
        to.name !== 'login'
    ) {
        // redirect the user to the login page
        return { name: 'login' }
    }
})

export default router
