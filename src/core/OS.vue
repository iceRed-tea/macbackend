<script setup>
import Background from './wegits/Background.vue';
import Dock from './dock/Dock.vue';
import DeskTop from './desktop/DeskTop.vue';
import Search from './search/Search.vue';
import Sidebar from './sidebar/Sidebar.vue';
import useAppStore from '@/store/useAppStore';

const { windowSize } = storeToRefs(useAppStore());

const padding = computed(() => {
    if (windowSize.value.width >= 600 && windowSize.value.width < 800) {
        return '10% 15%';
    } else if (windowSize.value.width < 600) {
        return '10%';
    }

    return '5% 20%';
});

const isMobile = computed(() => windowSize.value.width < 800);
</script>

<template>
    <div class="os_page">
        <Background />
        <Sidebar v-if="!isMobile" />
        <div class="w-full h-full column" :style="{ padding: padding }">
            <Search />
            <DeskTop />
            <Dock />
        </div>
    </div>
</template>

<style scoped lang="scss">
.os_page {
    width: 100vw;
    height: 100vh;
    height: 100dvh;
    background: #f0f0f0;
    position: relative;
    overflow: hidden;
}
</style>
