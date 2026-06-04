<script setup>
import useWinStore from '@/core/store/useWinStore';
const { config } = storeToRefs(useWinStore());
</script>

<template>
    <div class="background">
        <img
            :src="config.background.url"
            alt="background"
            :style="{
                filter: `blur(${config.background.blur}px) brightness(${config.background.brightness})`,
            }"
        />
    </div>
</template>

<style scoped lang="scss">
.background {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
    animation: background-animation 1.5s ease forwards;
    @keyframes background-animation {
        from {
            opacity: 0;
            transform: scale(1.2);
        }
        to {
            opacity: 1;
            transform: scale(1);
        }
    }
    img {
        width: 100%;
        height: 100%;
        object-fit: cover;
    }
}
</style>
