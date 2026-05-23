export const mockRoutes = [
    {
        path: '/user',
        name: 'User',
        component: () => import('@/views/system/user/user.vue'),
        meta: {
            title: '用户管理',
            icon: 'bi-person',
        },
    },
    {
        path: '/role',
        name: 'Role',
        component: () => import('@/views/system/role/role.vue'),
        meta: {
            title: '角色管理',
            icon: 'bi-person',
        },
    },
];
