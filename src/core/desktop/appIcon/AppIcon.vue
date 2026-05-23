<script setup>
const props = defineProps({
    app: {
        type: Object,
        required: true,
    },
    index: {
        type: Number,
        required: true,
    },
});

const emit = defineEmits(['open']);

function onClick(event) {
    emit('open', props.app, event);
}
</script>

<template>
    <div
        class="app_icon_wrap"
        :style="{ animationDelay: `${index * 0.1 + 0.2}s` }"
        :title="app.meta.title"
        @click="onClick"
    >
        <div class="app_icon">
            <img v-if="app.meta.icon.includes('http')" :src="app.meta.icon" alt="app icon" />
            <component v-else :is="app.meta.icon" />
            <span class="app_icon_title">{{ app.meta.title }}</span>
        </div>
    </div>
</template>

<style scoped lang="scss">
/* 外层：入场动画（forwards 会锁定 transform，不能和 hover 写在同一元素） */
    .app_icon_wrap {
    flex: 0 0 17.5%;
    width: 17.5%;
    max-width: 60px;
    align-self: flex-start;
    opacity: 0;
    animation: app-icon-enter 1s ease forwards;
    position: relative;
    cursor: pointer;
    .app_icon_title {
        position: absolute;
        bottom: -45%;
        left: 0;
        color: #fff;
        font-size: 12px;
        text-align: center;
        width: 100%;
        text-overflow: ellipsis;
        overflow: hidden;
        white-space: nowrap;
        text-shadow: 1px 1px 0 #7e7e7e;
    }

    @keyframes app-icon-enter {
        from {
            opacity: 0.2;
            transform: translateY(30px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }

    /* 内层：悬停缩放 / 上浮，由 transition 驱动 */
    .app_icon {
        width: 100%;
        aspect-ratio: 1 / 1;
        box-sizing: border-box;
        border-radius: 15px;
        background: rgba(255, 255, 255, 0.25);
        backdrop-filter: blur(20px) saturate(180%);
        border: 1px solid rgba(255, 255, 255, 0.25);
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
        transition: transform 0.3s ease, box-shadow 0.3s ease;

        &:hover {
            transform: scale(1.02) translateY(-8px);
            box-shadow: 0 16px 36px rgba(0, 0, 0, 0.28);
            cursor: pointer;
        }

        img {
            width: 100%;
            height: 100%;
            object-fit: cover;
            border-radius: inherit;
        }
    }
}
</style>
