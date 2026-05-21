import { createRouter, createWebHistory } from 'vue-router';

const routes = [
    {
        path: '/',
        component: () => import('@/views/index/Index.vue'),
    },
    {
        path: '/os',
        name: 'os',
        component: () => import('@/core/OS.vue'),
    },
];

export default createRouter({
    history: createWebHistory(),
    routes,
});
