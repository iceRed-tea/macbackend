<script setup>
import VueWinBox from 'vue-winbox';
import 'winbox/dist/css/winbox.min.css';
import './winbox-os.scss';
import { buildMacWinboxOptions } from './macWinboxOptions';
import useAppStore from '@/store/useAppStore';

const { windows, windowSize } = storeToRefs(useAppStore());

function removeWindowById(id) {
    const index = windows.value.findIndex(w => w.id === id);
    if (index === -1) return;

    windows.value.splice(index, 1);
}

function getOptions(win) {
    return {
        ...buildMacWinboxOptions(win),
        onclose() {
            removeWindowById(win.id);
        },
        onmove(x, y) {
            console.log(x, y);
        },
    };
}

function onWindowClose(id) {
    removeWindowById(id);
}
</script>

<template>
    <VueWinBox
        v-for="win in windows"
        :key="win.id"
        :options="getOptions(win)"
        @close="onWindowClose(win.id)"
    >
        <component :is="win.component" :window-data="win.data" />
    </VueWinBox>
</template>
