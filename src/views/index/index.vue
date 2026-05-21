<script setup>
import PcLogin from './components/PcLogin.vue';
import MobileLogin from './components/MobileLogin.vue';
import useAppStore from '@/store/useAppStore';

const { windowSize } = storeToRefs(useAppStore());

const isMobile = computed(() => windowSize.value.width < 800);
</script>

<template>
    <div class="index_page">
        <MobileLogin v-if="isMobile" />
        <PcLogin v-else />
    </div>
</template>

<style scoped lang="scss">
.index_page {
    height: 100vh;
    height: 100dvh;
    display: flex;
    justify-content: center;
    align-items: center;
    overflow: hidden;

    --u: 10px;
    --c1: #fbf9fe;
    --c2: #02b6e7;
    --c3: #00699b;
    --gp: 50% / calc(var(--u) * 16.8) calc(var(--u) * 12.9);
    background: conic-gradient(
                from 122deg at 50% 85.15%,
                var(--c2) 0 58deg,
                var(--c3) 0 116deg,
                #fff0 0 100%
            )
            var(--gp),
        conic-gradient(from 122deg at 50% 72.5%, var(--c1) 0 116deg, #fff0 0 100%) var(--gp),
        conic-gradient(from 58deg at 82.85% 50%, var(--c3) 0 64deg, #fff0 0 100%) var(--gp),
        conic-gradient(
                from 58deg at 66.87% 50%,
                var(--c1) 0 64deg,
                var(--c2) 0 130deg,
                #fff0 0 100%
            )
            var(--gp),
        conic-gradient(from 238deg at 17.15% 50%, var(--c2) 0 64deg, #fff0 0 100%) var(--gp),
        conic-gradient(
                from 172deg at 33.13% 50%,
                var(--c3) 0 66deg,
                var(--c1) 0 130deg,
                #fff0 0 100%
            )
            var(--gp),
        linear-gradient(98deg, var(--c3) 0 15%, #fff0 calc(15% + 1px) 100%) var(--gp),
        linear-gradient(-98deg, var(--c2) 0 15%, #fff0 calc(15% + 1px) 100%) var(--gp),
        conic-gradient(
                from -58deg at 50.25% 14.85%,
                var(--c3) 0 58deg,
                var(--c2) 0 116deg,
                #fff0 0 100%
            )
            var(--gp),
        conic-gradient(from -58deg at 50% 28.125%, var(--c1) 0 116deg, #fff0 0 100%) var(--gp),
        linear-gradient(90deg, var(--c2) 0 50%, var(--c3) 0 100%) var(--gp);
}
</style>
