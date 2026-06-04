export const mockRoutes = [
    {
        path: '/user',
        name: 'User',
        component: () => import('@/views/system/user/user.vue'),
        meta: {
            title: '用户管理',
            icon: '/logo.png',
        },
        children: [
            {
                path: '/user/child/u1',
                name: 'U1',
                component: () => import('@/views/system/user/child/u1.vue'),
                meta: {
                    title: '用户1',
                },
                children: [
                    {
                        path: '/user/child/u1/son',
                        name: 'Son',
                        meta: {
                            title: '子用户1',
                        },
                        component: () => import('@/views/system/user/child/child/son.vue'),
                    },
                ],
            },
        ],
    },
    {
        path: '/role',
        name: 'Role',
        component: () => import('@/views/system/role/role.vue'),
        meta: {
            title: '角色管理',
            icon: '/logo.png',
        },
        children: [
            {
                path: '/role/test',
                name: 'Test',
                component: () => import('@/views/system/role/test/test.vue'),
            },
        ],
    },
    {
        path: '/vue',
        name: 'Vue',
        component: null,
        meta: {
            title: '菜单管理',
            icon: 'https://vuejs.org/logo.svg',
            url: 'https://www.vueframework.com/docs/v3/cn/',
        },
    },
];
