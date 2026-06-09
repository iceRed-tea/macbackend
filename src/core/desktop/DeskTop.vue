<script setup>
import AppIcon from './appIcon/AppIcon.vue';
import AppWindow from './appWindow/AppWindow.vue';
import useWinStore from '@/core/store/useWinStore';
import { mockRoutes } from '@/router/mockroutes';

const { windows, pages } = storeToRefs(useWinStore());

const appList = ref(mockRoutes);

function initPages(list) {
    list.forEach(item => {
        const page = item;
        if (page.children && page.children.length > 0) {
            page.children = initPages(page.children);
        }
        delete page.children;
        pages.value.push({
            ...page,
        });
    });
}

initPages(mockRoutes);

function getLaunchOrigin(event) {
    const el = event?.currentTarget?.querySelector?.('.app_icon') ?? event?.currentTarget;
    if (!el) return null;

    const rect = el.getBoundingClientRect();
    return {
        x: rect.left + rect.width / 2,
        y: rect.top + rect.height / 2,
        width: rect.width,
        height: rect.height,
        borderRadius: 15,
    };
}

function createWindowByApp(app, launchOrigin) {
    windows.value.push({
        ...app,
        ...app.meta,
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        focused: false,
        minimized: false,
        launchOrigin,
        component: app.component ? markRaw(defineAsyncComponent(app.component)) : null,
        options: {
            ...app.meta,
            width: '70%',
            height: '70%',
            x: 'center',
            y: 'center',
        },
    });
}

function onAppOpen(app, event) {
    createWindowByApp(app, getLaunchOrigin(event));
}
</script>

<template>
    <div class="desktop">
        <template v-for="(app, index) in appList" :key="app.name">
            <AppIcon :app="app" :index="index" @open="onAppOpen" />
        </template>
    </div>

    <AppWindow />
</template>

<style scoped lang="scss">
.desktop {
    position: relative;
    z-index: 1;
    width: 100%;
    flex: 1;
    display: flex;
    flex-wrap: wrap;
    align-items: flex-start;
    align-content: flex-start;
    gap: min(10%, 60px);
    user-select: none;
    transition: all 0.2s ease;
}
</style>
