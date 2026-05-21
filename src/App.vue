<script setup>
import useAppStore from '@/store/useAppStore';

const { windowSize } = storeToRefs(useAppStore());

function onResize(size) {
    windowSize.value = size;
}

onMounted(() => {
    const loader = document.querySelector('.loader');
    if (loader) {
        loader.style.display = 'none';
    }
});
</script>

<template>
    <router-view />
    <q-resize-observer @resize="onResize" />
</template>
