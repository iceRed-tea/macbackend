<script setup>
import Window from './wegits/Window.vue';
import useWinStore from '@/core/store/useWinStore';

const { pages } = storeToRefs(useWinStore());

const props = defineProps({
    win: Object,
    options: Object,
});

const emit = defineEmits(['created', 'focus', 'minimize', 'restore', 'close']);

const PAGE_ANIM_MS = 320;
let pageUid = 0;

function nextPageId() {
    pageUid += 1;
    return pageUid;
}

function toAsyncComponent(source) {
    if (!source) return null;
    if (typeof source === 'function') {
        return markRaw(defineAsyncComponent(source));
    }
    return markRaw(source);
}

/** 解析 navigate 参数，生成页面栈条目 */
function resolvePage(source, data = {}, title = '') {
    let component = null;
    let resolvedTitle = title;
    let resolvedData = data ?? {};

    if (typeof source === 'string') {
        const page = pages.value.find(item => item.path === source);
        if (page) {
            component = toAsyncComponent(page.component);
            resolvedTitle = resolvedTitle || page.meta?.title || '';
        }
    } else if (typeof source === 'function') {
        component = toAsyncComponent(source);
    } else if (source && typeof source === 'object') {
        if (source.component) {
            component = toAsyncComponent(source.component);
            resolvedTitle = resolvedTitle || source.title || '';
            resolvedData = source.data ?? resolvedData;
        } else if (source.name) {
            const page = pages.value.find(item => item.name === source.name);
            if (page) {
                component = toAsyncComponent(page.component);
                resolvedTitle = resolvedTitle || page.meta?.title || '';
            }
        }
    }

    if (!component) return null;

    return {
        id: nextPageId(),
        component,
        data: resolvedData,
        title: resolvedTitle,
    };
}

function createRootEntry() {
    return {
        id: nextPageId(),
        component: props.win.component,
        data: props.win.data ?? {},
        title: props.win.title ?? props.win.meta?.title ?? '',
    };
}

// 页面栈：[{ id, component, data, title }] — 底层页面保持挂载，仅 pop 时销毁
const pageStack = ref([createRootEntry()]);
// 前进栈：返回时暂存已关闭页面，前进时重新挂载
const forwardStack = ref([]);
const leavingId = ref(null);
const enteringId = ref(null);

const currentPage = computed(() => pageStack.value[pageStack.value.length - 1]);
const canGoBack = computed(() => pageStack.value.length > 1);
const canGoForward = computed(() => forwardStack.value.length > 0);
const showNavButtons = computed(() => canGoBack.value || canGoForward.value);

function waitPageAnim() {
    return new Promise(resolve => setTimeout(resolve, PAGE_ANIM_MS));
}

function isPageVisible(page, index) {
    const topIndex = pageStack.value.length - 1;

    if (leavingId.value) {
        if (page.id === leavingId.value) return true;
        if (index === topIndex - 1) return true;
        return false;
    }

    return index === topIndex;
}

function pageLayerClass(page, index) {
    if (leavingId.value === page.id) return 'layer-leave-back';
    if (enteringId.value === page.id) return 'layer-enter-forward';
    if (isPageVisible(page, index)) return 'layer-active';
    return 'layer-hidden';
}

function navigate(source, data, title) {
    const entry = resolvePage(source, data, title);
    if (!entry) return;

    forwardStack.value = [];
    pageStack.value.push(entry);
    enteringId.value = entry.id;

    waitPageAnim().then(() => {
        if (enteringId.value === entry.id) {
            enteringId.value = null;
        }
    });
}

async function goBack() {
    if (!canGoBack.value || leavingId.value) return;

    const top = pageStack.value[pageStack.value.length - 1];
    leavingId.value = top.id;

    await waitPageAnim();

    pageStack.value.pop();
    forwardStack.value.push(top);
    leavingId.value = null;
}

async function goForward() {
    if (!canGoForward.value || leavingId.value || enteringId.value) return;

    const entry = forwardStack.value.pop();
    pageStack.value.push(entry);
    enteringId.value = entry.id;

    await waitPageAnim();
    enteringId.value = null;
}

function reloadCurrent() {
    if (!pageStack.value.length) return;

    forwardStack.value = [];
    const index = pageStack.value.length - 1;
    const current = pageStack.value[index];
    pageStack.value[index] = {
        ...current,
        id: nextPageId(),
    };
}

provide('windowNav', {
    navigate,
    goBack,
    goForward,
    reload: reloadCurrent,
    canGoBack,
    canGoForward,
});
</script>

<template>
    <Window
        :options="options"
        @created="emit('created', $event)"
        @focus="emit('focus')"
        @minimize="emit('minimize')"
        @restore="emit('restore')"
        @close="emit('close')"
    >
        <template #header>
            <div class="app-win-nav-bar">
                <div class="right_btns">
                    <div v-if="showNavButtons" class="row">
                        <q-btn
                            icon="chevron_left"
                            flat
                            round
                            dense
                            size="sm"
                            :disable="!canGoBack"
                            @click.stop="goBack"
                        />
                        <q-btn
                            icon="chevron_right"
                            flat
                            round
                            dense
                            size="sm"
                            :disable="!canGoForward"
                            @click.stop="goForward"
                        />
                    </div>
                    <q-btn icon="refresh" flat round dense size="sm" @click.stop="reloadCurrent" />
                </div>
            </div>
        </template>

        <div v-if="currentPage?.component" class="app-win-wrapper">
            <div class="app-win-page-wrap">
                <div
                    v-for="(page, index) in pageStack"
                    :key="page.id"
                    class="app-win-page-layer"
                    :class="pageLayerClass(page, index)"
                    :style="{ zIndex: index + 1 }"
                >
                    <component :is="page.component" :window-data="page.data" class="app-win-page" />
                </div>
            </div>
        </div>
    </Window>
</template>

<style scoped lang="scss">
.app-win-wrapper {
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100%;
    overflow: hidden;
    background: #f2f2f7;
}

.app-win-nav-bar {
    height: 100%;
    float: right;

    .right_btns {
        display: flex;
        align-items: center;
        gap: 8px;
        height: 100%;
        justify-content: center;
        padding-right: 14px;
    }
}

.app-win-page-wrap {
    flex: 1;
    position: relative;
    overflow: hidden;
}

.app-win-page-layer {
    position: absolute;
    inset: 0;
    overflow: hidden;
    pointer-events: none;
    visibility: hidden;
}

.app-win-page-layer.layer-active,
.app-win-page-layer.layer-enter-forward,
.app-win-page-layer.layer-leave-back {
    visibility: visible;
}

.app-win-page-layer.layer-active,
.app-win-page-layer.layer-enter-forward {
    pointer-events: auto;
}

.app-win-page {
    width: 100%;
    height: 100%;
    overflow: auto;
}

.layer-enter-forward {
    animation: page-slide-in-forward 0.32s cubic-bezier(0.4, 0, 0.2, 1) forwards;
}

.layer-leave-back {
    animation: page-slide-out-back 0.32s cubic-bezier(0.4, 0, 0.2, 1) forwards;
}

@keyframes page-slide-in-forward {
    from {
        transform: translateX(100%);
    }
    to {
        transform: translateX(0);
    }
}

@keyframes page-slide-out-back {
    from {
        transform: translateX(0);
    }
    to {
        transform: translateX(100%);
    }
}
</style>
