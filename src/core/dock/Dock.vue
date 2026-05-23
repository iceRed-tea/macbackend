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
    bottom: -5rem;
    min-width: 300px;
    transform: translateX(-50%);
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
    z-index: 10;
    transition: transform 1s 0.8s cubic-bezier(0.25, 1, 0.5, 1);
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
        animation: dock-item-animation 1s ease forwards;
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
        transition: all 0.3s ease;
        &:hover {
            transform: translateY(-1px);
            box-shadow: 0 16px 36px rgba(0, 0, 0, 0.28);
            cursor: pointer;
        }
    }

    @keyframes dock-animation {
        from {
            opacity: 0.5;
            bottom: -5rem;
        }
        to {
            opacity: 1;
            bottom: 3rem;
        }
    }
}
</style>
