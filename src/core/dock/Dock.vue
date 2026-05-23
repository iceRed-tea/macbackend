<script setup>
import useAppStore from '@/store/useAppStore';
const { windows } = storeToRefs(useAppStore());
</script>

<template>
    <div class="dock">
        <div class="dock-item" v-for="win in windows" :key="win.id" :data-app-name="win.appName">
            <div class="dock-item-icon">
                <img :src="win.icon" alt="app icon" />
            </div>
            <div class="dock-item-title">
                {{ win.title }}
            </div>
        </div>
    </div>
</template>

<style scoped lang="scss">
.dock {
    position: absolute;
    left: 50%;
    bottom: 3rem;
    min-width: 300px;
    transform: translate3d(-50%, 5rem, 0);
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
        /* 核心：半透明 + 模糊 + 饱和 */
        background: rgba(255, 255, 255, 0.18);
        backdrop-filter: blur(18px) saturate(170%);
        -webkit-backdrop-filter: blur(18px) saturate(170%);
        /* 玻璃细边框 */
        border: 1px solid rgba(255, 255, 255, 0.25);
        /* 大圆角 */
        /* 双层阴影：外深内亮 */
        box-shadow: 0 8px 32px rgba(31, 38, 135, 0.25), inset 0 4px 20px rgba(255, 255, 255, 0.35);
        border-radius: 15px;
        transition: transform 0.3s ease, box-shadow 0.3s ease;

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
            transform: translateY(-1px);
            box-shadow: 0 16px 36px rgba(0, 0, 0, 0.28);
            cursor: pointer;
        }
    }

    @keyframes dock-animation {
        from {
            opacity: 0.5;
            transform: translate3d(-50%, 5rem, 0);
        }
        to {
            opacity: 1;
            transform: translate3d(-50%, 0, 0);
        }
    }
}
</style>
