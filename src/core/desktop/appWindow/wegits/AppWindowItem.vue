<script setup>
import Window from './Window.vue';
import useWinStore from '@/core/store/useWinStore';

const { pages } = storeToRefs(useWinStore());

const props = defineProps({
    win: Object,
    options: Object,
});

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
const winboxInstance = shallowRef(null);
const listenerMap = new Map();

function onWinbox(event, payload) {
    if (event === 'created') {
        winboxInstance.value = markRaw(payload);
    }

    listenerMap.get(event)?.forEach(fn => fn(payload));
}

function on(event, callback) {
    if (typeof callback !== 'function') return () => {};

    if (!listenerMap.has(event)) {
        listenerMap.set(event, new Set());
    }
    listenerMap.get(event).add(callback);

    if (event === 'created' && winboxInstance.value) {
        callback(winboxInstance.value);
    }

    return () => listenerMap.get(event)?.delete(callback);
}

function createWinboxListener(event) {
    return callback => on(event, callback);
}

const created = createWinboxListener('created');
const focus = createWinboxListener('focus');
const blur = createWinboxListener('blur');
const minimize = createWinboxListener('minimize');
const restore = createWinboxListener('restore');
const close = createWinboxListener('close');
const move = createWinboxListener('move');
const resize = createWinboxListener('resize');

onBeforeUnmount(() => {
    listenerMap.clear();
});

const currentPage = computed(() => pageStack.value[pageStack.value.length - 1]);
const canGoBack = computed(() => pageStack.value.length > 1);
const canGoForward = computed(() => forwardStack.value.length > 0);
const showNavButtons = computed(() => canGoBack.value || canGoForward.value);
const title = computed(() => {
    if (currentPage.value?.title !== props.win.title) {
        return ` / ${currentPage.value?.title}`;
    }
    return '';
});

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

provide('useAppWin', {
    navigate,
    goBack,
    goForward,
    reload: reloadCurrent,
    canGoBack,
    canGoForward,
    instance: readonly(winboxInstance),
    created,
    focus,
    blur,
    minimize,
    restore,
    close,
    move,
    resize,
});
</script>

<template>
    <Window
        :options="options"
        @created="e => onWinbox('created', e)"
        @focus="e => onWinbox('focus', e)"
        @blur="e => onWinbox('blur', e)"
        @minimize="e => onWinbox('minimize', e)"
        @restore="e => onWinbox('restore', e)"
        @close="e => onWinbox('close', e)"
        @move="e => onWinbox('move', e)"
        @resize="e => onWinbox('resize', e)"
    >
        <template #header>
            <div class="app-win-nav-bar">
                <div class="right_btns" @click.stop>
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

        <template #title>{{ title }}</template>

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
