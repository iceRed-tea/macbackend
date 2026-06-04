<script>
const dockMinimizedWindows = new Map();
let dockMinimizedRaf = 0;

function placeMinimizedInDock(winbox, name) {
    if (!winbox?.dom || !name || !winbox.min) return;

    const dockItem = document.querySelector(`.dock-item[data-app-name="${CSS.escape(name)}"]`);
    if (!dockItem) return;

    const rect = dockItem.getBoundingClientRect();
    const width = Math.round(rect.width);
    const height = winbox.header || 'auto';
    const x = Math.round(rect.left);
    console.log(x);

    const y = Math.round(rect.top + (rect.height - height) / 2) - 8;

    winbox.dom.classList.add('dock-minimized');
    winbox.resize(width, height, true).move(x, y, true);
}

function refreshDockMinimizedWindows() {
    dockMinimizedWindows.forEach(({ winbox, name }, key) => {
        if (!winbox?.dom || !winbox.min) {
            dockMinimizedWindows.delete(key);
            return;
        }

        placeMinimizedInDock(winbox, name);
    });
}

function scheduleDockMinimizedRefresh() {
    if (dockMinimizedRaf) cancelAnimationFrame(dockMinimizedRaf);
    dockMinimizedRaf = requestAnimationFrame(() => {
        dockMinimizedRaf = requestAnimationFrame(() => {
            dockMinimizedRaf = 0;
            refreshDockMinimizedWindows();
        });
    });
}

function registerDockMinimized(key, winbox, name) {
    dockMinimizedWindows.set(key, { winbox, name });
    scheduleDockMinimizedRefresh();
}

function unregisterDockMinimized(key, winbox) {
    dockMinimizedWindows.delete(key);
    winbox?.dom?.classList.remove('dock-minimized');
    scheduleDockMinimizedRefresh();
}
</script>

<script setup>
import WinBox from 'winbox';
import 'winbox/dist/css/winbox.min.css';
import { getDockOrigin, playWindowClose, playWindowOpen } from '../utils/windowAnimation';

const props = defineProps({
    options: {
        type: Object,
        required: true,
    },
});

const emit = defineEmits([
    'created',
    'move',
    'resize',
    'close',
    'focus',
    'blur',
    'minimize',
    'restore',
]);

const instance = shallowRef(null);
const ready = ref(false);
const isClosing = ref(false);
const dockMinimizedKey = computed(() => props.options?.id || props.options?.name);

const teleportTarget = computed(() => {
    const id = props.options?.id;
    return id ? `#${CSS.escape(id)} .wb-body` : null;
});

const headerTeleportTarget = computed(() => {
    const id = props.options?.id;
    return id ? `#${CSS.escape(id)} .wb-header-slot` : null;
});

async function init() {
    if (instance.value) return;

    const {
        onmove,
        onresize,
        onclose,
        onfocus,
        onblur,
        onminimize,
        onrestore,
        launchOrigin,
        name,
        ...rest
    } = props.options;

    instance.value = new WinBox({
        ...rest,
        onmove(x, y, width, height) {
            onmove?.(x, y, width, height);
            emit('move', { x, y, width, height });
        },
        onresize(width, height) {
            onresize?.(width, height);
            emit('resize', { width, height });
        },
        onclose(force) {
            if (force) return false;
            if (isClosing.value) return true;

            isClosing.value = true;
            unregisterDockMinimized(dockMinimizedKey.value, instance.value);
            const origin = getDockOrigin(name);

            playWindowClose(instance.value.dom, origin).then(() => {
                onclose?.();
                emit('close');
                ready.value = false;
                instance.value?.close(true);
                instance.value = null;
            });

            return true;
        },
        onfocus() {
            onfocus?.();
            emit('focus');
        },
        onblur() {
            onblur?.();
            emit('blur');
        },
        onminimize() {
            registerDockMinimized(dockMinimizedKey.value, instance.value, name);
            onminimize?.();
            emit('minimize');
        },
        onrestore() {
            unregisterDockMinimized(dockMinimizedKey.value, instance.value);
            onrestore?.();
            emit('restore');
        },
    });
    emit('created', instance.value);

    await nextTick();

    if (launchOrigin && instance.value?.dom) {
        await playWindowOpen(instance.value.dom, launchOrigin);
    }

    ready.value = true;
}

onMounted(init);

onBeforeUnmount(() => {
    if (!instance.value) return;
    unregisterDockMinimized(dockMinimizedKey.value, instance.value);
    instance.value.close(true);
    instance.value = null;
    ready.value = false;
});

defineExpose({
    instance,
    ready,
});
</script>

<template>
    <Teleport v-if="ready && headerTeleportTarget" :to="headerTeleportTarget">
        <slot name="header" />
    </Teleport>
    <Teleport v-if="ready && teleportTarget" :to="teleportTarget">
        <div class="winbox-window-content">
            <slot />
        </div>
    </Teleport>
</template>

<style scoped>
.winbox-window-content {
    width: 100%;
    height: 100%;
    min-height: 100%;
}
</style>
