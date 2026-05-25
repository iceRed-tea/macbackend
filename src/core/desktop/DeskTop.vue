<script setup>
import AppIcon from './appIcon/AppIcon.vue';
import AppWindow from './appWindow/AppWindow.vue';
import useAppStore from '@/store/useAppStore';
import { mockRoutes } from '@/router/mockroutes';
import { ElMessage } from 'element-plus';

const { windowSize, windows } = storeToRefs(useAppStore());
const MAX_WINDOWS = 8;

const padding = computed(() => {
    if (windowSize.value.width >= 600 && windowSize.value.width < 800) {
        return '10% 15%';
    } else if (windowSize.value.width < 600) {
        return '10%';
    }

    return '10% 20%';
});

const appList = ref(mockRoutes);

function findWindowByAppName(name) {
    return windows.value.find(win => win.appName === name);
}

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
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        appName: app.name,
        title: app.meta?.title || app.name,
        icon: app.meta?.icon,
        focused: false,
        launchOrigin,
        component: markRaw(defineAsyncComponent(app.component)),
        options: {
            title: app.meta?.title || app.name,
            icon: app.meta?.icon,
            width: '70%',
            height: '70%',
            x: 'center',
            y: 'center',
        },
    });
}

function openAppWindow(app, event) {
    if (!app?.component) return;

    const exists = findWindowByAppName(app.name);
    if (exists) {
        ElMessage.info(`"${app.meta?.title || app.name}" 已打开`);
        return;
    }

    if (windows.value.length >= MAX_WINDOWS) {
        ElMessage.warning(`最多同时打开 ${MAX_WINDOWS} 个窗口`);
        return;
    }

    createWindowByApp(app, getLaunchOrigin(event));
}

function onAppOpen(app, event) {
    openAppWindow(app, event);
}
</script>

<template>
    <div class="desktop" :style="{ padding: padding }">
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
    height: 100%;
    display: flex;
    flex-wrap: wrap;
    align-items: flex-start;
    align-content: flex-start;
    gap: min(10%, 60px);
    user-select: none;
    transition: all 0.2s ease;
}
</style>
