import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '@/views/LoginView.vue'
import DashboardLayout from '@/views/DashboardLayout.vue'

import UsersView from '@/views/UsersView.vue'
import ReviewsView from '@/views/ReviewsView.vue'
import DishesView from '@/views/DishesView.vue'
import DashboardView from '@/views/DashboardView.vue'
import CategoriesView from '@/views/CategoriesView.vue'
import TagsView from '@/views/TagsView.vue'
import StoriesView from '@/views/StoriesView.vue'
import BannersView from '@/views/BannersView.vue'
import PromotionsView from '@/views/PromotionsView.vue'
import RestaurantsView from '@/views/RestaurantsView.vue'
import OrdersView from '@/views/OrdersView.vue'
import SettingsView from '@/views/SettingsView.vue'

import { useUserStore } from '@/stores/user'
import BlogsView from '@/views/BlogsView.vue'
import ModsView from '@/views/ModsView.vue'

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/dashboard',
            component: DashboardLayout,
            children: [
                {
                    path: '',
                    name: 'dashboard',
                    component: DashboardView
                },
                {
                    path: 'settings',
                    name: 'settings',
                    component: SettingsView
                },
                {
                    path: 'users',
                    name: 'users',
                    component: UsersView
                },
                {
                    path: 'reviews',
                    name: 'reviews',
                    component: ReviewsView
                },
                {
                    path: 'dishes',
                    name: 'dishes',
                    component: DishesView
                },
                {
                    path: 'categories',
                    name: 'categories',
                    component: CategoriesView
                },
                {
                    path: 'tags',
                    name: 'tags',
                    component: TagsView
                },
                {
                    path: 'stories',
                    name: 'stories',
                    component: StoriesView
                },
                {
                    path: 'banners',
                    name: 'banners',
                    component: BannersView
                },
                {
                    path: 'articles',
                    name: 'articles',
                    component: BlogsView
                },
                {
                    path: 'promotions',
                    name: 'promotions',
                    component: PromotionsView
                },
                {
                    path: 'restaurants',
                    name: 'restaurants',
                    component: RestaurantsView
                },
                {
                    path: 'orders',
                    name: 'orders',
                    component: OrdersView
                },
                {
                    path: 'mods',
                    name: 'mods',
                    component: ModsView
                }
            ]
        },
        {
            path: '/login',
            name: 'login',
            component: LoginView
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
