<script setup>
import Background from './wegits/Background.vue';
import Dock from './dock/Dock.vue';
import DeskTop from './desktop/DeskTop.vue';
import useAppStore from '@/store/useAppStore';
const { windowSize } = storeToRefs(useAppStore());

const isMobile = computed(() => windowSize.value.width < 800);
</script>

<template>
    <div class="os_page">
        <Background />
        <DeskTop />
        <template v-if="!isMobile">
            <Dock />
        </template>
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
