<script setup>
import Window from './wegits/Window.vue';
import './winbox-os.scss';
import { buildMacWinboxOptions } from './macWinboxOptions';
import useAppStore from '@/store/useAppStore';

const { windows } = storeToRefs(useAppStore());

function removeWindowById(id) {
    const index = windows.value.findIndex(w => w.id === id);
    if (index === -1) return;

    windows.value.splice(index, 1);
}

function getOptions(win) {
    return buildMacWinboxOptions(win);
}

function onWindowCreated(win, instance) {
    win.instance = markRaw(instance);
}

function onWindowFocus(win) {
    windows.value.forEach(w => {
        w.focused = w.id === win.id;
    });
}

function onWindowMinimize(win) {
    win.minimized = true;
}

function onWindowRestore(win) {
    win.minimized = false;
}

function onWindowClose(id) {
    removeWindowById(id);
}
</script>

<template>
    <Window
        v-for="win in windows"
        :key="win.id"
        :options="getOptions(win)"
        @created="onWindowCreated(win, $event)"
        @focus="onWindowFocus(win)"
        @minimize="onWindowMinimize(win)"
        @restore="onWindowRestore(win)"
        @close="onWindowClose(win.id)"
    >
        <component :is="win.component" :window-data="win.data" />
    </Window>
</template>
