<script setup>
import useAppStore from '@/store/useAppStore';

const { windows } = storeToRefs(useAppStore());

function onDockItemClick(win) {
    const instance = win.instance;
    if (!instance) return;

    if (instance.min) {
        instance.restore().focus();
    } else {
        instance.focus();
    }
}
</script>

<template>
    <div class="dock">
        <div
            class="dock-item"
            :class="{ 'is-active': win.focused }"
            v-for="win in windows"
            :key="win.id"
            :data-app-name="win.appName"
            @click="onDockItemClick(win)"
            :title="win.title"
        >
            <img :src="win.icon" alt="app icon" />
            <span class="dock-item-indicator" />
        </div>
    </div>
</template>

<style scoped lang="scss">
.dock {
    position: absolute;
    left: 50%;
    bottom: 3rem;
    min-width: 300px;
    transform: translate(-50%, 10rem);
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
    z-index: 10;
    background: rgba(255, 255, 255, 0.25);
    backdrop-filter: blur(20px) saturate(180%);
    border-radius: 24px;
    animation: dock-animation 1s 0.5s cubic-bezier(0.25, 1, 0.5, 1) forwards;
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 12px;
    min-height: 84px;

    .dock-item {
        width: 60px;
        height: 60px;
        max-width: 60px;
        align-self: flex-start;
        animation: dock-item-animation 0.68s cubic-bezier(0.22, 1, 0.36, 1) forwards;
        will-change: transform, opacity;
        background: rgba(255, 255, 255, 0.18);
        backdrop-filter: blur(18px) saturate(170%);
        -webkit-backdrop-filter: blur(18px) saturate(170%);
        border: 1px solid rgba(255, 255, 255, 0.25);
        box-shadow: 0 8px 32px rgba(31, 38, 135, 0.25), inset 0 4px 20px rgba(255, 255, 255, 0.35);
        border-radius: 15px;
        transition: transform 0.3s ease, box-shadow 0.3s ease;
        position: relative;
        cursor: pointer;

        img {
            width: 100%;
            height: 100%;
            object-fit: cover;
            border-radius: inherit;
        }

        .dock-item-indicator {
            position: absolute;
            left: 50%;
            bottom: -8px;
            transform: translateX(-50%);
            width: 4px;
            height: 4px;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.55);
            transition: width 0.2s ease, height 0.2s ease, border-radius 0.2s ease,
                background 0.2s ease;
        }

        &.is-active .dock-item-indicator {
            width: 18px;
            height: 3px;
            border-radius: 2px;
            background: rgba(255, 255, 255, 0.95);
            box-shadow: 0 0 6px rgba(255, 255, 255, 0.6);
        }

        @keyframes dock-item-animation {
            0% {
                opacity: 0;
                transform: translate3d(0, 18px, 0) scale(0.86);
            }
            55% {
                opacity: 1;
                transform: translate3d(0, -10px, 0) scale(1.008);
            }
            75% {
                transform: translate3d(0, 4px, 0) scale(0.98);
            }
            90% {
                transform: translate3d(0, -2px, 0) scale(1.002);
            }
            100% {
                opacity: 1;
                transform: translate3d(0, 0, 0) scale(1);
            }
        }

        &:hover {
            box-shadow: 0 16px 36px rgba(0, 0, 0, 0.28);
        }
    }

    @keyframes dock-animation {
        from {
            opacity: 0.5;
            transform: translate(-50%, 10rem);
        }
        to {
            opacity: 1;
            transform: translate(-50%, 0);
        }
    }
}
</style>
